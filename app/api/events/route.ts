import { NextResponse } from 'next/server';
import { getEventsForUserAndFriends } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { user_id, startDate, endDate } = await request.json();

    if (!user_id || !startDate || !endDate) {
      return NextResponse.json({ message: 'User ID, start date, and end date are required' }, { status: 400 });
    }

    const events = await getEventsForUserAndFriends(user_id, new Date(startDate), new Date(endDate));

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
