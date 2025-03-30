import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Image } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { getNotes } from '../utils/storage';
import { CATEGORIES } from '../types/notes';
import { Tab, icons } from '../assets';

const SummaryScreen = () => {
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [categoryNotes, setCategoryNotes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const selectedCategory = route.params?.category;

  const loadStats = useCallback(async () => {
    const allNotes = await getNotes();
    
    if (selectedCategory) {
      const notes = allNotes
        .filter(note => note.category === selectedCategory)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCategoryNotes(notes);
    } else {
      const stats: Record<string, number> = {};
      CATEGORIES.forEach(category => {
        stats[category] = allNotes.filter(note => note.category === category).length;
      });
      setCategoryStats(stats);
    }
  }, [selectedCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadStats();
    } finally {
      setRefreshing(false);
    }
  }, [loadStats]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const truncateContent = (content: string) => {
    return content.length > 20 ? content.substring(0, 20) + '...' : content;
  };

  if (selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
            <Text style={styles.headerTitle}>{selectedCategory}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF1CF7"
              colors={['#FF1CF7']}
            />
          }
        >
          {categoryNotes.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No notes under this category</Text>
            </View>
          ) : (
            categoryNotes.map(note => (
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
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Summary</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF1CF7"
            colors={['#FF1CF7']}
          />
        }
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity 
            key={category}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('SummaryDetail', { category })}
          >
            <View style={styles.categoryIcon}>
              <Image 
                source={
                  category === 'Work and Study' ? icons.summary_ws :
                  category === 'Life' ? icons.summary_life :
                  icons.summary_wellness
                }
                style={styles.iconImage}
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryCount}>
                This topic has a total of {categoryStats[category]} records.
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('SummaryDetail', { category })}
            >
              <Text style={styles.detailButtonText}>Detail</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Image source={Tab.Home} style={styles.tabIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('NewNote')}
        >
          <Image source={Tab.Add} style={styles.addButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={Tab.Summary} style={styles.tabIcon} />
          <Text style={[styles.navText, styles.activeNavText]}>Summary</Text>
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
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1F4D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 32,
    height: 32,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryCount: {
    color: '#9D9D9D',
    fontSize: 14,
  },
  detailButton: {
    backgroundColor: '#F94695',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  detailButtonText: {
    color: 'white',
    fontSize: 14,
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
    height: 32,
  },
  tabIcon: {
    width: 29,
    height: 29,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
    marginRight: 8,
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
    color: 'white',
    fontSize: 20,
    marginLeft: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    padding: 16,
  },
  emptyStateText: {
    color: '#9D9D9D',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SummaryScreen;
