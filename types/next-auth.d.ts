import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extension du type Session par défaut pour inclure l'ID utilisateur
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  /**
   * Extension du type User par défaut
   */
  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extension du type JWT par défaut pour inclure l'ID utilisateur
   */
  interface JWT {
    id: string;
  }
}