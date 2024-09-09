"use client";

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean; // Trạng thái tài khoản (mở hoặc khóa)
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Hàm lấy dữ liệu người dùng từ localStorage
  const fetchUsersFromLocalStorage = () => {
    const localData = localStorage.getItem('users');
    if (localData) {
      return JSON.parse(localData);
    }
    return [];
  };

  // Lấy danh sách người dùng từ localStorage khi component mount
  useEffect(() => {
    const storedUsers = fetchUsersFromLocalStorage();
    if (storedUsers.length > 0) {
      setUsers(storedUsers);
    } else {
      fetchUsers(); // Gọi API nếu localStorage trống
    }
  }, []);

  // Hàm lấy danh sách người dùng từ API và lưu vào localStorage
  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
    localStorage.setItem('users', JSON.stringify(data)); // Lưu dữ liệu vào localStorage
  };

  // Hàm thêm người dùng mới
  const handleAddUser = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newUserName, email: newUserEmail, isActive: false }), // Gửi "name" kèm theo
    });

    if (response.ok) {
      const newUser = await response.json();
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers)); // Cập nhật localStorage
      setShowAddUserForm(false); // Ẩn form thêm người dùng
      setNewUserName('');
      setNewUserEmail('');
    }
  };

  // Hàm mở tài khoản
  const handleActivateUser = (id: number) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, isActive: true } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Cập nhật localStorage
  };

  // Hàm khóa tài khoản
  const handleDeactivateUser = (id: number) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, isActive: false } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers)); // Cập nhật localStorage
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">User Management</h1>

      {/* Nút hiển thị form thêm người dùng */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowAddUserForm(!showAddUserForm)}
      >
        {showAddUserForm ? 'Hide Add User Form' : 'Add User'}
      </button>

      {/* Form thêm người dùng */}
      {showAddUserForm && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Add New User</h2>
          <input
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      )}

      {/* Danh sách người dùng */}
      <div>
        <h2 className="text-xl mb-2">User List</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="border px-4 py-2">
                  {user.isActive ? (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeactivateUser(user.id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleActivateUser(user.id)}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
