import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';

// Khởi tạo QueryClient (Nên để ngoài component để không bị re-create)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Nếu gọi API xịt, tự động thử lại 2 lần
      staleTime: 1000 * 60 * 5, // Cache data trong 5 phút (Production mindset)
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}