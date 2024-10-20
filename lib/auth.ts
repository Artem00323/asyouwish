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

export const getUserIdFromCookie = async (request: NextRequest): Promise<string | null> => {
  const sessionToken = request.cookies.get('session_token')?.value;
  if (!sessionToken) {
    console.log('No session token found in cookie');
    return null;
  }
  
  try {
    const userId = await validateSessionToken(sessionToken);
    if (!userId) {
      console.log('Invalid session token');
    }
    return userId;
  } catch (error) {
    console.error('Error validating session token:', error);
    return null;
  }
};

// Implement this function based on your authentication system
async function validateSessionToken(token: string): Promise<string | null> {
  // TODO: Implement proper token validation logic
  // For now, we'll assume any non-empty token is valid
  if (token && token.length > 0) {
    return 'dummy_user_id';
  }
  return null;
}
