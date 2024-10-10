// app/api/addItem/route.ts

import { NextResponse } from 'next/server';
import { addItemToWishlist } from '@/lib/db';
import { z } from 'zod';
import { admin } from '@/components/backend/firebaseAdmin';

const requestSchema = z.object({
  wishlist_id: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.number(),
  description: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { wishlist_id, name, image, price, description } = requestSchema.parse(data);

    // Get token from headers
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authorizationHeader.split(' ')[1];

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Add item to wishlist
    const newItem = await addItemToWishlist({
      wishlist_id,
      name,
      image,
      price,
      description,
    });

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error adding item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
