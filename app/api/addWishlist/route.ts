import { NextResponse } from 'next/server';
import { addWishlist } from '@/lib/db';
import { z } from 'zod';

// Определяем схему для входящих данных
const wishlistSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  date: z.string(),
  emoji: z.string(),
  event_type: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Валидация данных
    const parsedData = wishlistSchema.parse(data);

    // Добавляем список желаний в базу данных
    const newWishlist = await addWishlist(parsedData);

    return NextResponse.json({ wishlist: newWishlist }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Обработка ошибок валидации
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error adding wishlist:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
