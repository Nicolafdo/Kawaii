import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// DELETE a training
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    console.log(`Attempting to delete training with ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.training.delete({
      where: { id }
    });

    // THIS WAS MISSING
    return NextResponse.json({ message: 'Training deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to delete training', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE a training
export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, area, trainerId, schedule, venue } = await request.json();

    const updatedTraining = await prisma.training.update({
      where: { id: parseInt(id) },
      data: {
        title,
        area,
        trainerId: parseInt(trainerId),
        schedule,
        venue
      }
    });

    return NextResponse.json(updatedTraining);
  } catch (error) {
    console.error('Update training error:', error);
    return NextResponse.json({ error: 'Failed to update training' }, { status: 500 });
  }
}
