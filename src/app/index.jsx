import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthScreen from "../components/AuthScreen";
import FilterButton from "../components/FilterButton";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import { auth } from "../firebase/firebaseConfig";
import {
  changeFavorite,
  createNote,
  editNote,
  listenToNotes,
  removeNote,
} from "../firebase/notes";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingUser(false);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return undefined;
    }

    setIsLoadingNotes(true);
    setErrorMessage("");

    return listenToNotes(
      user.uid,
      (userNotes) => {
        setNotes(userNotes);
        setIsLoadingNotes(false);
      },
      (error) => {
        setErrorMessage(error.message || "Could not load notes.");
        setIsLoadingNotes(false);
      },
    );
  }, [user]);

  function openAddModal() {
    setErrorMessage("");
    setEditingNote(null);
    setModalVisible(true);
  }

  function openEditModal(note) {
    setErrorMessage("");
    setEditingNote(note);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingNote(null);
  }

  async function saveNote(noteData) {
    if (!user) return;

    try {
      if (editingNote) {
        await editNote(editingNote.id, noteData.title, noteData.content);
      } else {
        await createNote(user.uid, noteData.title, noteData.content);
      }

      closeModal();
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Could not save this note.");
    }
  }

  async function deleteNote(noteId) {
    try {
      await removeNote(noteId);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Could not delete this note.");
    }
  }

  async function toggleFavorite(note) {
    try {
      await changeFavorite(note.id, !note.favorite);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message || "Could not update this note.");
    }
  }

  async function logOut() {
    await signOut(auth);
    setFilter("All");
  }

  if (isCheckingUser) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#3478f6" />
        <Text style={styles.loadingText}>Opening your notes...</Text>
      </View>
    );
  }

  if (!user) return <AuthScreen />;

  const visibleNotes = filter === "Favorites"
    ? notes.filter((note) => note.favorite)
    : notes;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headingText}>
            <Text style={styles.title}>My Notes</Text>
            <Text style={styles.subtitle}>{notes.length} notes</Text>
          </View>
          <Pressable style={styles.addButton} onPress={openAddModal}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.userRow}>
          <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
          <Pressable onPress={logOut}>
            <Text style={styles.logOut}>Log out</Text>
          </Pressable>
        </View>

        <View style={styles.filters}>
          <FilterButton title="All notes" active={filter === "All"} onPress={() => setFilter("All")} />
          <FilterButton
            title="Favorites"
            active={filter === "Favorites"}
            onPress={() => setFilter("Favorites")}
          />
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {isLoadingNotes ? (
          <View style={styles.emptyState}>
            <ActivityIndicator color="#3478f6" />
            <Text style={styles.emptyText}>Loading notes...</Text>
          </View>
        ) : (
          <FlatList
            data={visibleNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onEdit={openEditModal}
                onDelete={deleteNote}
                onToggleFavorite={toggleFavorite}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={visibleNotes.length === 0 ? styles.listEmpty : styles.list}
            ListEmptyComponent={(
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  {filter === "Favorites" ? "No favorite notes yet" : "No notes yet"}
                </Text>
                <Text style={styles.emptyText}>Tap the + button to write your first note.</Text>
              </View>
            )}
          />
        )}

        <NoteModal
          visible={modalVisible}
          note={editingNote}
          errorMessage={errorMessage}
          onClose={closeModal}
          onSave={saveNote}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f7fa" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  loadingScreen: { flex: 1, backgroundColor: "#f3f7fa", justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#62788d", fontSize: 14, marginTop: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headingText: { flex: 1 },
  title: { color: "#18324a", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#72879a", fontSize: 13, marginTop: 3 },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#3478f6",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#ffffff", fontSize: 29, fontWeight: "300", marginTop: -4 },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e1eaf1",
  },
  email: { flex: 1, color: "#70869a", fontSize: 12, marginRight: 12 },
  logOut: { color: "#287b49", fontSize: 13, fontWeight: "600" },
  filters: { flexDirection: "row", gap: 9, paddingVertical: 16 },
  error: { color: "#b42318", fontSize: 12, marginBottom: 10 },
  list: { paddingBottom: 20 },
  listEmpty: { flexGrow: 1 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  emptyTitle: { color: "#18324a", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  emptyText: { color: "#72879a", fontSize: 13, textAlign: "center", marginTop: 8 },
});
