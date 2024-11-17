import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { searchQuery, currentUserId } = await request.json();
    
    if (!searchQuery || !currentUserId) {
      return NextResponse.json({ 
        message: 'Search query and user ID are required' 
      }, { status: 400 });
    }

    const users = await sql`
      WITH friendship_status AS (
        SELECT 
          CASE
            WHEN user_id = ${currentUserId} THEN friend_id
            WHEN friend_id = ${currentUserId} THEN user_id
          END as friend_id,
          CASE 
            WHEN status = 'accepted' THEN 'friends'
            WHEN status = 'pending' THEN 
              CASE 
                WHEN user_id = ${currentUserId} THEN 'outgoing'
                WHEN friend_id = ${currentUserId} THEN 'incoming'
              END
          END as status,
          user_id as request_from,
          friend_id as request_to
        FROM friendships 
        WHERE user_id = ${currentUserId} OR friend_id = ${currentUserId}
      )
      SELECT 
        u.user_id,
        u.name,
        u.avatar_url,
        fs.status as friendship_status
      FROM users u
      LEFT JOIN friendship_status fs ON u.user_id = fs.friend_id
      WHERE 
        custom_lower(u.name) LIKE custom_lower(${`%${searchQuery}%`})
        AND u.user_id != ${currentUserId}
        AND (
          fs.status IS NULL 
          OR (fs.status = 'incoming')
        )
      ORDER BY 
        CASE WHEN custom_lower(u.name) LIKE custom_lower(${`${searchQuery}%`}) THEN 0 ELSE 1 END,
        u.name
      LIMIT 10;
    `;

    return NextResponse.json({ users: users.rows });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 