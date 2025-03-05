// app/planifier/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkoutPlan, Machine, PlanExercise } from '@/types';

export default function EditPlan(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const planId = params.id as string;
  
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [exerciseDetails, setExerciseDetails] = useState<{
    repetitions?: number;
    series?: number;
    poids?: number;
    notes?: string;
  }>({});
  
  // Charger le plan et les machines
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setIsLoading(true);
      
      try {
        // Charger le plan depuis localStorage
        const savedPlans = localStorage.getItem('workout_plans');
        if (savedPlans) {
          const plans: WorkoutPlan[] = JSON.parse(savedPlans);
          const foundPlan = plans.find(p => p.id === planId);
          
          if (foundPlan) {
            setPlan(foundPlan);
          } else {
            router.push('/planifier');
            return;
          }
        } else {
          router.push('/planifier');
          return;
        }
        
        // Charger les machines depuis l'API
        const res = await fetch('/api/machines');
        if (!res.ok) throw new Error('Erreur lors du chargement des machines');
        const machinesData: Machine[] = await res.json();
        setMachines(machinesData);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [planId, router]);
  
  // Sauvegarder les changements dans localStorage
  const savePlan = (): void => {
    if (!plan) return;
    
    try {
      const savedPlans = localStorage.getItem('workout_plans');
      if (savedPlans) {
        const plans: WorkoutPlan[] = JSON.parse(savedPlans);
        const updatedPlans = plans.map(p => p.id === plan.id ? plan : p);
        localStorage.setItem('workout_plans', JSON.stringify(updatedPlans));
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };
  
  // Mettre à jour automatiquement le localStorage lorsque le plan change
  useEffect(() => {
    if (plan && !isLoading) {
      savePlan();
    }
  }, [plan, isLoading]);
  
  // Ajouter un exercice au plan
  const addExercise = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (!selectedMachine || !plan) return;
    
    const machine = machines.find(m => m.id === selectedMachine);
    if (!machine) return;
    
    const newExercise: PlanExercise = {
      id: Date.now().toString(),
      machineId: machine.id,
      machineName: machine.nom,
      machineGroupe: machine.groupe,
      machineCategorie: machine.categorie,
      ...exerciseDetails
    };
    
    setPlan({
      ...plan,
      exercises: [...plan.exercises, newExercise]
    });
    
    // Réinitialiser le formulaire
    setSelectedMachine('');
    setExerciseDetails({});
  };
  
  // Supprimer un exercice du plan
  const removeExercise = (exerciseId: string): void => {
    if (!plan) return;
    
    setPlan({
      ...plan,
      exercises: plan.exercises.filter(ex => ex.id !== exerciseId)
    });
  };
  
  // Déplacer un exercice vers le haut ou le bas
  const moveExercise = (exerciseId: string, direction: 'up' | 'down'): void => {
    if (!plan) return;
    
    const exerciseIndex = plan.exercises.findIndex(ex => ex.id === exerciseId);
    if (exerciseIndex === -1) return;
    
    const newExercises = [...plan.exercises];
    
    if (direction === 'up' && exerciseIndex > 0) {
      // Déplacer vers le haut
      [newExercises[exerciseIndex], newExercises[exerciseIndex - 1]] = 
      [newExercises[exerciseIndex - 1], newExercises[exerciseIndex]];
    } else if (direction === 'down' && exerciseIndex < newExercises.length - 1) {
      // Déplacer vers le bas
      [newExercises[exerciseIndex], newExercises[exerciseIndex + 1]] = 
      [newExercises[exerciseIndex + 1], newExercises[exerciseIndex]];
    }
    
    setPlan({
      ...plan,
      exercises: newExercises
    });
  };
  
  if (isLoading) {
    return <div className="mobile-container">Chargement...</div>;
  }
  
  if (!plan) {
    return (
      <div className="mobile-container">
        <p>Plan non trouvé</p>
        <Link href="/planifier" className="btn-small">Retour</Link>
      </div>
    );
  }
  
  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Éditer le plan</h1>
        <Link href="/planifier" className="btn-small">Retour</Link>
      </header>
      
      <div className="plan-edit-header">
        <h2>{plan.name}</h2>
        {plan.description && <p className="plan-description">{plan.description}</p>}
      </div>
      
      <div className="add-exercise-form">
        <h3>Ajouter un exercice</h3>
        <form onSubmit={addExercise}>
          <div className="form-group">
            <label htmlFor="machine">Machine/Exercice:</label>
            <select
              id="machine"
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Sélectionner un exercice</option>
              <optgroup label="Jambes">
                {machines
                  .filter(m => m.groupe.includes('Jambes') || m.groupe.includes('Quadriceps') || m.groupe.includes('Fessiers'))
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
              </optgroup>
              <optgroup label="Pectoraux">
                {machines
                  .filter(m => m.groupe.includes('Pectoraux'))
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
              </optgroup>
              {/* Autres groupes musculaires */}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="series">Séries:</label>
              <input
                type="number"
                id="series"
                value={exerciseDetails.series || ''}
                onChange={(e) => setExerciseDetails({...exerciseDetails, series: parseInt(e.target.value) || undefined})}
                min="1"
                placeholder="Ex: 3"
                className="form-input"
              />
            </div>
            
            <div className="form-group half">
              <label htmlFor="repetitions">Répétitions:</label>
              <input
                type="number"
                id="repetitions"
                value={exerciseDetails.repetitions || ''}
                onChange={(e) => setExerciseDetails({...exerciseDetails, repetitions: parseInt(e.target.value) || undefined})}
                min="1"
                placeholder="Ex: 12"
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="poids">Poids (kg):</label>
            <input
              type="number"
              id="poids"
              value={exerciseDetails.poids || ''}
              onChange={(e) => setExerciseDetails({...exerciseDetails, poids: parseFloat(e.target.value) || undefined})}
              min="0"
              step="0.5"
              placeholder="Optionnel"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              value={exerciseDetails.notes || ''}
              onChange={(e) => setExerciseDetails({...exerciseDetails, notes: e.target.value})}
              placeholder="Instructions, variantes, etc."
              className="form-textarea"
            />
          </div>
          
          <button type="submit" className="btn-submit">Ajouter cet exercice</button>
        </form>
      </div>
      
      <div className="plan-exercises">
        <h3>Exercices du plan ({plan.exercises.length})</h3>
        
        {plan.exercises.length === 0 ? (
          <p className="empty-message">Aucun exercice dans ce plan</p>
        ) : (
          <div className="exercises-list">
            {plan.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-item">
                <div className="exercise-details">
                  <h4>{exercise.machineName}</h4>
                  
                  <div className="exercise-specs">
                    {exercise.series && (
                      <span className="exercise-spec">{exercise.series} série{exercise.series !== 1 ? 's' : ''}</span>
                    )}
                    
                    {exercise.repetitions && (
                      <span className="exercise-spec">{exercise.repetitions} rep{exercise.repetitions !== 1 ? 's' : ''}</span>
                    )}
                    
                    {exercise.poids && (
                      <span className="exercise-spec">{exercise.poids} kg</span>
                    )}
                  </div>
                  
                  {exercise.notes && (
                    <p className="exercise-notes">{exercise.notes}</p>
                  )}
                </div>
                
                <div className="exercise-actions">
                  <button 
                    onClick={() => moveExercise(exercise.id, 'up')} 
                    disabled={index === 0}
                    className="btn-move"
                    aria-label="Déplacer vers le haut"
                  >
                    ↑
                  </button>
                  
                  <button 
                    onClick={() => moveExercise(exercise.id, 'down')} 
                    disabled={index === plan.exercises.length - 1}
                    className="btn-move"
                    aria-label="Déplacer vers le bas"
                  >
                    ↓
                  </button>
                  
                  <button 
                    onClick={() => removeExercise(exercise.id)}
                    className="btn-remove"
                    aria-label="Supprimer cet exercice"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}