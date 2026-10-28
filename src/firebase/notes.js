import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const notesCollection = collection(db, "notes");

// Listen for this user's notes. Firestore sends new data whenever it changes.
export function listenToNotes(userId, onNotesChange, onError) {
  const notesQuery = query(notesCollection, where("userId", "==", userId));

  return onSnapshot(
    notesQuery,
    (snapshot) => {
      const notes = snapshot.docs.map((noteDocument) => ({
        id: noteDocument.id,
        ...noteDocument.data(),
      })).sort((first, second) => {
        const firstDate = first.createdAt?.toMillis?.() || 0;
        const secondDate = second.createdAt?.toMillis?.() || 0;
        return secondDate - firstDate;
      });

      onNotesChange(notes);
    },
    onError,
  );
}

export function createNote(userId, title, content) {
  return addDoc(notesCollection, {
    userId,
    title,
    content,
    createdAt: serverTimestamp(),
    favorite: false,
  });
}

export function editNote(noteId, title, content) {
  return updateDoc(doc(db, "notes", noteId), { title, content });
}

export function changeFavorite(noteId, favorite) {
  return updateDoc(doc(db, "notes", noteId), { favorite });
}

export function removeNote(noteId) {
  return deleteDoc(doc(db, "notes", noteId));
}
