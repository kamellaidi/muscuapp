// test-db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    console.log('Connexion réussie!', result)
  } catch (error) {
    console.error('Erreur de connexion:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()