import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  // Vérifier si prisma.user existe
  if (!prisma.user) {
    throw new Error("Le modèle 'user' n'existe pas dans Prisma. Assurez-vous que le schéma Prisma est correctement configuré et que vous avez exécuté 'prisma generate'.");
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validation de base
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'Cet email est déjà utilisé' },
          { status: 409 }
        );
      }
    } catch (findError) {
      throw findError; // Rethrow pour être capturé par le try/catch principal
    }

    // Hachage du mot de passe
    const hashedPassword = await hash(password, 10);

    // Préparation des données utilisateur
    const userData = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      password: hashedPassword,
    };

    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: userData,
    });

    // Omettre le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Inscription réussie',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erreur lors de l'inscription",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}