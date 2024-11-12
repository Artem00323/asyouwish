import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { user_id, birth_date, heard_from } = await request.json();

    // Validate required fields
    if (!user_id || !birth_date || !heard_from) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already completed the quiz
    const existingAnswer = await sql`
      SELECT id FROM user_quiz_answers 
      WHERE user_id = ${user_id}
    `;

    if (existingAnswer.rows.length > 0) {
      // Update existing answer
      await sql`
        UPDATE user_quiz_answers 
        SET 
          birth_date = ${birth_date},
          heard_from = ${heard_from}
        WHERE user_id = ${user_id}
      `;
    } else {
      // Insert new answer
      await sql`
        INSERT INTO user_quiz_answers (
          user_id,
          birth_date,
          heard_from
        ) VALUES (
          ${user_id},
          ${birth_date},
          ${heard_from}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz answers' },
      { status: 500 }
    );
  }
}
