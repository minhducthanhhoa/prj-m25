"use client"; // Kích hoạt client-side rendering

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginAdmin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(''); // Reset lỗi nếu có

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('user', JSON.stringify({ email }));
        router.push('/'); // Chuyển hướng đến trang chính
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h1 className="text-2xl mb-6">Admin Login</h1>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
