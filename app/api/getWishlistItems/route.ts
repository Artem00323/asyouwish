// app/api/getWishlistItems/route.ts

import { NextResponse } from 'next/server';
import { getItemsForWishlist } from '@/lib/db';
import { z } from 'zod';

const requestSchema = z.object({
  wishlist_id: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { wishlist_id } = requestSchema.parse(data);

    // Get items for the wishlist
    const items = await getItemsForWishlist(wishlist_id);

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error fetching items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
