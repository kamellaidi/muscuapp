// app/api/workouts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // Construire l'objet de requête correctement typé
    const queryOptions: Prisma.WorkoutFindManyArgs = {
      include: { machine: true },
      orderBy: { createdAt: 'desc' }
    };
    
    // Ajouter where conditionnellement
    if (date) {
      queryOptions.where = { date };
    }
    
    const workouts = await prisma.workout.findMany(queryOptions);
    
    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convertir les types si nécessaire pour MongoDB
    const workoutData = {
      ...data,
      machineId: data.machineId.toString(), // Assurer que machineId est une chaîne
    };
    
    const workout = await prisma.workout.create({
      data: workoutData,
      include: { machine: true }
    });
    
    return NextResponse.json(workout);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}