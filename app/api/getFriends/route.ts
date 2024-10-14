// app/api/getFriends/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getFriendsForUser } from '@/lib/db';
import { getUserIdFromBody } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserIdFromBody(request);
    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const friends = await getFriendsForUser(user_id);

    return NextResponse.json({ friends }, { status: 200 });
  } catch (error) {
    console.error('Error getting friends:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
