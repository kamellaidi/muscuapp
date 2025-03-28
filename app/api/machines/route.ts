// app/api/machines/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const group = searchParams.get('group') || undefined;
    
    // Calcul de l'offset pour la pagination
    const skip = (page - 1) * limit;
    
    // Construction de la requête avec filtrage optionnel pour MongoDB
    const whereClause = group && group !== 'all' 
      ? { groupe: { contains: group } }
      : undefined;
    
    // Requête paginée
    const machines = await prisma.machine.findMany({
      skip,
      take: limit,
      where: whereClause,
      orderBy: { nom: 'asc' }
    });
    
    // Requête pour le nombre total (pour la pagination)
    const total = await prisma.machine.count({
      where: whereClause
    });
    
    return NextResponse.json({
      machines,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Si vous avez une méthode POST, n'oubliez pas de la mettre à jour aussi
/* export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const machine = await prisma.machine.create({
      data
    });
    
    return NextResponse.json(machine);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} */