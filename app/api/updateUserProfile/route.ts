import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const { user_id, name, avatar_url } = await request.json();

  try {
    const { rows } = await sql`
      UPDATE users
      SET name = ${name}, avatar_url = ${avatar_url}, updated_at = NOW()
      WHERE user_id = ${user_id}
      RETURNING user_id, name, email, avatar_url, created_at, updated_at
    `;

    if (rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = rows[0];
    // For now, we'll just return the avatar as it was sent, without storing it in the database
    updatedUser.avatar = avatar_url;

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
