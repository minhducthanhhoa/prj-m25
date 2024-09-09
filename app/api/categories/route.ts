import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Đường dẫn đến file db.json
const dbFilePath = path.join(process.cwd(), 'server/db.json');

// Hàm đọc dữ liệu từ db.json
async function readData() {
  const jsonData = await fs.readFile(dbFilePath, 'utf8');
  return JSON.parse(jsonData);
}

// Hàm ghi dữ liệu vào db.json
async function writeData(data: any) {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET method to fetch categories
export async function GET() {
  const data = await readData();
  const categories = data.categories || [];
  return NextResponse.json(categories);
}

// POST method to add a new category
export async function POST(req: NextRequest) {
  const data = await readData();
  const categories = data.categories || [];
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: 'Name is required' }, { status: 400 });
  }

  const newCategory = { id: categories.length + 1, name };
  categories.push(newCategory);
  await writeData({ ...data, categories });

  return NextResponse.json(newCategory, { status: 201 });
}

// PUT method to update a category
export async function PUT(req: NextRequest) {
  const data = await readData();
  const categories = data.categories || [];
  const { id, updatedName } = await req.json();

  if (!id || !updatedName) {
    return NextResponse.json({ message: 'ID and updatedName are required' }, { status: 400 });
  }

  const categoryIndex = categories.findIndex((cat: any) => cat.id === Number(id));
  if (categoryIndex === -1) {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }

  categories[categoryIndex].name = updatedName;
  await writeData({ ...data, categories });

  return NextResponse.json(categories[categoryIndex], { status: 200 });
}

// DELETE method to remove a category
export async function DELETE(req: NextRequest) {
  const data = await readData();
  const categories = data.categories || [];
  const { id } = await req.json();

  const deleteId = Number(id);
  const deleteIndex = categories.findIndex((cat: any) => cat.id === deleteId);
  if (deleteIndex === -1) {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 });
  }

  categories.splice(deleteIndex, 1);
  await writeData({ ...data, categories });

  return new NextResponse(null, { status: 204 });
}
