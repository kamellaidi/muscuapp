// app/planifier/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { WorkoutPlan } from '@/types';

export default function Planifier(): React.ReactElement {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newPlanName, setNewPlanName] = useState<string>('');
  const [newPlanDescription, setNewPlanDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Charger les plans existants depuis localStorage
  useEffect(() => {
    const loadPlans = (): void => {
      setIsLoading(true);
      try {
        const savedPlans = localStorage.getItem('workout_plans');
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des plans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlans();
  }, []);
  
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
  
  // Créer un nouveau plan
  const createPlan = (e: FormEvent): void => {
    e.preventDefault();
    
    if (!newPlanName.trim()) return;
    
    const newPlan: WorkoutPlan = {
      id: Date.now().toString(),
      name: newPlanName,
      description: newPlanDescription,
      exercises: [],
      createdAt: new Date().toISOString()
    };
    
    setPlans(prevPlans => [...prevPlans, newPlan]);
    setNewPlanName('');
    setNewPlanDescription('');
    setShowCreateForm(false);
  };
  
  // Supprimer un plan
  const deletePlan = (id: string): void => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) return;
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
  };
  
  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Planifier</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      {!showCreateForm ? (
        <button 
          className="btn-add"
          onClick={() => setShowCreateForm(true)}
        >
          + Créer un nouveau plan
        </button>
      ) : (
        <div className="form-container">
          <h2>Nouveau plan</h2>
          <form onSubmit={createPlan}>
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
                Créer
              </button>
            </div>
          </form>
        </div>
      )}
      
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
                  <Link href={`/planifier/${plan.id}`} className="btn-small">
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