// /page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from './admin/dashboard/page';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/admin/loginadmin');
    }
  }, [router]);

  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default Home;
