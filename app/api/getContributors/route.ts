import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { item_id } = await request.json();

    const { rows } = await sql`
      SELECT 
        c.sender_id,
        c.amount,
        c.message,
        c.created_at,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM contributions c
      JOIN users u ON c.sender_id = u.user_id
      WHERE c.item_id = ${item_id}
      ORDER BY c.created_at DESC
    `;

    return NextResponse.json({ contributors: rows });
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch contributors' },
      { status: 500 }
    );
  }
} 