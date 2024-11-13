import { NextResponse } from 'next/server';
import { getOutgoingAndDeclinedRequests } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const requests = await getOutgoingAndDeclinedRequests(user_id);
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error('Error getting requests:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 