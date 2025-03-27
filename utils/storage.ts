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