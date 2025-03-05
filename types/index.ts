// types/index.ts
export interface Machine {
  id: string;  // Changé de number à string
  nom: string;
  description: string;
  groupe: string;
  categorie: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Workout {
  id: string;  // Changé de number à string
  date: string;
  machineId: string;  // Changé de number à string
  machine: Machine;
  repetitions: number;
  poids: number;
  notes?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: PlanExercise[];
  createdAt?: string;
  userId?: string;
}

export interface PlanExercise {
  id: string;
  machineId: string;
  machineName: string;
  machineGroupe?: string;
  machineCategorie?: string;
  repetitions?: number;
  series?: number;
  poids?: number;
  notes?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}