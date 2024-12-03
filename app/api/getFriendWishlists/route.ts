import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Wishlist, Item } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { friend_id, user_id } = body;

    if (!friend_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if they are actually friends
    const { rows: friendships } = await sql`
      SELECT * FROM friendships 
      WHERE ((user_id = ${user_id} AND friend_id = ${friend_id})
      OR (user_id = ${friend_id} AND friend_id = ${user_id}))
      AND status = 'accepted'
    `;

    if (friendships.length === 0) {
      return NextResponse.json(
        { error: 'Not authorized to view these wishlists' },
        { status: 403 }
      );
    }

    // Get friend's wishlists
    const { rows: wishlists } = await sql<Wishlist>`
      SELECT * FROM wishlists 
      WHERE user_id = ${friend_id}
    `;

    // Get items for each wishlist
    const wishlistsWithItems = await Promise.all(
      wishlists.map(async (wishlist) => {
        const { rows: items } = await sql<Item>`
          SELECT i.*, 
            (
              SELECT json_agg(json_build_object(
                'user_id', u.user_id,
                'name', u.name,
                'email', u.email,
                'avatar_url', u.avatar_url,
                'amount', c.amount,
                'message', c.message
              ))
              FROM contributions c
              JOIN users u ON c.sender_id = u.user_id
              WHERE c.item_id = i.id
            ) as contributors
          FROM items i
          WHERE i.wishlist_id = ${wishlist.id}
        `;
        return { ...wishlist, items };
      })
    );

    // Get friend's name
    const { rows: [friend] } = await sql`
      SELECT name FROM users 
      WHERE user_id = ${friend_id}
    `;

    return NextResponse.json({
      wishlists: wishlistsWithItems,
      friendName: friend?.name
    });

  } catch (error) {
    console.error('Error in getFriendWishlists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}