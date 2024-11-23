import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const wishlistResult = await sql`
      SELECT 
        w.*,
        u.name as owner_name
      FROM wishlists w
      JOIN users u ON w.user_id = u.user_id
      WHERE w.id = ${params.id}
    `;

    if (wishlistResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Wishlist not found' }, 
        { status: 404 }
      );
    }

    const itemsResult = await sql`
      SELECT *
      FROM items
      WHERE wishlist_id = ${params.id}
      ORDER BY created_at DESC
    `;

    const wishlist = {
      id: wishlistResult.rows[0].id,
      user_id: wishlistResult.rows[0].user_id,
      name: wishlistResult.rows[0].name,
      date: wishlistResult.rows[0].date,
      emoji: wishlistResult.rows[0].emoji,
      event_type: wishlistResult.rows[0].event_type,
      created_at: wishlistResult.rows[0].created_at,
      updated_at: wishlistResult.rows[0].updated_at
    };

    return NextResponse.json({
      wishlist,
      items: itemsResult.rows,
      ownerName: wishlistResult.rows[0].owner_name
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error fetching shared wishlist:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
} 