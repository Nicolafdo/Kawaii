import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const auth = await requireAuth();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const trainings = await prisma.training.findMany({
      include: {
        trainer: {
          select: { name: true, email: true }
        },
        materials: true,
        _count: {
          select: { enrollments: true }
        }
      }
    });
    return NextResponse.json(trainings, { status: 200 });
  } catch (error) {
    console.error('Fetch trainings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { title, area, trainerId, schedule, venue } = await req.json();

    if (!title || !area || !trainerId || !schedule || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const training = await prisma.training.create({
      data: {
        title,
        area,
        trainerId: parseInt(trainerId, 10),
        schedule,
        venue,
      },
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Create training error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
