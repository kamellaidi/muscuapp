// app/historique/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout } from '@/types';

type WorkoutsByDate = Record<string, Workout[]>;

export default function Historique(): React.ReactElement {
  const [workouts, setWorkouts] = useState<WorkoutsByDate>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllWorkouts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await fetch('/api/workouts/history');
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data: Workout[] = await res.json();
        
        // Regrouper par date
        const grouped = data.reduce<WorkoutsByDate>((acc, workout) => {
          if (!acc[workout.date]) {
            acc[workout.date] = [];
          }
          acc[workout.date].push(workout);
          return acc;
        }, {});
        
        setWorkouts(grouped);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllWorkouts();
  }, []);

  // Trier les dates (plus récentes en premier)
  const sortedDates = Object.keys(workouts).sort((a: string, b: string) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Historique</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      {isLoading ? (
        <p className="loading">Chargement...</p>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-retry"
          >
            Réessayer
          </button>
        </div>
      ) : sortedDates.length === 0 ? (
        <div className="empty-history">
          <p>Aucun entraînement enregistré</p>
          <Link href="/seance" className="btn-add">Commencer un entraînement</Link>
        </div>
      ) : (
        <div className="history-list">
          {sortedDates.map((date: string) => (
            <div key={date} className="history-day">
              <h2 className="history-date">
                {new Date(date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
                <Link href={`/seance?date=${date}`} className="btn-small-outline">
                  Voir/Modifier
                </Link>
              </h2>
              
              <div className="history-exercises">
                {workouts[date].map((workout: Workout) => (
                  <div key={workout.id} className="history-exercise">
                    <div className="exercise-name">{workout.machine.nom}</div>
                    <div className="exercise-details">
                      <span>{workout.repetitions} répétitions</span>
                      <span>{workout.poids} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}