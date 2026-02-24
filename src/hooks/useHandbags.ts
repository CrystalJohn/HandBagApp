import { useQuery } from '@tanstack/react-query';
import { Handbag } from '../types'; // Đảm bảo em đã có interface Handbag

const API_URL = 'https://69819655c9a606f5d44731b6.mockapi.io/handbag';

// Hàm fetch data (có thể tách ra src/api/ nhưng app nhỏ thì để đây cho tiện)
const fetchHandbags = async (): Promise<Handbag[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Custom Hook chuẩn Senior
export const useHandbags = () => {
  return useQuery<Handbag[], Error>({
    queryKey: ['handbags'], // Tên của "ngăn kéo" lưu cache
    queryFn: fetchHandbags,
  });
};