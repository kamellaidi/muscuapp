// app/api/workouts/route.ts (mise à jour)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    const query = date ? { where: { date } } : {};
    const workouts = await prisma.workout.findMany({
      ...query,
      include: { machine: true },  // Inclusion explicite de la relation machine
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const workout = await prisma.workout.create({
      data,
      include: { machine: true }  // Inclusion explicite de la relation machine
    });
    
    return NextResponse.json(workout);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}