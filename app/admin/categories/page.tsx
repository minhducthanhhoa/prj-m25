"use client"; // Đảm bảo đây là một Client Component

import { useEffect, useState } from 'react';

type Category = {
  id: number;
  name: string;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setCategories(data);
      localStorage.setItem('categories', JSON.stringify(data)); // Lưu vào localStorage
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    }
  };

  const addCategory = async () => {
    if (!newCategory) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      const updatedCategories = [...categories, data];
      setCategories(updatedCategories);
      setNewCategory('');
      localStorage.setItem('categories', JSON.stringify(updatedCategories)); // Lưu vào localStorage
    } catch (error) {
      console.error('Failed to add category:', error);
      setError('Failed to add category');
    }
  };

  const updateCategory = async () => {
    if (!editCategory) return;

    try {
      const res = await fetch(`/api/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editCategory.id, updatedName: editCategory.name }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      const updatedCategories = categories.map((cat) =>
        cat.id === data.id ? data : cat
      );
      setCategories(updatedCategories);
      setEditCategory(null);
      localStorage.setItem('categories', JSON.stringify(updatedCategories)); // Lưu vào localStorage
    } catch (error) {
      console.error('Failed to update category:', error);
      setError('Failed to update category');
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      const res = await fetch(`/api/categories`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryToDelete.id }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const updatedCategories = categories.filter((cat) => cat.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      setCategoryToDelete(null);
      setShowDeleteModal(false); // Đóng modal sau khi xóa
      localStorage.setItem('categories', JSON.stringify(updatedCategories)); // Lưu vào localStorage
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('Failed to delete category');
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true); // Hiển thị modal xác nhận
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-500 text-white p-2 mb-4">
          {error}
        </div>
      )}

      {/* Form thêm danh mục */}
      <div className="mb-6">
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Add Category
        </button>
      </div>

      {/* Form sửa danh mục */}
      {editCategory && (
        <div className="mb-6">
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Edit Category"
            value={editCategory.name}
            onChange={(e) =>
              setEditCategory({ ...editCategory, name: e.target.value })
            }
          />
          <button
            onClick={updateCategory}
            className="bg-green-500 text-white p-2 w-full"
          >
            Update Category
          </button>
        </div>
      )}

      {/* Danh sách danh mục */}
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="flex justify-between mb-2">
            <span>{category.name}</span>
            <div>
              <button
                onClick={() => setEditCategory(category)}
                className="text-blue-500 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(category)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the category "{categoryToDelete.name}"?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-black px-4 py-2 mr-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
