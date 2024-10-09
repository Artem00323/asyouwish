import { NextResponse } from 'next/server';
import { deleteWishlistById } from '@/lib/db';
import { z } from 'zod';
import { admin } from '@/components/backend/firebaseAdmin';

const requestSchema = z.object({
  wishlist_id: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { wishlist_id } = requestSchema.parse(data);

    // Получаем токен из заголовков
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1]; // Ожидаем формат 'Bearer <token>'

    // Проверяем и декодируем токен
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Удаляем список желаний
    await deleteWishlistById(wishlist_id, userId);

    return NextResponse.json({ message: 'Wishlist deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error deleting wishlist:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
