import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Modal, FlatList, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { saveNote, deleteNote } from '../utils/storage';
import { CATEGORIES } from '../types/notes';
import CustomAlert from '../components/CustomAlert';
import { icons, Tab } from '../assets';

const CHAR_LIMIT = 200;

const NewNoteScreen = () => {
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const existingNote = route.params?.note;

  useEffect(() => {
    if (existingNote) {
      setCategory(existingNote.category);
      setContent(existingNote.content.substring(0, CHAR_LIMIT));
    }
  }, [existingNote]);

  const handleContentChange = (text: string) => {
    if (text.length <= CHAR_LIMIT) {
      setContent(text);
    }
  };

  const handleSaveNote = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await saveNote({
        id: existingNote?.id,
        category,
        content,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!existingNote?.id) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNote(existingNote.id);
      setShowDeleteConfirm(false);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, category === item && styles.selectedCategoryItem]}
      onPress={() => {
        setCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <Text style={[styles.categoryItemText, category === item && styles.selectedCategoryText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{existingNote ? 'Edit note' : 'New note'}</Text>
        </View>
        {existingNote && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteNote}
          >
            <Image source={icons.delete} style={styles.deleteIcon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryText}>{category}</Text>
          <Text style={styles.categoryArrow}>⌄</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            multiline
            placeholder="Please input note content"
            placeholderTextColor="#666"
            value={content}
            onChangeText={handleContentChange}
            maxLength={CHAR_LIMIT}
          />
          <Text style={styles.charCount}>
            {content.length}/{CHAR_LIMIT}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
        onPress={handleSaveNote}
        disabled={!content.trim()}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.modalCloseButton}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={item => item}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={showDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        showButtons={true}
      />

      {/* <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Image source={Tab.Home} style={styles.tabIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Image source={Tab.Add} style={styles.addButtonIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Summary')}
        >
          <Image source={Tab.Summary} style={styles.tabIcon} />
          <Text style={styles.navText}>Summary</Text>
        </TouchableOpacity>
      </View> */}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2D1F4D',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
  },
  categoryArrow: {
    color: 'white',
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
  },
  contentInput: {
    backgroundColor: '#2D1F4D',
    borderRadius: 8,
    padding: 16,
    color: 'white',
    fontSize: 16,
    height: 200,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#9D9D9D',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#F94695',
    margin: 16,
    padding: 16,
    borderRadius: 30,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A0B2E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D1F4D',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    color: 'white',
    fontSize: 24,
  },
  categoryList: {
    padding: 16,
  },
  categoryItem: {
    backgroundColor: '#2D1F4D',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategoryItem: {
    backgroundColor: '#F94695',
  },
  categoryItemText: {
    color: 'white',
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
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
});

export default NewNoteScreen;
