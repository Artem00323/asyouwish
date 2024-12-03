import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { item_id } = await request.json();

    const { rows } = await sql`
      SELECT 
        c.sender_id,
        SUM(c.amount) as amount,
        STRING_AGG(c.message, ' | ' ORDER BY c.created_at) as messages,
        MAX(c.created_at) as last_contribution_date,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM contributions c
      JOIN users u ON c.sender_id = u.user_id
      WHERE c.item_id = ${item_id}
      GROUP BY c.sender_id, u.name, u.avatar_url
      ORDER BY last_contribution_date DESC
    `;

    return NextResponse.json({ contributors: rows });
  } catch {
    return NextResponse.json(
      { message: 'Failed to fetch contributors' },
      { status: 500 }
    );
  }
} 