// app/api/addFriendship/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { addFriendship, getUserById } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
  friend_id: z.string(),
  user_id: z.string(), // Include user_id in the schema
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { friend_id, user_id } = requestSchema.parse(data);

    if (user_id === friend_id) {
      return NextResponse.json({ message: 'Cannot add yourself as a friend' }, { status: 400 });
    }

    const friendUser = await getUserById(friend_id);
    if (!friendUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await addFriendship(user_id, friend_id, 'pending');

    return NextResponse.json({ message: 'Friend request sent' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }

    if (error instanceof Error) {
      if (error.message === 'Friendship already exists') {
        return NextResponse.json({ message: 'Friendship already exists' }, { status: 400 });
      }
      console.error('Error adding friendship:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    console.error('Unknown error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
