import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Note } from '../types/notes';

const NoteCard = ({ note }: { note: Note }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>{note.content}</Text>
      <Text style={styles.date}>
        {new Date(note.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default NoteCard;
