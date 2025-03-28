// app/api/machines/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Type pour le contexte de route avec un ID MongoDB
type RouteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Extraction de l'ID MongoDB
    const { id } = context.params;
    
    // Suppression via Prisma
    await prisma.machine.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}