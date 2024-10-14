// app/api/respondToFriendRequest/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { updateFriendshipStatus } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
  user_id: z.string(),
  friend_id: z.string(),
  action: z.enum(['accept', 'reject']),
});

export async function POST(request: NextRequest) {
  try {
    // Read the request body once
    const data = await request.json();
    const { user_id, friend_id, action } = requestSchema.parse(data);

    // Now we have user_id from the parsed data
    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const status = action === 'accept' ? 'accepted' : 'rejected';
    await updateFriendshipStatus(user_id, friend_id, status);

    return NextResponse.json({ message: `Friend request ${status}` }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error responding to friend request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
