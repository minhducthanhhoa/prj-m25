import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Sử dụng process.cwd() để lấy đường dẫn chính xác tới db.json
  const jsonFilePath = path.join(process.cwd(), 'server/db.json');

  try {
    // Đọc file db.json
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const { admin } = JSON.parse(data);

    // Tìm tài khoản admin có email và password đúng
    const adminUser = admin.find((user: { email: string; password: string }) => user.email === email && user.password === password);

    if (adminUser) {
      return NextResponse.json({ success: true, message: 'Admin login successful', role: 'admin' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid login details' });
    }
  } catch (error) {
    // Kiểm tra và log lỗi rõ ràng hơn
    if (error instanceof Error) {
      console.error('Error reading database:', error.message);
      return NextResponse.json({ success: false, message: 'Error reading database', error: error.message });
    }
    return NextResponse.json({ success: false, message: 'Unknown error occurred' });
  }
}
