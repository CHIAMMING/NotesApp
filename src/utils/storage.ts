import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/notes';

const NOTES_KEY = '@notes';

export const saveNote = async (note: Partial<Note> & { content: string; category: string }) => {
  try {
    const existingNotes = await getNotes();
    let updatedNotes;

    if (note.id) {
      // Update existing note
      updatedNotes = existingNotes.map(existingNote => 
        existingNote.id === note.id 
          ? { ...existingNote, ...note }
          : existingNote
      );
    } else {
      // Create new note
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      updatedNotes = [...existingNotes, newNote];
    }

    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
    return note.id ? note : updatedNotes[updatedNotes.length - 1];
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const notes = await AsyncStorage.getItem(NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const deleteAllNotes = async () => {
  try {
    await AsyncStorage.removeItem(NOTES_KEY);
  } catch (error) {
    console.error('Error deleting notes:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string) => {
  try {
    const existingNotes = await getNotes();
    const updatedNotes = existingNotes.filter(note => note.id !== noteId);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};
