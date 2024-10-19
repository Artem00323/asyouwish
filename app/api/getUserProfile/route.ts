import { NextResponse, NextRequest } from 'next/server';
import { getUserProfile } from '@/lib/db';
import { getUserIdFromBody } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserIdFromBody(request);
    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await getUserProfile(user_id);

    return NextResponse.json({ userProfile }, { status: 200 });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
