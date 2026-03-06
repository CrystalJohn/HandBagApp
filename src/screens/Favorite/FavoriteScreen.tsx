import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';

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
  
  // RESET TRẠNG THÁI KHI RỜI KHỎI MÀN HÌNH
  useFocusEffect(
    useCallback(() => {
      // Khi màn hình blur (mất focus), hàm cleanup này sẽ chạy
      return () => {
        setIsSelectionMode(false);
        setSelectedIds([]);
      };
    }, [])
  );

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

  const isAllSelected = selectedIds.length === favorites.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // Bỏ chọn hết
    } else {
      const allIds = favorites.map(item => item.id);
      setSelectedIds(allIds); // Chọn hết
    }
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
        {isSelectionMode ? (
          <>
            <View style={styles.headerSelectionLeft}>
              <Pressable onPress={toggleSelectionMode} style={styles.cancelIconBtn}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
              <Text style={styles.headerSelectionText}>
                {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select Items'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>My Favorites ({favorites.length})</Text>
            <View style={styles.headerNormalRight}>
              <Pressable onPress={handleClearAll} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={22} color="#757575" />
              </Pressable>
              {favorites.length >= 3 && (
                <Pressable onPress={toggleSelectionMode} style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>Select</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          data={favorites}
          // @ts-ignore - FlashList is incorrectly picking up FlatList types in this env
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
          contentContainerStyle={{ padding: 16, paddingBottom: isSelectionMode ? 100 : 16 }}
        />
      </View>

      {/* 🚀 FLOATING BOTTOM ACTION BAR CHO CHẾ ĐỘ SELECTION */}
      {isSelectionMode && (
        <View style={styles.bottomActionBar}>
          <Pressable onPress={handleToggleSelectAll} style={styles.bottomSelectAllBtn}>
            <Ionicons 
              name={isAllSelected ? "checkmark-circle" : "ellipse-outline"} 
              size={22} 
              color={isAllSelected ? "#e91e63" : "#757575"} 
            />
            <Text style={[styles.bottomSelectAllText, isAllSelected && { color: '#e91e63' }]}>
              All
            </Text>
          </Pressable>

          <Pressable 
            style={[styles.bottomDeleteBtn, selectedIds.length === 0 && styles.bottomDeleteBtnDisabled]}
            disabled={selectedIds.length === 0}
            onPress={handleBulkDelete}
          >
            <Text style={styles.bottomDeleteBtnText}>
              Delete {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </Text>
          </Pressable>
        </View>
      )}
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
    paddingBottom: 10,
    minHeight: 44,
  },
  headerSelectionLeft: { flexDirection: 'row', alignItems: 'center' },
  headerSelectionText: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  headerNormalRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111' },
  
  iconBtn: { padding: 4 },
  cancelIconBtn: { padding: 4, backgroundColor: '#f0f0f0', borderRadius: 20 },
  
  selectBtn: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#e3f2fd', borderRadius: 20 },
  selectBtnText: { color: '#1976d2', fontWeight: 'bold', fontSize: 14 },
  
  checkbox: { 
    position: 'absolute', top: 20, left: 20, // Move to left for easier thumb access when scrolling
    width: 28, height: 28, borderRadius: 14, 
    borderWidth: 2, borderColor: '#fff', 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10, elevation: 5 
  },
  checkboxSelected: { backgroundColor: '#e91e63', borderColor: '#e91e63' },

  // Bottom Floating Action Bar
  bottomActionBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30, // SafeArea spacing
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 15,
  },
  bottomSelectAllBtn: { flexDirection: 'row', alignItems: 'center' },
  bottomSelectAllText: { fontSize: 16, fontWeight: '600', color: '#757575', marginLeft: 8 },
  bottomDeleteBtn: { backgroundColor: '#e91e63', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
  bottomDeleteBtnDisabled: { backgroundColor: '#ffcdd2' },
  bottomDeleteBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
});