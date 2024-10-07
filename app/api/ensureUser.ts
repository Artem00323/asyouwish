// pages/api/ensureUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureUserInDatabase, User } from '@/lib/db';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, login, email, password_hash } = req.body;

  if (!name || !login || !email || password_hash === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const userData: User = {
    user_id: login, // Assuming 'login' is unique and used as 'user_id'
    name,
    login,
    email,
    password_hash,
  };

  try {
    await ensureUserInDatabase(userData);
    return res.status(200).json({ message: 'User ensured in database' });
  } catch (error) {
    console.error('Error ensuring user in database:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
