import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getNotes } from '../utils/storage';
import { CATEGORIES } from '../types/notes';
import { Tab, icons } from '../assets';

const HomeScreen = () => {
  const [notesByCategory, setNotesByCategory] = useState<Record<string, any[]>>({});
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadNotes = async () => {
    const allNotes = await getNotes();
    const grouped: Record<string, any[]> = {};
    CATEGORIES.forEach(category => {
      const categoryNotes = allNotes
        .filter(note => note.category === category)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      grouped[category] = categoryNotes;
    });
    setNotesByCategory(grouped);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadNotes();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const truncateContent = (content: string) => {
    return content.length > 20 ? content.substring(0, 20) + '...' : content;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={icons.settings} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={Object.values(notesByCategory).every(notes => notes.length === 0) ? styles.emptyStateContainer : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF1CF7"
            colors={['#FF1CF7']}
          />
        }
      >
        {Object.values(notesByCategory).every(notes => notes.length === 0) ? (
          <TouchableOpacity 
            style={styles.emptyState}
            onPress={() => navigation.navigate('NewNote')}
          >
            <Text style={styles.emptyStateText}>Press '+' to add notes</Text>
          </TouchableOpacity>
        ) : (
          <>
            {Object.values(notesByCategory).some(notes => notes.length > 0) && (
              <View style={styles.sectionTitleContainer}>
                <Image source={icons.clock} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Recently created notes</Text>
              </View>
            )}

            {CATEGORIES.map(category => {
              const categoryNotes = notesByCategory[category] || [];
              if (categoryNotes.length === 0) return null;
              
              const getCategoryIcon = (category: string) => {
                switch (category) {
                  case 'Work and Study':
                    return icons.ws;
                  case 'Life':
                    return icons.life;
                  case 'Health and Well-being':
                    return icons.wellness;
                  default:
                    return null;
                }
              };

              return (
                <View key={category} style={styles.section}>
                  <View style={styles.categoryTitleContainer}>
                    <Image source={getCategoryIcon(category)} style={styles.categoryIcon} />
                    <Text style={styles.categoryTitle}>{category}</Text>
                  </View>
                  {categoryNotes.slice(0, 3).map(note => (
                    <TouchableOpacity 
                      key={note.id}
                      style={styles.noteItem}
                      onPress={() => navigation.navigate('NewNote', { note })}
                    >
                      <Text style={styles.noteText} numberOfLines={1}>
                        {truncateContent(note.content)}
                      </Text>
                      <Text style={styles.noteArrow}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image source={Tab.Home} style={styles.tabIcon} />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewNote')}
        >
          <Image source={Tab.Add} style={styles.addButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Summary')}
        >
          <Image source={Tab.Summary} style={styles.tabIcon} />
          <Text style={styles.navText}>Summary</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsIcon: {
    width: 18,
    height: 18,
    tintColor: '#FF1CF7',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  sectionTitle: {
    color: '#9D9D9D',
    fontSize: 14,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 14,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1F4D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  noteArrow: {
    color: '#F94695',
    fontSize: 20,
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2D1F4D',
    paddingVertical: 8,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  navText: {
    color: 'white',
    fontSize: 14,
  },
  activeNavText: {
    color: '#F94695',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  addButtonIcon: {
    width: 32,
    height: 32
  },
  tabIcon: {
    width: 29,
    height: 29,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#2D1F4D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '80%',
  },
  emptyStateText: {
    color: '#9D9D9D',
    fontSize: 16,
  },
});

export default HomeScreen;
