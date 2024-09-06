"use client"
// /pages/index.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dashboard from './admin/Dashboard';

const Home = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đang chạy trên client (browser)
    setIsClient(true);

    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) {
    // Trả về null nếu đang chạy trên server để tránh lỗi
    return null;
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Home;
