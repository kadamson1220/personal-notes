import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite }) {
  const noteDate = note.createdAt?.toDate
    ? note.createdAt.toDate().toLocaleDateString()
    : "Just now";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.date}>{noteDate}</Text>
        <Pressable onPress={() => onToggleFavorite(note)} accessibilityLabel="Toggle favorite">
          <Text style={[styles.favorite, note.favorite && styles.favoriteActive]}>
            {note.favorite ? "★" : "☆"}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={() => onEdit(note)}>
        <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
        <Text style={styles.preview} numberOfLines={3}>
          {note.content || "No extra details"}
        </Text>
      </Pressable>

      <View style={styles.bottomRow}>
        <Text style={styles.tapHint}>Tap note to edit</Text>
        <Pressable onPress={() => onDelete(note.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 13,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5edf3",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  date: { color: "#8193a3", fontSize: 11 },
  favorite: { color: "#9baab7", fontSize: 24, lineHeight: 27 },
  favoriteActive: { color: "#e5a623" },
  title: { color: "#18324a", fontSize: 17, fontWeight: "700", marginTop: 3 },
  preview: { color: "#5e7182", fontSize: 13, lineHeight: 19, marginTop: 6 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eef2f5",
  },
  tapHint: { color: "#98a7b4", fontSize: 11 },
  deleteText: { color: "#bd4343", fontSize: 12, fontWeight: "600" },
});
