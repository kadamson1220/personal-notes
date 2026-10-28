import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NoteModal({ visible, note, onClose, onSave, errorMessage }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
  }, [note, visible]);

  function handleSave() {
    if (!title.trim()) {
      setTitleError("Please enter a title before saving.");
      return;
    }

    setTitleError("");
    onSave({ title: title.trim(), content: content.trim() });
  }

  const isEditing = note !== null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.shade} onPress={onClose} />
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.heading}>{isEditing ? "Edit note" : "New note"}</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Give your note a title"
            placeholderTextColor="#8a9aab"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <Text style={styles.label}>NOTE</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write something..."
            placeholderTextColor="#8a9aab"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {titleError ? <Text style={styles.error}>{titleError}</Text> : null}
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>{isEditing ? "Save changes" : "Save note"}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10, 32, 50, 0.45)" },
  modal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { color: "#18324a", fontSize: 20, fontWeight: "700" },
  close: { color: "#62788d", fontSize: 28, lineHeight: 30, paddingHorizontal: 4 },
  label: { color: "#526b80", fontSize: 11, fontWeight: "700", marginBottom: 7 },
  titleInput: {
    height: 46,
    borderWidth: 1,
    borderColor: "#d6e2ec",
    borderRadius: 9,
    paddingHorizontal: 12,
    color: "#18324a",
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#d6e2ec",
    borderRadius: 9,
    padding: 12,
    color: "#18324a",
    marginBottom: 18,
  },
  saveButton: { height: 47, borderRadius: 9, backgroundColor: "#3478f6", alignItems: "center", justifyContent: "center" },
  saveText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  error: { color: "#b42318", fontSize: 13, marginBottom: 12 },
  cancelButton: { paddingVertical: 12, alignItems: "center" },
  cancelText: { color: "#62788d", fontSize: 13 },
});
