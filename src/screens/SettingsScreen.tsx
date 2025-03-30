import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteAllNotes } from '../utils/storage';
import CustomAlert from '../components/CustomAlert';
import { icons } from '../assets';

const SettingsScreen = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigation = useNavigation();

  const openExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  const handleDeleteAllNotes = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAllNotes();
      setShowDeleteConfirm(false);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to delete notes:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
          <Text style={styles.headerTitle}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => openExternalLink('https://www.google.com')}
        >
          <View style={styles.menuLeft}>
            <Image source={icons.online_customer} style={styles.menuIcon} />
            <Text style={styles.menuText}>Online Customer</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => openExternalLink('https://www.google.com')}
        >
          <View style={styles.menuLeft}>
            <Image source={icons.user_agreement} style={styles.menuIcon} />
            <Text style={styles.menuText}>User Agreement</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => openExternalLink('https://www.google.com')}
        >
          <View style={styles.menuLeft}>
            <Image source={icons.privacy_policy} style={styles.menuIcon} />
            <Text style={styles.menuText}>Privacy Policy</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => openExternalLink('https://www.google.com')}
        >
          <View style={styles.menuLeft}>
            <Image source={icons.about_us} style={styles.menuIcon} />
            <Text style={styles.menuText}>About Us</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteAllNotes}
      >
        <Text style={styles.deleteButtonText}>Delete All Notes</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={showSuccessAlert}
        message="All notes have been cleared"
      />

      <CustomAlert
        visible={showDeleteConfirm}
        title="Delete All Notes"
        message="Are you sure you want to delete all notes? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        showButtons={true}
      />
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 28,
    marginRight: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(45, 31, 77, 0.5)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
  },
  menuArrow: {
    color: '#F94695',
    fontSize: 24,
  },
  deleteButton: {
    backgroundColor: '#F94695',
    margin: 16,
    padding: 16,
    borderRadius: 32,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SettingsScreen;
