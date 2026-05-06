import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const auth = await requireAuth(['TRAINER', 'ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const formData = await req.formData();
    const file = formData.get('file');
    const trainingId = formData.get('trainingId');
    const description = formData.get('description');

    if (!file || !trainingId || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const material = await prisma.material.create({
      data: {
        trainingId: parseInt(trainingId, 10),
        description,
        filePath: `/uploads/${fileName}`,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('Material upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = await requireAuth();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const trainingId = searchParams.get('trainingId');

    if (!trainingId) {
      return NextResponse.json({ error: 'Missing training ID' }, { status: 400 });
    }

    const materials = await prisma.material.findMany({
      where: { trainingId: parseInt(trainingId, 10) },
    });

    return NextResponse.json(materials, { status: 200 });
  } catch (error) {
    console.error('Fetch materials error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
