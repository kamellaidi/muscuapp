// app/plans/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { WorkoutPlan, Machine, PlanExercise } from '@/types';

export default function PlanifierPage(): React.ReactElement {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showExerciseForm, setShowExerciseForm] = useState<boolean>(false);
  const [newPlanName, setNewPlanName] = useState<string>('');
  const [newPlanDescription, setNewPlanDescription] = useState<string>('');
  const [tempPlan, setTempPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // États pour l'ajout d'exercices
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [exerciseDetails, setExerciseDetails] = useState<{
    repetitions?: number;
    series?: number;
    poids?: number;
    notes?: string;
  }>({
    series: 3 // Valeur par défaut
  });
  
  // Groupes musculaires avec emojis pour le filtrage
  const muscleGroups = [
    { id: 'all', name: '🏋️ Tous' },
    { id: 'Jambes', name: '🦵 Jambes' },
    { id: 'Quadriceps', name: '🦵 Quadriceps' },
    { id: 'Pectoraux', name: '💪 Pectoraux' },
    { id: 'Dos', name: '🔙 Dos' },
    { id: 'Épaules', name: '🙌 Épaules' },
    { id: 'Biceps', name: '💪 Biceps' },
    { id: 'Triceps', name: '💪 Triceps' },
    { id: 'Abdominaux', name: '🧍 Abdominaux' },
    { id: 'Fessiers', name: '🍑 Fessiers' },
    { id: 'Corps complet', name: '⭐ Corps complet' },
  ];
  
  // Charger les plans existants depuis localStorage
  useEffect(() => {
    const loadPlans = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const savedPlans = localStorage.getItem('workout_plans');
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans));
        }
        
        // Charger les machines depuis l'API
        const res = await fetch('/api/machines?limit=100');
        if (!res.ok) throw new Error('Erreur lors du chargement des machines');
        const data = await res.json();
        setMachines(data.machines);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlans();
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
  
  // Sauvegarder les plans dans localStorage
  useEffect(() => {
    const savePlans = (): void => {
      try {
        localStorage.setItem('workout_plans', JSON.stringify(plans));
      } catch (err) {
        console.error('Erreur lors de la sauvegarde des plans:', err);
      }
    };
    
    if (!isLoading) {
      savePlans();
    }
  }, [plans, isLoading]);
  
  // Gérer les changements dans le formulaire
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    if (name === 'planName') {
      setNewPlanName(value);
    } else if (name === 'planDescription') {
      setNewPlanDescription(value);
    }
  };
  
  // Commencer la création d'un plan
  const startCreatePlan = (e: FormEvent): void => {
    e.preventDefault();
    
    if (!newPlanName.trim()) return;
    
    const newPlan: WorkoutPlan = {
      id: Date.now().toString(),
      name: newPlanName,
      description: newPlanDescription,
      exercises: [],
      createdAt: new Date().toISOString()
    };
    
    setTempPlan(newPlan);
    setShowExerciseForm(true);
  };
  
  // Ajouter un exercice au plan temporaire
  const addExercise = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine || !tempPlan) return;
    
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
    
    setTempPlan({
      ...tempPlan,
      exercises: [...tempPlan.exercises, newExercise]
    });
    
    // Réinitialiser le formulaire d'exercice
    setSelectedMachine('');
    setExerciseDetails({
      series: 3
    });
  };
  
  // Supprimer un exercice du plan temporaire
  const removeExercise = (exerciseId: string) => {
    if (!tempPlan) return;
    
    setTempPlan({
      ...tempPlan,
      exercises: tempPlan.exercises.filter(ex => ex.id !== exerciseId)
    });
  };
  
  // Finaliser la création du plan
  const finalizePlan = () => {
    if (!tempPlan) return;
    
    setPlans(prevPlans => [...prevPlans, tempPlan]);
    
    // Réinitialiser tous les états
    setTempPlan(null);
    setNewPlanName('');
    setNewPlanDescription('');
    setShowCreateForm(false);
    setShowExerciseForm(false);
    setSelectedMachine('');
    setExerciseDetails({ series: 3 });
    setActiveGroup('all');
  };
  
  // Annuler la création du plan
  const cancelPlanCreation = () => {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications seront perdues.')) {
      setTempPlan(null);
      setNewPlanName('');
      setNewPlanDescription('');
      setShowCreateForm(false);
      setShowExerciseForm(false);
    }
  };
  
  // Supprimer un plan
  const deletePlan = (id: string): void => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
  };
  
  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Plans d'entraînement</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      {!showCreateForm && !showExerciseForm ? (
        <button 
          className="btn-add"
          onClick={() => setShowCreateForm(true)}
        >
          + Créer un nouveau plan
        </button>
      ) : showCreateForm && !showExerciseForm ? (
        <div className="form-container">
          <h2>Nouveau plan</h2>
          <form onSubmit={startCreatePlan}>
            <div className="form-group">
              <label htmlFor="planName">Nom du plan:</label>
              <input
                type="text"
                id="planName"
                name="planName"
                value={newPlanName}
                onChange={handleInputChange}
                placeholder="Ex: Jour Jambes, Push, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="planDescription">Description (optionnelle):</label>
              <textarea
                id="planDescription"
                name="planDescription"
                value={newPlanDescription}
                onChange={handleInputChange}
                placeholder="Décrivez votre plan d'entraînement"
                rows={3}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowCreateForm(false)}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="btn-submit"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      ) : showExerciseForm && tempPlan ? (
        <>
          <div className="plan-edit-header">
            <h2>{tempPlan.name}</h2>
            {tempPlan.description && <p className="plan-description">{tempPlan.description}</p>}
          </div>
          
          <div className="add-exercise-form">
            <h3>Ajouter un exercice</h3>
            
            <form onSubmit={addExercise}>
              <div className="form-group">
                <label htmlFor="muscle-group">Groupe musculaire:</label>
                <select
                  id="muscle-group"
                  value={activeGroup}
                  onChange={(e) => setActiveGroup(e.target.value)}
                  className="form-select"
                >
                  {muscleGroups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="machine">Machine/Exercice:</label>
                <select
                  id="machine"
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                  required
                  className="form-select"
                  disabled={filteredMachines.length === 0}
                >
                  <option value="">Sélectionner un exercice</option>
                  {filteredMachines.map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom} {machine.description ? `- ${machine.description}` : ''}
                    </option>
                  ))}
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
            <h3>Exercices du plan ({tempPlan.exercises.length})</h3>
            
            {tempPlan.exercises.length === 0 ? (
              <p className="empty-message">Aucun exercice dans ce plan</p>
            ) : (
              <div className="exercises-list">
                {tempPlan.exercises.map((exercise) => (
                  <div key={exercise.id} className={`exercise-item ${exercise.machineCategorie}`}>
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
          
          <div className="finish-plan-actions">
            <button 
              className="btn-cancel"
              onClick={cancelPlanCreation}
            >
              Annuler
            </button>
            <button 
              className="btn-submit"
              onClick={finalizePlan}
            >
              Enregistrer le plan
            </button>
          </div>
        </>
      ) : null}
      
      <div className="plans-list">
        <h2>Mes plans d'entraînement</h2>
        
        {isLoading ? (
          <p className="loading">Chargement...</p>
        ) : plans.length === 0 ? (
          <p className="empty-message">Aucun plan créé</p>
        ) : (
          plans.map((plan: WorkoutPlan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-actions">
                  <Link href={`/plans/${plan.id}`} className="btn-small">
                    Éditer
                  </Link>
                  <button 
                    onClick={() => deletePlan(plan.id)}
                    className="btn-small-outline"
                    aria-label="Supprimer ce plan"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              
              {plan.description && (
                <p className="plan-description">{plan.description}</p>
              )}
              
              <div className="plan-summary">
                <span>{plan.exercises.length} exercice{plan.exercises.length !== 1 ? 's' : ''}</span>
                {plan.createdAt && (
                  <span className="plan-created">
                    Créé le {new Date(plan.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
              
              <Link 
                href={`/seance?plan=${plan.id}`} 
                className="plan-start-button"
              >
                Démarrer ce plan
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}