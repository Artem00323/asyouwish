import { NextResponse } from 'next/server';
import { getWishlistsForUser } from '@/lib/db';
import { z } from 'zod';

// Используем Zod для валидации входящих данных
const requestSchema = z.object({
  user_id: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Валидация данных
    const { user_id } = requestSchema.parse(data);

    // Получаем списки желаний из базы данных
    const wishlists = await getWishlistsForUser(user_id);

    return NextResponse.json({ wishlists }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Обработка ошибок валидации
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error fetching wishlists:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
