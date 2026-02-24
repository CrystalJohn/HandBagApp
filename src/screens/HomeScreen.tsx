import React, { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useHandbags } from '../hooks/useHandbags';
import { HandbagCard } from './Home/components/HandbagCard';
import { BottomTabParamList, RootStackParamList } from '../types/navigation';
import { Handbag } from '../types';
import { SearchBar } from '../components/SearchBar';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { data, isLoading, isError, error, refetch } = useHandbags();
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Khôi phục mảng unique brands từ data
  const brands = useMemo(() => {
    if (!data) return ['All'];
    const uniqueBrands = Array.from(new Set(data.map(item => item.brand)));
    return ['All', ...uniqueBrands];
  }, [data]);

  // Lọc và sắp xếp data theo brand, search query và cost giảm dần
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];
    
    let result = data;
    if (selectedBrand !== 'All') {
      result = result.filter(item => item.brand === selectedBrand);
    }
    
    // Logic search
    if (searchQuery.trim() !== '') {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();  // chuyển về chữ thường để so sánh
      result = result.filter(item => 
        item.handbagName.toLowerCase().includes(lowerCaseSearchQuery));  // tìm theo tên túi xách có chứa keyword ko? Ko phân biệt hoa thường
    }

    // Tạo mảng mới rồi sort để tránh mutate state cũ của React Query
    return [...result].sort((a, b) => b.cost - a.cost);
  }, [data, selectedBrand, searchQuery]);   // đưa search Query vào dependency array để khi user gõ làm đổi searchQuery thì mảng sẽ tự động co lại

  const renderItem = ({ item }: { item: Handbag }) => (
    <HandbagCard 
      item={item} 
      onPress={() => navigation.navigate('Detail', { handbag: item })} 
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text>Loading premium handbags...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
        <Button title="Try Again" onPress={() => refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Thanh Search */}
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        placeholder="Tìm kiếm túi xách theo tên..." 
      />
      {/* Horizontal Filter Bar */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {brands.map(brand => {
            const isSelected = brand === selectedBrand;
            return (
              <Pressable
                key={brand}
                style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
                onPress={() => setSelectedBrand(brand)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {brand}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.listContainer}>
        <FlashList<Handbag>
          data={filteredAndSortedData}
          renderItem={renderItem}
          // @ts-ignore - FlashList is incorrectly picking up FlatList types in this env
          estimatedItemSize={250}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.handbagName)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No handbags found for this brand.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 10 },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonSelected: {
    backgroundColor: '#e91e63',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});