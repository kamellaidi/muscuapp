// app/seance/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Machine, Workout, WorkoutPlan } from '@/types';

export default function Seance(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Paramètres d'URL
  const dateParam = searchParams.get('date');
  const planId = searchParams.get('plan');
  
  // État pour les dates et entrées
  const [selectedDate, setSelectedDate] = useState<string>(
    dateParam || new Date().toISOString().split('T')[0]
  );
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  
  // État du formulaire
  const [newWorkout, setNewWorkout] = useState<{
    machineId: string;
    series: string;
    repetitions: string;
    poids: string;
    notes?: string;
  }>({
    machineId: '',
    series: '3',
    repetitions: '',
    poids: '',
    notes: ''
  });
  
  // États de chargement et d'erreur
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [machinesLoading, setMachinesLoading] = useState<boolean>(true);
  const [workoutsLoading, setWorkoutsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Groupes musculaires avec emojis pour le filtrage
  const muscleGroups = [
    { id: 'all', name: '🏋️ Tous', emoji: '🏋️' },
    { id: 'Jambes', name: '🦵 Jambes', emoji: '🦵' },
    { id: 'Quadriceps', name: '🦵 Quadriceps', emoji: '🦵' },
    { id: 'Pectoraux', name: '💪 Pectoraux', emoji: '💪' },
    { id: 'Dos', name: '🔙 Dos', emoji: '🔙' },
    { id: 'Épaules', name: '🙌 Épaules', emoji: '🙌' },
    { id: 'Biceps', name: '💪 Biceps', emoji: '💪' },
    { id: 'Triceps', name: '💪 Triceps', emoji: '💪' },
    { id: 'Abdominaux', name: '🧍 Abdominaux', emoji: '🧍' },
    { id: 'Cardio', name: '❤️ Cardio', emoji: '❤️' },
    { id: 'Fessiers', name: '🍑 Fessiers', emoji: '🍑' },
    { id: 'Corps complet', name: '⭐ Corps complet', emoji: '⭐' },
  ];
  
  // Charger les machines depuis l'API
  useEffect(() => {
    const fetchMachines = async (): Promise<void> => {
      setMachinesLoading(true);
      try {
        const res = await fetch('/api/machines?limit=100');
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setMachines(data.machines);
      } catch (err) {
        console.error('Erreur lors du chargement des machines:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des machines');
      } finally {
        setMachinesLoading(false);
      }
    };
    
    fetchMachines();
  }, []);
  
  // Filtrer les machines par groupe musculaire
  useEffect(() => {
    if (machines.length > 0) {
      if (activeGroup !== 'all') {
        const filtered = machines.filter(machine => 
          machine.groupe.includes(activeGroup) || 
          machine.groupe === 'Corps complet'
        );
        setFilteredMachines(filtered);
      } else {
        setFilteredMachines(machines);
      }
    }
  }, [activeGroup, machines]);
  
  // Charger les entraînements pour la date sélectionnée
  useEffect(() => {
    const fetchWorkouts = async (): Promise<void> => {
      setWorkoutsLoading(true);
      try {
        const res = await fetch(`/api/workouts?date=${selectedDate}`);
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Erreur lors du chargement des entraînements:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des entraînements');
      } finally {
        setWorkoutsLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [selectedDate]);
  
  // Charger un plan si spécifié dans l'URL
  useEffect(() => {
    if (planId) {
      const loadPlan = (): void => {
        try {
          const savedPlans = localStorage.getItem('workout_plans');
          if (savedPlans) {
            const plans: WorkoutPlan[] = JSON.parse(savedPlans);
            const foundPlan = plans.find(p => p.id === planId);
            
            if (foundPlan) {
              setPlan(foundPlan);
            }
          }
        } catch (err) {
          console.error('Erreur lors du chargement du plan:', err);
        }
      };
      
      loadPlan();
    }
  }, [planId]);
  
  // Mettre à jour l'état de chargement global
  useEffect(() => {
    setIsLoading(machinesLoading || workoutsLoading);
  }, [machinesLoading, workoutsLoading]);
  
  // Gérer le changement de date
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    
    // Mettre à jour l'URL sans recharger la page
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', newDate);
    router.push(`/seance?${params.toString()}`);
  };
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({ ...prev, [name]: value }));
  };
  
  // Ajouter un entraînement
  const handleAddWorkout = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    console.log("Form submission - Form values:", newWorkout);
    
    if (!newWorkout.machineId || !newWorkout.series || !newWorkout.repetitions || !newWorkout.poids) {
      console.log("Missing fields:", {
        machineId: !newWorkout.machineId,
        series: !newWorkout.series,
        repetitions: !newWorkout.repetitions,
        poids: !newWorkout.poids
      });
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const workoutData = {
        date: selectedDate,
        machineId: String(newWorkout.machineId),
        series: parseInt(newWorkout.series),
        repetitions: parseInt(newWorkout.repetitions),
        poids: parseFloat(newWorkout.poids),
        notes: newWorkout.notes
      };
      
      console.log("Prepared workout data:", workoutData);
      
      console.log("Sending API request to:", '/api/workouts');
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData)
      });
      
      console.log("API response status:", res.status, res.statusText);
      
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      
      const responseText = await res.text();
      console.log("API response text:", responseText);
      
      let savedWorkout;
      try {
        savedWorkout = JSON.parse(responseText) as Workout;
        console.log("Parsed workout data:", savedWorkout);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Réponse invalide du serveur");
      }
      
      // Mettre à jour la liste des entraînements
      setWorkouts(prev => [savedWorkout, ...prev]);
      
      // Réinitialiser le formulaire
      setNewWorkout({
        machineId: '',
        series: '3',
        repetitions: '',
        poids: '',
        notes: ''
      });
      setShowForm(false);
      
    } catch (err) {
      console.error("Error details:", err);
      alert('Erreur lors de l\'ajout de l\'entraînement');
    }
  };
  
  // Supprimer un entraînement
  const handleDeleteWorkout = async (id: string): Promise<void> => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'entraînement');
    }
  };
  
  // Ajouter un exercice depuis un plan
  const addExerciseFromPlan = (exercise: WorkoutPlan['exercises'][0]): void => {
    if (!exercise.machineId) return;
    
    setNewWorkout({
      machineId: exercise.machineId,
      series: exercise.series?.toString() || '3',
      repetitions: exercise.repetitions?.toString() || '',
      poids: exercise.poids?.toString() || '',
      notes: exercise.notes || ''
    });
    
    setShowForm(true);
  };
  
  return (
    <div className="mobile-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Séance</h1>
          <Link href="/" className="btn-small">Accueil</Link>
        </div>
        
        {plan && (
  <div className="active-plan">
    <span>Plan actif: <strong>{plan.name}</strong></span>
    <button 
      onClick={() => setPlan(null)}
      className="btn-small-outline"
    >
      Désactiver
    </button>
  </div>
)}
      </header>
      
      <div className="date-selector">
        <label htmlFor="date">Date:</label>
        <input 
          type="date" 
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-input"
        />
      </div>
      
      {!showForm ? (
        <button 
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Ajouter un exercice
        </button>
      ) : (
        <div className="form-container">
          <h2>Nouvel exercice</h2>
          <form onSubmit={handleAddWorkout}>
            {/* Premier select: Groupe musculaire */}
            <div className="form-group">
              <label htmlFor="muscleGroup">Groupe musculaire:</label>
              <select
                id="muscleGroup"
                value={activeGroup}
                onChange={(e) => setActiveGroup(e.target.value)}
                className="form-select"
                required
              >
                {muscleGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Deuxième select: Exercice filtré par le groupe musculaire */}
            <div className="form-group">
              <label htmlFor="machine">Machine/Exercice:</label>
              <select
                id="machine"
                name="machineId"
                value={newWorkout.machineId}
                onChange={handleInputChange}
                required
                className="form-select"
                disabled={filteredMachines.length === 0 || activeGroup === 'all'}
              >
                <option value="">Sélectionner un exercice</option>
                {filteredMachines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.nom} {machine.description ? `- ${machine.description}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Champs numériques en ligne */}
            <div className="form-row">
              <div className="form-group third">
                <label htmlFor="series">Séries:</label>
                <input
                  type="number"
                  id="series"
                  name="series"
                  value={newWorkout.series}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="form-input"
                  inputMode="numeric"
                />
              </div>
              
              <div className="form-group third">
                <label htmlFor="repetitions">Répétitions:</label>
                <input
                  type="number"
                  id="repetitions"
                  name="repetitions"
                  value={newWorkout.repetitions}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="form-input"
                  inputMode="numeric"
                />
              </div>
              
              <div className="form-group third">
                <label htmlFor="poids">Poids (kg):</label>
                <input
                  type="number"
                  id="poids"
                  name="poids"
                  value={newWorkout.poids}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  required
                  className="form-input"
                  inputMode="decimal"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes (optionnel):</label>
              <textarea
                id="notes"
                name="notes"
                value={newWorkout.notes}
                onChange={handleInputChange}
                placeholder="Instructions, sensations, etc."
                rows={2}
                className="form-textarea"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
              <button type="submit" className="btn-submit">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Plan suggéré */}
      {plan && plan.exercises.length > 0 && (
  <div className="plan-suggestions">
    <h3>Exercices du plan</h3>
    <div className="plan-exercises-list">
      {plan.exercises.map(exercise => {
        // Vérifier si cet exercice a déjà été fait aujourd'hui
        const isDone = workouts.some(w => w.machineId === exercise.machineId);
        
        return (
          <div 
            key={exercise.id} 
            className={`plan-exercise ${isDone ? 'done' : ''} ${exercise.machineCategorie}`}
            onClick={() => !isDone && addExerciseFromPlan(exercise)}
          >
            <div className="exercise-info">
              <h3>{exercise.machineName}</h3>
              
              <div className="exercise-compact-details">
                {exercise.series && exercise.repetitions && (
                  <span>{exercise.series}×{exercise.repetitions}</span>
                )}
                
                {exercise.poids && (
                  <span>{exercise.poids}kg</span>
                )}
              </div>
            </div>
            
            {isDone ? (
              <span className="status-done">✓</span>
            ) : (
              <span className="status-add">+</span>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
      
      {/* Liste des entraînements du jour */}
      <div className="workout-list">
        <h2>
          Exercices du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </h2>
        
        {isLoading ? (
          <p className="loading">Chargement...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : workouts.length === 0 ? (
          <p className="empty-message">Aucun exercice enregistré pour cette date</p>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className={`workout-card ${workout.machine.categorie}`}>
              <div className="workout-info">
                <h3>{workout.machine.nom}</h3>
                
                {/* Afficher les groupes musculaires avec limite */}
                <div className="muscle-groups">
                  {(() => {
                    const groupes = workout.machine.groupe.split(',');
                    const maxVisibleGroups = 2;
                    
                    return (
                      <>
                        {groupes.slice(0, maxVisibleGroups).map((groupe, index) => (
                          <span key={index} className="muscle-group">
                            {groupe.trim()}
                          </span>
                        ))}
                        {groupes.length > maxVisibleGroups && (
                          <span className="more-groups">+{groupes.length - maxVisibleGroups}</span>
                        )}
                      </>
                    );
                  })()}
                </div>
                
                <div className="workout-stats">
                  {workout.series && <span>{workout.series} série{workout.series !== 1 ? 's' : ''}</span>}
                  <span>{workout.repetitions} répétitions</span>
                  <span>{workout.poids} kg</span>
                </div>
                
                {workout.notes && (
                  <p className="workout-notes text-truncate">{workout.notes}</p>
                )}
              </div>
              
              <button 
                className="btn-delete"
                onClick={() => handleDeleteWorkout(workout.id)}
                aria-label="Supprimer cet exercice"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}