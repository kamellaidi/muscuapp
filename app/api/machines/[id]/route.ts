<<<<<<< HEAD
// app/api/machines/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Pas besoin de parseInt avec MongoDB
    const { id } = params;
    
    await prisma.machine.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
=======
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// DELETE /api/machines/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.machine.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
>>>>>>> 882f3a69fa5cd6cc8df945407461870ed5510f3a
}