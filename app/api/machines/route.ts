import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const group = searchParams.get('group') || undefined;
    
    // Calcul de l'offset pour la pagination
    const skip = (page - 1) * limit;
    
    // Construction de la requête avec filtrage optionnel
    const whereClause = group && group !== 'all' 
      ? { groupe: { contains: group } }  // Recherche partielle pour MongoDB
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