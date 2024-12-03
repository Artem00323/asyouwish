import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';

const contributionSchema = z.object({
  item_id: z.number(),
  sender_id: z.string(),
  receiver_id: z.string(),
  amount: z.number().positive(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { item_id, sender_id, receiver_id, amount, message } = contributionSchema.parse(data);

    // Start transaction
    await sql`BEGIN`;

    try {
      // Add contribution
      await sql`
        INSERT INTO contributions (item_id, sender_id, receiver_id, amount, message)
        VALUES (${item_id}, ${sender_id}, ${receiver_id}, ${amount}, ${message})
      `;

      // Update item's contributed amount
      await sql`
        UPDATE items
        SET contributed = contributed + ${amount}
        WHERE id = ${item_id}
      `;

      await sql`COMMIT`;

      return NextResponse.json({ message: 'Contribution successful' });
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error('Error processing contribution:', error);
    return NextResponse.json(
      { message: 'Failed to process contribution' },
      { status: 500 }
    );
  }
}
