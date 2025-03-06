import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/workouts/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.workout.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}