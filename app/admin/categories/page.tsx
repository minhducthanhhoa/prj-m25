"use client"
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  type: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  async function handleAddCategory(event: React.FormEvent) {
    event.preventDefault();
    const newCategory: Category = {
      id: Math.random(), // Sử dụng Math.random() để tạo ID ngẫu nhiên; nên thay thế bằng cách tạo ID tốt hơn trong sản xuất
      name,
      type,
    };
    setCategories(prev => [...prev, newCategory]);
    setName('');
    setType('');
    alert('Category added successfully');
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold underline my-4">Manage Categories</h1>
      <form onSubmit={handleAddCategory} className="my-4">
        <div className="mb-3">
          <label htmlFor="name" className="block mb-2">Category Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="block mb-2">Category Type:</label>
          <input
            id="type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Category
        </button>
      </form>
      <h2 className="text-2xl font-bold my-4">Category List</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id} className="p-2 hover:bg-gray-100">
            {category.name} ({category.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
