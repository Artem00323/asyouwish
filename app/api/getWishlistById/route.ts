// app/api/getWishlistById/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getWishlistById, getItemsByWishlistId } from '@/lib/db';
import { z } from 'zod';

// Define the request schema
const requestSchema = z.object({
  wishlist_id: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the incoming data
    const { wishlist_id } = requestSchema.parse(data);

    // Fetch the wishlist by ID
    const wishlist = await getWishlistById(wishlist_id);

    if (!wishlist) {
      return NextResponse.json({ message: 'Wishlist not found' }, { status: 404 });
    }

    // Fetch items associated with the wishlist
    const items = await getItemsByWishlistId(wishlist_id);

    return NextResponse.json({ wishlist, items }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
