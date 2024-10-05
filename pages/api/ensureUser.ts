// api/ensureUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, login, email, password_hash } = req.body;

  if (!login || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      // Create the user
      user = await prisma.user.create({
        data: {
          name,
          login,
          email,
          password_hash,
        },
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error ensuring user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
