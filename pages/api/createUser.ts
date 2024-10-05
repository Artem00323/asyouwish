// api/createUser.ts

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
    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        login,
        email,
        password_hash,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);

    // // Handle unique constraint violation (e.g., email or login already exists)
    // if (error.code === 'P2002') {
    //   res.status(400).json({ message: 'User with this email or login already exists.' });
    // } else {
    //   res.status(500).json({ message: 'Internal server error' });
    // }
  }
}
