import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const pickImage = async (): Promise<string | null> => {
    try {
      // 1. Xin quyền truy cập thư viện ảnh
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi avatar."
        );
        return null;
      }

      // 2. Mở gallery để chọn ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Cho phép crop ảnh
        aspect: [1, 1], // Crop hình vuông cho avatar
        quality: 0.8, // Giảm chất lượng xíu để load nhanh hơn
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi chọn ảnh:", error);
      Alert.alert("Lỗi", "Không thể mở thư viện ảnh.");
      return null;
    }
  };

  return { pickImage };
};
