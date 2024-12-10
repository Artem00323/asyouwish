import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
// import Image from 'next/image'

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('avatar') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public', 'avatars', filename);

  try {
    await writeFile(filepath, buffer);
    return NextResponse.json({ avatarUrl: `/avatars/${filename}` }, { status: 200 });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}

