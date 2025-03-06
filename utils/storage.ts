<<<<<<< HEAD
export function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(`fitness_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Erreur lors de la récupération de ${key}:`, error);
    return defaultValue;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(`fitness_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de ${key}:`, error);
  }
}

import { Machine } from '../types/index';

// export const defaultMachines: Machine[] = [
  // Machines cardiovasculaires
  { id: 1, nom: 'Treadmill', description: 'Tapis de course', groupe: 'Cardio', categorie: 'cardio' },
  { id: 2, nom: 'Elliptical trainer', description: 'Vélo elliptique', groupe: 'Cardio', categorie: 'cardio' },
  { id: 3, nom: 'Exercise bike', description: 'Vélo stationnaire', groupe: 'Cardio', categorie: 'cardio' },
  { id: 4, nom: 'Rowing machine', description: 'Rameur', groupe: 'Cardio', categorie: 'cardio' },
  { id: 5, nom: 'Stair climber', description: 'Stepper', groupe: 'Cardio', categorie: 'cardio' },
  { id: 6, nom: 'Air bike', description: 'Vélo air/assault', groupe: 'Cardio', categorie: 'cardio' },

  // Machines de musculation guidée
  { id: 7, nom: 'Leg press', description: 'Presse à cuisses', groupe: 'Jambes', categorie: 'guidee' },
  { id: 8, nom: 'Leg extension', description: 'Extension des jambes', groupe: 'Jambes', categorie: 'guidee' },
  { id: 9, nom: 'Leg curl', description: 'Curl des jambes', groupe: 'Jambes', categorie: 'guidee' },
  { id: 10, nom: 'Chest press', description: 'Développé couché guidé', groupe: 'Pectoraux', categorie: 'guidee' },
  { id: 11, nom: 'Shoulder press', description: 'Développé épaules', groupe: 'Épaules', categorie: 'guidee' },
  { id: 12, nom: 'Lat pulldown', description: 'Tirage vertical', groupe: 'Dos', categorie: 'guidee' },
  { id: 13, nom: 'Seated row', description: 'Rowing assis', groupe: 'Dos', categorie: 'guidee' },
  { id: 14, nom: 'Pec deck', description: 'Butterfly/papillon', groupe: 'Pectoraux', categorie: 'guidee' },
  { id: 15, nom: 'Triceps pushdown', description: 'Poulie triceps', groupe: 'Triceps', categorie: 'guidee' },
  // Mise à jour des équipements avec groupes multiples
  { id: 16, nom: 'Cable machine', description: 'Poulie réglable', groupe: 'Dos, Pectoraux, Épaules, Bras', categorie: 'guidee' },
  { id: 17, nom: 'Smith machine', description: 'Machine Smith', groupe: 'Jambes, Pectoraux, Épaules', categorie: 'guidee' },

  { id: 18, nom: 'Hack squat machine', description: 'Machine à squat hack', groupe: 'Jambes', categorie: 'guidee' },
  { id: 19, nom: 'Abdominal crunch machine', description: 'Machine à abdominaux', groupe: 'Abdominaux', categorie: 'guidee' },
  { id: 20, nom: 'Calf raise machine', description: 'Machine mollets', groupe: 'Jambes', categorie: 'guidee' },

  // Équipements poids libres
  { id: 21, nom: 'Dumbbells', description: 'Haltères', groupe: 'Biceps, Triceps, Épaules, Pectoraux, Dos', categorie: 'libre' },
  { id: 22, nom: 'Barbells', description: 'Barres', groupe: 'Jambes, Dos, Pectoraux, Épaules', categorie: 'libre' },
  { id: 23, nom: 'Weight plates', description: 'Disques de poids', groupe: 'Tous les groupes', categorie: 'libre' },
  { id: 24, nom: 'Kettlebells', description: 'Kettlebells', groupe: 'Jambes, Dos, Épaules, Bras', categorie: 'libre' },
  { id: 25, nom: 'Squat rack', description: 'Cage à squat', groupe: 'Jambes, Dos', categorie: 'libre' },
  { id: 27, nom: 'Adjustable bench', description: 'Banc réglable', groupe: 'Pectoraux, Épaules, Bras', categorie: 'libre' },
  { id: 28, nom: 'Preacher curl bench', description: 'Pupitre à biceps', groupe: 'Biceps', categorie: 'libre' },

  { id: 29, nom: 'TRX', description: 'Sangles de suspension', groupe: 'Corps complet', categorie: 'fonctionnel' },
  { id: 30, nom: 'Medicine balls', description: 'Ballons lestés', groupe: 'Corps complet', categorie: 'fonctionnel' },
  { id: 31, nom: 'Battle ropes', description: 'Cordes ondulatoires', groupe: 'Bras, Épaules, Cardio', categorie: 'fonctionnel' },
  { id: 32, nom: 'Resistance bands', description: 'Bandes élastiques', groupe: 'Corps complet', categorie: 'fonctionnel' },
  { id: 33, nom: 'Foam roller', description: 'Rouleau de massage', groupe: 'Récupération', categorie: 'fonctionnel' },
  { id: 34, nom: 'Plyometric boxes', description: 'Box jump/caisses pliométriques', groupe: 'Jambes', categorie: 'fonctionnel' },
//];
=======
export function getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    
    try {
      const item = localStorage.getItem(`fitness_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${key}:`, error);
      return defaultValue;
    }
  }
  
  export function setStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(`fitness_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de ${key}:`, error);
    }
  }

  import { Machine } from '../types/index';
  
  export const defaultMachines: Machine[] = [
    // Machines cardiovasculaires
    { id: 1, nom: 'Treadmill', description: 'Tapis de course', groupe: 'Cardio', categorie: 'cardio' },
    { id: 2, nom: 'Elliptical trainer', description: 'Vélo elliptique', groupe: 'Cardio', categorie: 'cardio' },
    { id: 3, nom: 'Exercise bike', description: 'Vélo stationnaire', groupe: 'Cardio', categorie: 'cardio' },
    { id: 4, nom: 'Rowing machine', description: 'Rameur', groupe: 'Cardio', categorie: 'cardio' },
    { id: 5, nom: 'Stair climber', description: 'Stepper', groupe: 'Cardio', categorie: 'cardio' },
    { id: 6, nom: 'Air bike', description: 'Vélo air/assault', groupe: 'Cardio', categorie: 'cardio' },
    
    // Machines de musculation guidée
    { id: 7, nom: 'Leg press', description: 'Presse à cuisses', groupe: 'Jambes', categorie: 'guidee' },
    { id: 8, nom: 'Leg extension', description: 'Extension des jambes', groupe: 'Jambes', categorie: 'guidee' },
    { id: 9, nom: 'Leg curl', description: 'Curl des jambes', groupe: 'Jambes', categorie: 'guidee' },
    { id: 10, nom: 'Chest press', description: 'Développé couché guidé', groupe: 'Pectoraux', categorie: 'guidee' },
    { id: 11, nom: 'Shoulder press', description: 'Développé épaules', groupe: 'Épaules', categorie: 'guidee' },
    { id: 12, nom: 'Lat pulldown', description: 'Tirage vertical', groupe: 'Dos', categorie: 'guidee' },
    { id: 13, nom: 'Seated row', description: 'Rowing assis', groupe: 'Dos', categorie: 'guidee' },
    { id: 14, nom: 'Pec deck', description: 'Butterfly/papillon', groupe: 'Pectoraux', categorie: 'guidee' },
    { id: 15, nom: 'Triceps pushdown', description: 'Poulie triceps', groupe: 'Triceps', categorie: 'guidee' },
    { id: 16, nom: 'Cable machine', description: 'Poulie réglable', groupe: 'Multiple', categorie: 'guidee' },
    { id: 17, nom: 'Smith machine', description: 'Machine Smith', groupe: 'Multiple', categorie: 'guidee' },
    { id: 18, nom: 'Hack squat machine', description: 'Machine à squat hack', groupe: 'Jambes', categorie: 'guidee' },
    { id: 19, nom: 'Abdominal crunch machine', description: 'Machine à abdominaux', groupe: 'Abdominaux', categorie: 'guidee' },
    { id: 20, nom: 'Calf raise machine', description: 'Machine mollets', groupe: 'Jambes', categorie: 'guidee' },
    
    // Équipements poids libres
    { id: 21, nom: 'Dumbbells', description: 'Haltères', groupe: 'Multiple', categorie: 'libre' },
    { id: 22, nom: 'Barbells', description: 'Barres', groupe: 'Multiple', categorie: 'libre' },
    { id: 23, nom: 'Weight plates', description: 'Disques de poids', groupe: 'Multiple', categorie: 'libre' },
    { id: 24, nom: 'Kettlebells', description: 'Kettlebells', groupe: 'Multiple', categorie: 'libre' },
    { id: 25, nom: 'Squat rack', description: 'Cage à squat', groupe: 'Multiple', categorie: 'libre' },
    { id: 26, nom: 'Bench press', description: 'Banc de développé couché', groupe: 'Pectoraux', categorie: 'libre' },
    { id: 27, nom: 'Adjustable bench', description: 'Banc réglable', groupe: 'Multiple', categorie: 'libre' },
    { id: 28, nom: 'Preacher curl bench', description: 'Pupitre à biceps', groupe: 'Biceps', categorie: 'libre' },
    
    // Équipements fonctionnels
    { id: 29, nom: 'TRX', description: 'Sangles de suspension', groupe: 'Multiple', categorie: 'fonctionnel' },
    { id: 30, nom: 'Medicine balls', description: 'Ballons lestés', groupe: 'Multiple', categorie: 'fonctionnel' },
    { id: 31, nom: 'Battle ropes', description: 'Cordes ondulatoires', groupe: 'Multiple', categorie: 'fonctionnel' },
    { id: 32, nom: 'Resistance bands', description: 'Bandes élastiques', groupe: 'Multiple', categorie: 'fonctionnel' },
    { id: 33, nom: 'Foam roller', description: 'Rouleau de massage', groupe: 'Récupération', categorie: 'fonctionnel' },
    { id: 34, nom: 'Plyometric boxes', description: 'Box jump/caisses pliométriques', groupe: 'Jambes', categorie: 'fonctionnel' },
  ];
>>>>>>> 882f3a69fa5cd6cc8df945407461870ed5510f3a
