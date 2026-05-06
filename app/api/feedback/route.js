import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const auth = await requireAuth(['TRAINEE', 'TRAINER']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { trainingId, rating, comment } = await req.json();

    if (!trainingId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isFromTrainer = auth.session.role === 'TRAINER';

    const feedback = await prisma.feedback.create({
      data: {
        userId: auth.session.id,
        trainingId: parseInt(trainingId, 10),
        rating: parseInt(rating, 10),
        comment: comment || '',
        isFromTrainer,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = await requireAuth();
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const trainingId = searchParams.get('trainingId');

    const whereClause = trainingId ? { trainingId: parseInt(trainingId, 10) } : {};

    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, role: true }
        },
        training: {
          select: { title: true }
        }
      }
    });

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
