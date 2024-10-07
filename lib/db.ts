// lib/db.ts
import { sql } from '@vercel/postgres';

export interface User {
  user_id: string;
  name: string;
  login: string;
  email: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
}

export const ensureUserInDatabase = async (userData: User) => {
  const { user_id, name, login, email, password_hash } = userData;

  await sql`
    INSERT INTO users (user_id, name, login, email, password_hash, created_at, updated_at)
    VALUES (${user_id}, ${name}, ${login}, ${email}, ${password_hash}, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE 
    SET name = EXCLUDED.name,
        login = EXCLUDED.login,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
  `;
};
