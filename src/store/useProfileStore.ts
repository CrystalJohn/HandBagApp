// Sử dụng cho feat upload photo avatar HomeScreen
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileState {
  avatarUri: string | null;
  updateAvatar: (uri: string) => void;
  removeAvatar: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatarUri: null,
      updateAvatar: (uri) => set({ avatarUri: uri }),
      removeAvatar: () => set({ avatarUri: null }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
