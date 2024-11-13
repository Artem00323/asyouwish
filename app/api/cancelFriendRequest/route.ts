import { NextResponse, NextRequest } from 'next/server';
import { deleteFriendship } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
  user_id: z.string(),
  friend_id: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { user_id, friend_id } = requestSchema.parse(data);

    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await deleteFriendship(user_id, friend_id);
    return NextResponse.json({ message: 'Friend request canceled' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 