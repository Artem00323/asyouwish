// app/api/deleteItem/route.ts

import { NextResponse } from 'next/server';
import { deleteItemById } from '@/lib/db';
import { z } from 'zod';
import { admin } from '@/components/backend/firebaseAdmin';

const requestSchema = z.object({
  item_id: z.number(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { item_id } = requestSchema.parse(data);

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

    // Delete item
    await deleteItemById(item_id, userId);

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error deleting item:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
