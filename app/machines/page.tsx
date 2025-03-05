// app/machines/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Machine } from '@/types';

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [newMachine, setNewMachine] = useState<{
    nom: string;
    description: string;
    groupe: string;
    categorie: string;
  }>({
    nom: '',
    description: '',
    groupe: '',
    categorie: 'guidee'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const groupesMusculaires: string[] = [
    'Jambes', 'Quadriceps', 'Fessiers', 'Pectoraux', 'Dos', 'Épaules', 'Biceps', 
    'Triceps', 'Abdominaux', 'Avant-bras', 'Corps complet', 'Cardio', 'Récupération'
  ];

  // Charger les machines au démarrage depuis l'API Prisma
  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setMachines(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Erreur de chargement des machines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMachines();
  }, []);

  // Gestion du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMachine(prev => ({ ...prev, [name]: value }));
  };

  // Ajouter une machine via l'API
  const handleAddMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMachine.nom || !newMachine.groupe || !newMachine.categorie) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMachine)
      });
      
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      
      const newMachineData = await res.json();
      setMachines(prev => [...prev, newMachineData]);
      
      // Réinitialiser le formulaire
      setNewMachine({
        nom: '',
        description: '',
        groupe: '',
        categorie: 'guidee'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de la machine');
    }
  };

  // Supprimer une machine via l'API
  const handleDeleteMachine = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/machines/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      
      setMachines(prev => prev.filter(machine => machine.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la machine');
    }
  };
  
  // Filtrage des machines par groupe musculaire
  const filteredMachines = activeGroup === 'all' 
    ? machines 
    : machines.filter(machine => 
        machine.groupe.includes(activeGroup) || 
        machine.groupe === 'Corps complet' || 
        machine.groupe === 'Tous les groupes'
      );

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Machines</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      <div className="filter-container">
        <select 
          className="group-filter"
          value={activeGroup} 
          onChange={(e) => setActiveGroup(e.target.value)}
        >
          <option value="all">🏋️ Tous les exercices</option>
          <option value="Jambes">🦵 Jambes</option>
          <option value="Quadriceps">🦵 Quadriceps</option>
          <option value="Fessiers">🍑 Fessiers</option>
          <option value="Pectoraux">💪 Pectoraux</option>
          <option value="Dos">🔙 Dos</option>
          <option value="Épaules">🙌 Épaules</option>
          <option value="Biceps">💪 Biceps</option>
          <option value="Triceps">💪 Triceps</option>
          <option value="Abdominaux">🧍 Abdominaux</option>
          <option value="Cardio">❤️ Cardio</option>
          <option value="Corps complet">⭐ Corps complet</option>
          <option value="Récupération">🧘 Récupération</option>
        </select>
      </div>
      
      {!showForm ? (
        <button 
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Ajouter une machine
        </button>
      ) : (
        <div className="form-container">
          <h2>Nouvelle machine</h2>
          <form onSubmit={handleAddMachine}>
            <div className="form-group">
              <label htmlFor="nom">Nom:</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={newMachine.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newMachine.description}
                onChange={handleInputChange}
                placeholder="Ex: Tapis de course"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="groupe">Groupe musculaire:</label>
              <select
                id="groupe"
                name="groupe"
                value={newMachine.groupe}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un groupe</option>
                {groupesMusculaires.map(groupe => (
                  <option key={groupe} value={groupe}>{groupe}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="categorie">Catégorie:</label>
              <select
                id="categorie"
                name="categorie"
                value={newMachine.categorie}
                onChange={handleInputChange}
                required
              >
                <option value="cardio">Cardiovasculaire</option>
                <option value="guidee">Musculation guidée</option>
                <option value="libre">Poids libre</option>
                <option value="fonctionnel">Fonctionnel</option>
              </select>
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
      
      <div className="machine-list">
        <h2>
          {activeGroup === 'all' ? 'Toutes les machines' : `Machines pour ${activeGroup}`}
        </h2>
        
        {isLoading ? (
          <p className="loading">Chargement...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-retry">Réessayer</button>
          </div>
        ) : filteredMachines.length === 0 ? (
          <p className="empty-message">Aucune machine dans cette catégorie</p>
        ) : (
          filteredMachines.map(machine => (
            <div key={machine.id} className={`machine-card ${machine.categorie}`}>
              <div className="machine-info">
                <h3>{machine.nom}</h3>
                {machine.description && <p className="description">{machine.description}</p>}
                
                <div className="muscle-groups">
                  {machine.groupe.split(',').map((groupe, index) => (
                    <span key={index} className="muscle-group">
                      {groupe.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteMachine(machine.id)}
                aria-label="Supprimer cette machine"
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