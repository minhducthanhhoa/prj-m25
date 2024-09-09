import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Category {
  id: number;
  name: string;
  type: string;
}

// Đường dẫn tới file db.json
const dataPath = path.join(process.cwd(), 'data', 'server/db.json');

function readData() {
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData).categories as Category[];
}

function saveData(categories: Category[]) {
  const dataToSave = JSON.stringify({ categories }, null, 2);
  fs.writeFileSync(dataPath, dataToSave, 'utf8');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const categories = readData();

  switch (req.method) {
    case 'GET':
      res.status(200).json(categories);
      break;
    case 'POST':
      const { name, type } = req.body;
      if (!name || !type) {
        res.status(400).json({ error: 'Name and type are required' });
        return;
      }
      const newCategory: Category = {
        id: categories.length + 1, // simple auto-increment ID, not safe for production
        name,
        type,
      };
      categories.push(newCategory);
      saveData(categories);
      res.status(201).json(newCategory);
      break;
    case 'PUT':
      const { id, newName, newType } = req.body;
      const index = categories.findIndex(cat => cat.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      categories[index].name = newName;
      categories[index].type = newType;
      saveData(categories);
      res.status(200).json(categories[index]);
      break;
    case 'DELETE':
      const { id: deleteId } = req.body;
      const filteredCategories = categories.filter(cat => cat.id !== deleteId);
      if (filteredCategories.length === categories.length) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      saveData(filteredCategories);
      res.status(200).json({ message: 'Category deleted successfully' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
