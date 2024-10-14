// lib/auth.ts

import { NextRequest } from 'next/server';

export const getUserIdFromBody = async (request: NextRequest): Promise<string | null> => {
  try {
    const body = await request.json();
    if (body && body.user_id) {
      return body.user_id;
    }
    return null;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return null;
  }
};
