// app/api/addFriendship/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { addFriendship, getUserById } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
  friend_id: z.string(),
  user_id: z.string(),
});

interface DatabaseError extends Error {
  code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { friend_id, user_id } = requestSchema.parse(data);

    if (user_id === friend_id) {
      return NextResponse.json(
        { message: 'Cannot add yourself as a friend' },
        { status: 400 }
      );
    }

    const friendUser = await getUserById(friend_id);
    if (!friendUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    try {
      await addFriendship(user_id, friend_id, 'pending');
      return NextResponse.json(
        { message: 'Friend request sent' },
        { status: 200 }
      );
    } catch (dbError: unknown) {
      if ((dbError as DatabaseError).code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { message: 'Friend request already sent' },
          { status: 409 }
        );
      }
      throw dbError;
    }
  } catch (error: unknown) {
    console.error('Error processing friend request:', error);
    return NextResponse.json(
      { message: 'Unable to process request' },
      { status: 500 }
    );
  }
}
