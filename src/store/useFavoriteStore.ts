import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Handbag } from '../types'; // Nhớ import đúng đường dẫn interface của em

interface FavoriteState {
  favorites: Handbag[];
  toggleFavorite: (item: Handbag) => void;
  removeFavorite: (id: string) => void;
  clearAll: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      // Hàm thông minh: Nếu có rồi thì xóa, chưa có thì thêm
      toggleFavorite: (item) => {
        const currentFavorites = get().favorites;
        const isExist = currentFavorites.some((fav) => fav.id === item.id);
        
        if (isExist) {
          // Đã có -> Xóa ra khỏi mảng
          set({ favorites: currentFavorites.filter((fav) => fav.id !== item.id) });
        } else {
          // Chưa có -> Thêm vào mảng
          set({ favorites: [...currentFavorites, item] });
        }
      },

      // Hàm xóa 1 item (Dùng cho màn Favorite)
      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((fav) => fav.id !== id) });
      },

      // Hàm xóa tất cả (Clear All)
      clearAll: () => set({ favorites: [] }),
    }),
    {
      name: 'handbag-favorite-storage', // Tên Key lưu trong AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Bắt buộc dùng AsyncStorage cho React Native
    }
  )
);