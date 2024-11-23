import { NextResponse } from 'next/server';
// import { getEventsForUserAndFriends } from '@/lib/db';
// import { z } from 'zod';
// import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';
// import { Event } from '@/components/ui/types';

// const requestSchema = z.object({
//   startDate: z.string(),
//   endDate: z.string()
// });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing date range' },
        { status: 400 }
      );
    }

    const { rows: events } = await sql`
      SELECT 
        w.id,
        w.name as title,
        w.date,
        w.event_type as type,
        u.name as friendname
      FROM wishlists w
      JOIN users u ON w.user_id = u.user_id
      WHERE w.date >= ${startDate}
      AND w.date <= ${endDate}
      ORDER BY w.date ASC
    `;

    return NextResponse.json({
      events: events.map(event => ({
        ...event,
        date: new Date(event.date).toISOString()
      }))
    });

  } catch (error) {
    console.error('Error in getEvents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 