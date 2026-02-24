import React, { useMemo, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  Pressable, Animated, Dimensions 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types/navigation';
import { useFavoriteStore } from '../../store/useFavoriteStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const { width } = Dimensions.get('window');

// 1. MOCK DATA MỚI: Tập trung vào các review 1 Sao và 2 Sao
const generateMockReviews = (id: string) => {
  const baseReviews = [
    { id: 'r1', user: 'AngryBuyer99', rating: 1, comment: 'Chất lượng da quá tệ, bong tróc chỉ sau 1 tuần sử dụng! Đừng mua!' },
    { id: 'r2', user: 'SadCustomer', rating: 1, comment: 'Màu thực tế sai hoàn toàn so với hình ảnh. Rất thất vọng.' },
    { id: 'r3', user: 'JohnDoe', rating: 2, comment: 'Đóng gói cẩu thả, túi bị móp khi giao đến.' },
    { id: 'r4', user: 'Alice', rating: 4, comment: 'Khá ổn, nhưng khóa kéo hơi rít.' },
    { id: 'r5', user: 'Emma', rating: 5, comment: 'Tuyệt vời, mình rất thích.' },
  ];
  const count = (parseInt(id) % 3) + 3; // Lấy 3-5 review
  return baseReviews.slice(0, count);
};

export default function DetailScreen({ route, navigation }: Props) {
  const { handbag } = route.params;
  const { favorites, toggleFavorite } = useFavoriteStore();
  const isFavorite = favorites.some((fav) => fav.id === handbag.id);

  const reviews = useMemo(() => generateMockReviews(handbag.id), [handbag.id]);

  // --- LOGIC ANIMATION CHO "SMALL TAB" (SNACKBAR) ---
  const slideAnim = useRef(new Animated.Value(100)).current; // 100 là vị trí ẩn dưới đáy
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    
    // Dừng mọi animation đang chạy (nếu người dùng bấm tim liên tục)
    slideAnim.stopAnimation();

    // Chuỗi hành động: Trượt lên -> Đợi 3 giây -> Trượt xuống
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0, // Trượt lên vị trí ban đầu
        duration: 300,
        useNativeDriver: true, // Bắt buộc để mượt
      }),
      Animated.delay(3000), // Dừng lại 3 giây cho User đọc
      Animated.timing(slideAnim, {
        toValue: 100, // Trượt trả lại xuống đáy
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(handbag); // Gọi Zustand
    
    // Check state để hiện câu text tương ứng
    if (!isFavorite) {
      showToast('❤️ Đã thêm vào Yêu thích!');
    } else {
      showToast('💔 Đã bỏ Yêu thích!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* ẢNH SẢN PHẨM & NÚT YÊU THÍCH CHÍNH */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: handbag.uri }} style={styles.image} />
          
          <Pressable 
            style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={28} 
              color={isFavorite ? "white" : "#e91e63"} 
            />
          </Pressable>
        </View>

        {/* THÔNG TIN COMPACT (LƯỢC BỎ GIÁ CẢ DÀI DÒNG) */}
        <View style={styles.infoSection}>
          <Text style={styles.brand}>{handbag.brand}</Text>
          <Text style={styles.title}>{handbag.handbagName}</Text>
          {/* Chỉ hiện 1 dòng giá nhỏ gọn */}
          <Text style={styles.compactPrice}>Price: ${(handbag.cost * (1 - handbag.percentOff)).toFixed(2)}</Text>
        </View>

        {/* KHU VỰC FEEDBACK - ĐẢO NGƯỢC: 1 SAO LÊN ĐẦU */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>⚠️ Critical Reviews (Tiêu cực)</Text>
          <Text style={styles.feedbackSub}>Những đánh giá 1 sao cần lưu ý trước khi mua</Text>
          
          {/* Duyệt mảng từ 1 SAO ĐẾN 5 SAO (Ưu tiên hiển thị mảng 1 sao trước) */}
          {[1, 2, 3, 4, 5].map((starRating) => {
            const starReviews = reviews.filter(r => r.rating === starRating);
            if (starReviews.length === 0) return null; 

            // Highlight màu đỏ cho 1 và 2 sao
            const isCritical = starRating <= 2;

            return (
              <View key={starRating} style={styles.ratingGroup}>
                <View style={[styles.starHeader, isCritical && styles.criticalHeader]}>
                  <Text style={[styles.starHeaderText, isCritical && { color: '#d32f2f' }]}>
                    {starRating}
                  </Text>
                  <Ionicons name="star" size={16} color={isCritical ? "#d32f2f" : "#FFD700"} />
                  <Text style={styles.reviewCount}>({starReviews.length} đánh giá)</Text>
                </View>

                {starReviews.map((review) => (
                  <View key={review.id} style={[styles.commentCard, isCritical && styles.criticalCard]}>
                    <Text style={styles.userName}>{review.user}</Text>
                    <Text style={styles.commentText}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 🌟 CUSTOM SNACKBAR (CÁI "TAB NHỎ" LIÊN ĐỚI SCREEN) 🌟 */}
      <Animated.View style={[styles.snackbar, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.snackbarText}>{toastMessage}</Text>
        <Pressable 
          style={styles.snackbarAction}
          onPress={() => {
            // Nhảy xuyên qua RootStack vào Tab Yêu thích
            navigation.navigate('MainTabs' as any, { screen: 'Favorites' });
          }}
        >
          <Text style={styles.snackbarActionText}>Xem ngay</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFD700" />
        </Pressable>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 380, resizeMode: 'cover' },
  favoriteBtn: {
    position: 'absolute', bottom: -28, right: 24,
    backgroundColor: 'white', width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
  },
  favoriteBtnActive: { backgroundColor: '#e91e63' },
  infoSection: { padding: 20, paddingTop: 35, paddingBottom: 10 },
  brand: { fontSize: 14, color: '#757575', textTransform: 'uppercase', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 6, color: '#212121' },
  compactPrice: { fontSize: 16, color: '#e91e63', fontWeight: '600' },
  
  feedbackSection: { padding: 20, backgroundColor: '#fff5f5', borderTopWidth: 1, borderColor: '#ffebee' },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', color: '#d32f2f' },
  feedbackSub: { fontSize: 13, color: '#757575', marginBottom: 20, marginTop: 4 },
  ratingGroup: { marginBottom: 20 },
  starHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 5 },
  criticalHeader: { borderBottomColor: '#ffcdd2' },
  starHeaderText: { fontSize: 18, fontWeight: 'bold', marginRight: 4 },
  reviewCount: { fontSize: 14, color: '#757575', marginLeft: 8 },
  commentCard: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eeeeee' },
  criticalCard: { borderColor: '#ffcdd2', backgroundColor: '#fffafb' },
  userName: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  commentText: { fontSize: 14, color: '#424242', lineHeight: 20 },

  // Giao diện Snackbar (Tab nhỏ điều hướng)
  snackbar: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: '#323232', borderRadius: 8, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 10,
  },
  snackbarText: { color: 'white', fontSize: 14, fontWeight: '500' },
  snackbarAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#555', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  snackbarActionText: { color: '#FFD700', fontWeight: 'bold', marginRight: 4, fontSize: 13 }
});