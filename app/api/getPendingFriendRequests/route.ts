// app/api/getPendingFriendRequests/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getPendingFriendRequests } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const pendingRequests = await getPendingFriendRequests(user_id);

    return NextResponse.json({ pendingRequests }, { status: 200 });
  } catch (error) {
    console.error('Error getting pending friend requests:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
