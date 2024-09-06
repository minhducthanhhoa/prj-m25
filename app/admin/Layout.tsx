import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-900 text-white">
      <div className="text-center text-2xl font-bold my-4">Rikkei Academy</div>
      <nav className="flex flex-col space-y-4 mt-10">
        <a href="/" className="p-4 hover:bg-gray-700">Dashboard</a>
        <a href="#" className="p-4 hover:bg-gray-700">Products</a>
        <a href="#" className="p-4 hover:bg-gray-700">Orders</a>
        <a href="#" className="p-4 hover:bg-gray-700">Customers</a>
      </nav>
      <button onClick={handleLogout} className="p-4 mt-auto bg-red-600 hover:bg-red-700">Logout</button>
    </div>
  );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
