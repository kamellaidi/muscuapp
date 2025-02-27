// types/index.ts
export interface Machine {
    id: number;
    nom: string;
    description: string;
    groupe: string;
    categorie: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Workout {
    id: number;
    date: string;
    machineId: number;
    machine: Machine; // Relation complète avec la machine
    repetitions: number;
    poids: number;
    createdAt?: Date;
    updatedAt?: Date;
  }