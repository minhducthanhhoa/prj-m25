import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const jsonFilePath = path.join(process.cwd(), 'server/db.json');

// Lấy danh sách người dùng
export async function GET() {
  try {
    // Đọc file db.json
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const users = JSON.parse(data).users;

    // Trả về danh sách người dùng
    return NextResponse.json(users);
  } catch (error: any) {
    // Xử lý lỗi đọc file
    return NextResponse.json({ success: false, message: 'Error reading database', error: error.message });
  }
}

// Thêm người dùng mới
export async function POST(req: Request) {
  try {
    // Lấy dữ liệu từ request
    const { name, email, password } = await req.json();

    // Đọc file db.json
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const users = JSON.parse(data).users;

    // Tạo ID mới cho người dùng
    const newId = users.length ? users[users.length - 1].id + 1 : 1;

    // Tạo người dùng mới
    const newUser = {
      id: newId,
      name, // Thêm tên người dùng mới
      email,
      password,
      isActive: false, // Ban đầu trạng thái là "Inactive"
    };

    // Thêm người dùng mới vào danh sách
    users.push(newUser);

    // Ghi lại file db.json
    await fs.writeFile(jsonFilePath, JSON.stringify({ users }, null, 2));

    // Trả về người dùng mới
    return NextResponse.json(newUser);
  } catch (error: any) {
    // Xử lý lỗi
    return NextResponse.json({ success: false, message: 'Error updating database', error: error.message });
  }
}

// Xóa người dùng
export async function DELETE(req: Request) {
  try {
    // Lấy id người dùng cần xóa từ request
    const { id } = await req.json();

    // Đọc file db.json
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const users = JSON.parse(data).users;

    // Lọc ra danh sách người dùng không có id cần xóa
    const updatedUsers = users.filter((user: { id: number }) => user.id !== id);

    // Ghi lại file db.json với danh sách người dùng đã cập nhật
    await fs.writeFile(jsonFilePath, JSON.stringify({ users: updatedUsers }, null, 2));

    // Trả về kết quả thành công
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Xử lý lỗi
    return NextResponse.json({ success: false, message: 'Error deleting user', error: error.message });
  }
}
