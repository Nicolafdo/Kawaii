import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, totalTrainings, totalEnrollments] = await Promise.all([
      prisma.user.count(),
      prisma.training.count(),
      prisma.enrollment.count()
    ]);

    return NextResponse.json({
      totalUsers,
      totalTrainings,
      totalEnrollments
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
