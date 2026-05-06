import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try {
    const auth = await requireAuth(['TRAINEE']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { trainingId } = await req.json();

    if (!trainingId) {
      return NextResponse.json({ error: 'Missing training ID' }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_trainingId: {
          userId: auth.session.id,
          trainingId: parseInt(trainingId, 10),
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'You are already enrolled in this training.' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: auth.session.id,
        trainingId: parseInt(trainingId, 10),
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = await requireAuth(['TRAINEE', 'ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: auth.session.role === 'TRAINEE' ? auth.session.id : undefined
      },
      include: {
        training: true
      }
    });

    return NextResponse.json(enrollments, { status: 200 });
  } catch (error) {
    console.error('Fetch enrollments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
