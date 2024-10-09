// lib/db.ts
import { sql } from '@vercel/postgres';

export interface User {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  date: string;
  emoji: string;
  event_type: string;
  created_at?: string;
  updated_at?: string;
}

export const ensureUserInDatabase = async (userData: User) => {
  const { user_id, name, email, password_hash } = userData;

  await sql`
    INSERT INTO users (user_id, name, email, password_hash, created_at, updated_at)
    VALUES (${user_id}, ${name}, ${email}, ${password_hash}, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE 
    SET name = EXCLUDED.name,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
  `;
};

export const getWishlistsForUser = async (user_id: string): Promise<Wishlist[]> => {
  const { rows } = await sql<Wishlist>`
    SELECT * FROM wishlists WHERE user_id = ${user_id};
  `;
  return rows;
};

export const addWishlist = async (wishlistData: Omit<Wishlist, 'id' | 'created_at' | 'updated_at'>): Promise<Wishlist[]> => {
  const { user_id, name, date, emoji, event_type } = wishlistData;

  const result = await sql<Wishlist[]>`
    INSERT INTO wishlists (user_id, name, date, emoji, event_type, created_at, updated_at)
    VALUES (${user_id}, ${name}, ${date}, ${emoji}, ${event_type}, NOW(), NOW())
    RETURNING *;
  `;

  return result.rows[0];
};