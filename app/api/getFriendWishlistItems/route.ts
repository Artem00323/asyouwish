import { NextRequest, NextResponse } from 'next/server';
import { getFriendWishlistItems, getWishlistById } from '@/lib/db';
import { z } from 'zod';
import { getUserIdFromBody } from '@/lib/auth';

const requestSchema = z.object({
  wishlist_id: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { wishlist_id } = requestSchema.parse(data);
    
    const user_id = await getUserIdFromBody(request);
    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get wishlist info
    const wishlist = await getWishlistById(wishlist_id);
    if (!wishlist) {
      return NextResponse.json({ message: 'Wishlist not found' }, { status: 404 });
    }

    // Get wishlist items
    const items = await getFriendWishlistItems(wishlist_id, user_id);

    return NextResponse.json({
      wishlist,
      items
    }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error fetching wishlist items:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 