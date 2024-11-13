import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

const requestSchema = z.object({
  searchQuery: z.string(),
});

export async function POST(request: Request) {
  try {
    const { searchQuery, currentUserId } = await request.json();
    
    if (!searchQuery || !currentUserId) {
      return new Response(JSON.stringify({ 
        message: 'Search query and user ID are required' 
      }), { status: 400 });
    }

    const users = await sql`
      WITH friendship_status AS (
        SELECT 
          friend_id,
          CASE 
            WHEN status = 'accepted' THEN 'friends'
            WHEN status = 'pending' THEN 'pending'
            ELSE NULL 
          END as status
        FROM friendships 
        WHERE user_id = ${currentUserId}
      )
      SELECT 
        u.user_id,
        u.name,
        u.avatar_url,
        fs.status as friendship_status
      FROM users u
      LEFT JOIN friendship_status fs ON u.user_id = fs.friend_id
      WHERE 
        LOWER(u.name) LIKE ${`%${searchQuery}%`}
        AND u.user_id != ${currentUserId}
      LIMIT 10;
    `;

    return new Response(JSON.stringify({ users: users.rows }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Search users error:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while searching users' 
    }), { status: 500 });
  }
} 