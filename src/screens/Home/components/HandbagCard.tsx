import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Handbag } from '../../../types';
import { useFavoriteStore } from '../../../store/useFavoriteStore';

interface HandbagCardProps {
  item: Handbag;
  onPress?: () => void;
}

export const HandbagCard: React.FC<HandbagCardProps> = ({ item, onPress }) => {
  const { handbagName, cost, uri, percentOff, brand, gender } = item;
  
  // Calculate final price based on discount 
  const finalPrice = cost * (1 - percentOff);

  const isFavorite = useFavoriteStore((state) => state.favorites.some(fav => fav.id === item.id));
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      
      {/* 🚀 BAGE GIẢM GIÁ (UX: CHỒNG LÊN HÌNH) */}
      {percentOff > 0 && (
        <View style={styles.discountOverlay}>
          <Text style={styles.discountOverlayText}>-{(percentOff * 100).toFixed(0)}%</Text>
        </View>
      )}

      <Pressable 
        style={styles.favoriteButton} 
        onPress={() => toggleFavorite(item)}
      >
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color="#e91e63" />
      </Pressable>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.brandText}>{brand}</Text>
          {/* If gender is false, display the male icon */}
          {gender === false && (
            <Ionicons name="male" size={16} color="#007bff" />
          )}
        </View>
        
        <Text style={styles.nameText} numberOfLines={2}>{handbagName}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.finalPriceText}>${finalPrice.toFixed(2)}</Text>
          {percentOff > 0 && (
            <Text style={styles.originalPriceText}>${cost.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    // iOS Shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Android Elevation
    elevation: 4,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  finalPriceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e91e63', // Matches the brand's pink color
    marginRight: 8,
  },
  originalPriceText: {
    fontSize: 14,
    color: '#aaa',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#d32f2f', // Đỏ rực
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  discountOverlayText: {
    color: '#ffffff', // Chữ trắng nổi bật
    fontWeight: '900', // Đậm nhất
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
    // iOS Shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Elevation
    elevation: 2,
  },
});
