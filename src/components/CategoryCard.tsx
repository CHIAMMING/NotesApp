import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Note } from '../types/notes';

const CategoryCard = ({ 
  category, 
  notes, 
  onPress 
}: { 
  category: string, 
  notes: Note[], 
  onPress: () => void 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.header}>
        <Text style={styles.title}>{category}</Text>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
      
      {notes.length > 0 ? (
        notes.map(note => (
          <View key={note.id} style={styles.noteItem}>
            <Text style={styles.noteContent}>
              {note.content.length > 20 ? `${note.content.substring(0, 20)}...` : note.content}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No notes in this category</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#6200ee',
  },
  noteItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteContent: {
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

export default CategoryCard;
