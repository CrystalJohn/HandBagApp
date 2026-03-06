import { useQuery } from '@tanstack/react-query';
import { Handbag } from '../types';

import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Hàm fetch data
const fetchHandbags = async (): Promise<Handbag[]> => {
  console.log('Fetching from URL with axios:', API_URL);
  try {
    const response = await axios.get(API_URL, { timeout: 10000 });
    console.log('Response status:', response.status);
    const data = response.data;
    console.log('Fetched data length:', data.length);
    return data;
  } catch (err) {
    console.error('Fetch Error:', err);
    throw err;
  }
};

// Custom Hook chuẩn Senior
export const useHandbags = () => {
  return useQuery<Handbag[], Error>({
    queryKey: ['handbags'], // Tên của "ngăn kéo" lưu cache
    queryFn: fetchHandbags,
    networkMode: 'always', // Bắt buộc fetch ngay cả khi React Query tưởng là mất mạng (tránh bị pause vĩnh viễn)
  });
};