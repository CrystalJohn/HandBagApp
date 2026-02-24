import React from 'react';
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
  
  // Lấy data và hàm từ Zustand Store (Chỉ tốn 1 dòng!)
  const { favorites, clearAll } = useFavoriteStore();

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
        <Pressable onPress={handleClearAll} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          data={favorites}
          estimatedItemSize={250}
          renderItem={({ item }) => (
            <HandbagCard 
              item={item} 
              onPress={() => navigation.navigate('Detail', { handbag: item })} 
            />
          )}
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
  clearBtnText: { color: '#d32f2f', fontWeight: 'bold' }
});