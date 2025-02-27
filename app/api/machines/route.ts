import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { defaultMachines } from '@/utils/storage';

// GET /api/machines
export async function GET() {
  try {
    // Vérifier si des machines existent déjà
    const count = await prisma.machine.count();
    
    // Si vide, initialiser avec les machines par défaut
    if (count === 0) {
      for (const machine of defaultMachines) {
        await prisma.machine.create({
          data: {
            nom: machine.nom,
            description: machine.description,
            groupe: machine.groupe,
            categorie: machine.categorie
          }
        });
      }
    }
    
    const machines = await prisma.machine.findMany();
    return NextResponse.json(machines);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/machines
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const machine = await prisma.machine.create({ data });
    return NextResponse.json(machine);
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}