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

// 1. MOCK DATA: Chứa cả review Tích cực và Tiêu cực
const generateMockReviews = (id: string) => {
  const baseReviews = [
    { id: 'r1', user: 'AngryBuyer99', rating: 1, comment: 'Chất lượng da quá tệ, bong tróc chỉ sau 1 tuần sử dụng! Đừng mua!' },
    { id: 'r2', user: 'Emma.Style', rating: 5, comment: 'Túi ở ngoài đẹp hơn trong hình nhiều! Rất xịn xò. Đáng tiền 😍' },
    { id: 'r3', user: 'SadCustomer', rating: 2, comment: 'Màu thực tế sai hoàn toàn so với hình ảnh. Khá thất vọng.' },
    { id: 'r4', user: 'ThuHoa_HCMC', rating: 5, comment: 'Đã mua cái thứ 3 rồi, chưa bao giờ làm mình thất vọng!' },
    { id: 'r5', user: 'NgocTran.Fashion', rating: 4, comment: 'Túi form cứng cáp, màu okela nhưng dây đeo hơi dài.' },
  ];
  return baseReviews; // Trả về toàn bộ để thấy rõ cả 2 loại
};

export default function DetailScreen({ route, navigation }: Props) {
  const { handbag } = route.params;
  const { favorites, toggleFavorite } = useFavoriteStore();
  const isFavorite = favorites.some((fav) => fav.id === handbag.id);

  const reviews = useMemo(() => generateMockReviews(handbag.id), [handbag.id]);

  // useMemo & reduce để tính toán rating trung bình
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, current) => acc + current.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

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

  // --- LOGIC YÊU THÍCH ---
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

        {/* PRODUCT DETAILS CARD */}
        <View style={styles.detailsCard}>
          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={styles.finalPrice}>
              ${(handbag.cost * (1 - handbag.percentOff)).toFixed(2)}
            </Text>
            {handbag.percentOff > 0 && (
              <>
                <Text style={styles.originalPrice}>${handbag.cost.toFixed(2)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{(handbag.percentOff * 100).toFixed(0)}%</Text>
                </View>
              </>
            )}
          </View>

          {/* Name & Brand */}
          <Text style={styles.title}>{handbag.handbagName}</Text>
          <Text style={styles.brand}>{handbag.brand} • {handbag.category}</Text>
        </View>

        {/* KHU VỰC FEEDBACK - Ưu tiên hiện Tiêu Cực 1-2 sao trước */}
        <View style={styles.feedbackSection}>
          <View style={styles.feedbackHeaderRow}>
            <View style={styles.averageRatingBox}>
              <Text style={styles.averageRatingText}>{averageRating}</Text>
              <Text style={styles.averageRatingMax}>/5</Text>
              <Ionicons name="star" size={18} color="#FFD700" style={{ marginLeft: 4 }} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.feedbackTitle}>Customer Reviews</Text>
              <Text style={styles.feedbackSub}>dựa trên {reviews.length} đánh giá</Text>
            </View>
          </View>
          
          {/* Duyệt mảng từ 1 SAO đến 5 SAO (Ưu tiên hiển thị mảng 1 sao trước để thấy lỗi) */}
          {[1, 2, 3, 4, 5].map((starRating) => {
            const starReviews = reviews.filter(r => r.rating === starRating);
            if (starReviews.length === 0) return null; 

            // Cả 2 trạng thái: Màu xanh cho Tích cực (>=4), Màu đỏ cho Tiêu cực (<=2)
            const isPositive = starRating >= 4;
            const isCritical = starRating <= 2;

            return (
              <View key={starRating} style={styles.ratingGroup}>
                <View style={[
                  styles.starHeader, 
                  isPositive && styles.positiveHeader,
                  isCritical && styles.criticalHeader
                ]}>
                  <Text style={[
                    styles.starHeaderText, 
                    isPositive && { color: '#2e7d32' },
                    isCritical && { color: '#d32f2f' }
                  ]}>
                    {starRating}
                  </Text>
                  <Ionicons 
                    name="star" 
                    size={16} 
                    color={isCritical ? "#d32f2f" : isPositive ? "#4caf50" : "#FFD700"} 
                  />
                  <Text style={styles.reviewCount}>({starReviews.length} đánh giá)</Text>
                </View>

                {starReviews.map((review) => (
                  <View key={review.id} style={[
                    styles.commentCard, 
                    isPositive && styles.positiveCard,
                    isCritical && styles.criticalCard
                  ]}>
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
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 380, resizeMode: 'cover' },
  favoriteBtn: {
    position: 'absolute', bottom: -28, right: 28,
    backgroundColor: 'white', width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6,
    zIndex: 20,
  },
  favoriteBtnActive: { backgroundColor: '#e91e63' },
  
  detailsCard: { 
    margin: 16, marginTop: -20, padding: 20, backgroundColor: 'white', borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, zIndex: 10
  },
  priceContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  finalPrice: { fontSize: 32, fontWeight: '900', color: '#e91e63', marginRight: 12 },
  originalPrice: { fontSize: 16, color: '#9e9e9e', textDecorationLine: 'line-through', marginRight: 10, marginBottom: 4 },
  discountBadge: { backgroundColor: '#ffebee', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 4 },
  discountText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#212121', marginBottom: 8, lineHeight: 28 },
  brand: { fontSize: 14, color: '#757575', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '600' },
  
  feedbackSection: { padding: 20, marginHorizontal: 16, marginBottom: 16, backgroundColor: 'white', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  feedbackHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  averageRatingBox: { 
    flexDirection: 'row', alignItems: 'baseline', 
    backgroundColor: '#fff8e1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: '#ffecb3'
  },
  averageRatingText: { fontSize: 24, fontWeight: '900', color: '#f57f17' },
  averageRatingMax: { fontSize: 14, fontWeight: 'bold', color: '#fbc02d', marginLeft: 2 },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
  feedbackSub: { fontSize: 13, color: '#757575', marginTop: 2 },
  ratingGroup: { marginBottom: 20 },
  starHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingBottom: 5 },
  positiveHeader: { borderBottomColor: '#c8e6c9' },
  criticalHeader: { borderBottomColor: '#ffcdd2' },
  starHeaderText: { fontSize: 18, fontWeight: 'bold', marginRight: 4 },
  reviewCount: { fontSize: 14, color: '#757575', marginLeft: 8 },
  commentCard: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eeeeee' },
  positiveCard: { borderColor: '#c8e6c9', backgroundColor: '#f9fbe7' },
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