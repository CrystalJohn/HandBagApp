import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Imports
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { HandbagCard } from '../Home/components/HandbagCard'; // Tái sử dụng Component cực tốt!
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';

export default function FavoriteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Lấy data và hàm từ Zustand Store
  const { favorites, clearAll, removeFavorites } = useFavoriteStore();

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]); // reset selection
  };

  const toggleItemSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    Alert.alert(
      "Remove Favorites",
      `Are you sure you want to remove ${selectedIds.length} items?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Delete", 
          style: "destructive", 
          onPress: () => {
            removeFavorites(selectedIds);
            setIsSelectionMode(false);
            setSelectedIds([]);
          } 
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all handbags from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, Delete", style: "destructive", onPress: clearAll }
      ]
    );
  };

  // NẾU TRỐNG
  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="heart-dislike-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>You haven't added any favorites yet.</Text>
      </SafeAreaView>
    );
  }

  // NẾU CÓ DATA
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favorites ({favorites.length})</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {isSelectionMode ? (
            <>
              {selectedIds.length > 0 && (
                <Pressable onPress={handleBulkDelete} style={styles.deleteBtn}>
                  <Text style={styles.deleteBtnText}>Delete ({selectedIds.length})</Text>
                </Pressable>
              )}
              <Pressable onPress={toggleSelectionMode} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={toggleSelectionMode} style={styles.selectBtn}>
                <Text style={styles.selectBtnText}>Select</Text>
              </Pressable>
              <Pressable onPress={handleClearAll} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Clear All</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          data={favorites}
          estimatedItemSize={250}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <View style={{ position: 'relative' }}>
                <View style={{ opacity: isSelectionMode && !isSelected ? 0.7 : 1 }}>
                  <HandbagCard 
                    item={item} 
                    onPress={() => {
                      if (isSelectionMode) {
                        toggleItemSelection(item.id);
                      } else {
                        navigation.navigate('Detail', { handbag: item });
                      }
                    }} 
                  />
                </View>
                {/* Checkbox Overlay */}
                {isSelectionMode && (
                  <Pressable 
                    style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                    onPress={() => toggleItemSelection(item.id)}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                  </Pressable>
                )}
              </View>
            );
          }}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 16, fontSize: 16, color: '#666' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingBottom: 10 
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  clearBtn: { padding: 8, backgroundColor: '#ffebee', borderRadius: 8 },
  clearBtnText: { color: '#d32f2f', fontWeight: 'bold' },
  deleteBtn: { padding: 8, backgroundColor: '#e91e63', borderRadius: 8 },
  deleteBtnText: { color: '#ffffff', fontWeight: 'bold' },
  cancelBtn: { padding: 8, backgroundColor: '#e0e0e0', borderRadius: 8 },
  cancelBtnText: { color: '#333333', fontWeight: 'bold' },
  selectBtn: { padding: 8, backgroundColor: '#e3f2fd', borderRadius: 8 },
  selectBtnText: { color: '#1976d2', fontWeight: 'bold' },
  checkbox: { 
    position: 'absolute', top: 20, right: 20, 
    width: 28, height: 28, borderRadius: 14, 
    borderWidth: 2, borderColor: '#fff', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10, elevation: 5 
  },
  checkboxSelected: { backgroundColor: '#e91e63', borderColor: '#e91e63' }
});