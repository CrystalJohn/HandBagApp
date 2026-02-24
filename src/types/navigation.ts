import { NavigatorScreenParams } from '@react-navigation/native';
import { Handbag } from './index'; // Lấy từ file type lúc nãy em tạo

// Định nghĩa params cho Bottom Tabs
export type BottomTabParamList = {
  Home: undefined;
  Favorites: undefined;
};

// Định nghĩa params cho Root Stack
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>; // Nhúng Tab vào Stack
  Detail: { handbag: Handbag }; // Màn detail bắt buộc phải truyền data của 1 cái túi
};