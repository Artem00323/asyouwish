// app/api/ensureUser/route.ts
import { NextResponse } from 'next/server';
import { ensureUserInDatabase, User } from '@/lib/db';
import { z } from 'zod';

// Optional: Use Zod for validation
const userSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate incoming data
    const parsedData = userSchema.parse(data);

    const { user_id, name, email, password_hash } = parsedData;

    const userData: User = {
      user_id,
      name,
      email,
      password_hash,
    };

    await ensureUserInDatabase(userData);

    return NextResponse.json({ message: 'User ensured in database' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json({ message: 'Invalid data', errors: error.errors }, { status: 400 });
    }
    console.error('Error ensuring user in database:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
