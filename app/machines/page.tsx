// app/machines/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  // États pour la pagination
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const groupesMusculaires: string[] = [
    'Jambes', 'Quadriceps', 'Fessiers', 'Pectoraux', 'Dos', 'Épaules', 'Biceps', 
    'Triceps', 'Abdominaux', 'Avant-bras', 'Corps complet', 'Cardio', 'Récupération'
  ];

  // Cache pour les machines par groupe
  const machineCache = useRef<{[key: string]: {
    machines: Machine[], 
    page: number,
    totalPages: number
  }}>({});

  // Fonction de chargement optimisée
  const fetchMachines = useCallback(async (page: number = 1, group: string = 'all') => {
    // Vérifier si nous avons déjà cette page en cache
    const cacheKey = `${group}_${page}`;
    if (machineCache.current[cacheKey]) {
      setMachines(machineCache.current[cacheKey].machines);
      setCurrentPage(page);
      setTotalPages(machineCache.current[cacheKey].totalPages);
      setHasMore(page < machineCache.current[cacheKey].totalPages);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Construire l'URL avec paramètres de pagination et filtrage
      const url = new URL('/api/machines', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '20');
      if (group !== 'all') {
        url.searchParams.append('group', group);
      }
      
      const res = await fetch(url.toString());
      
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (page === 1) {
        // Première page: remplacer les machines
        setMachines(data.machines);
      } else {
        // Pages suivantes: ajouter aux machines existantes
        setMachines(prev => [...prev, ...data.machines]);
      }
      
      // Mettre à jour les informations de pagination
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      
      // Mettre en cache les résultats sans référence à l'état machines
      machineCache.current[cacheKey] = {
        machines: page === 1 ? data.machines : [...(machineCache.current[`${group}_${page-1}`]?.machines || []), ...data.machines],
        page: data.pagination.currentPage,
        totalPages: data.pagination.totalPages
      };
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur de chargement des machines');
    } finally {
      setIsLoading(false);
    }
  }, []); // Plus de dépendance à machines

  // Chargement initial et lors du changement de groupe
  useEffect(() => {
    setMachines([]);
    fetchMachines(1, activeGroup);
  }, [activeGroup, fetchMachines]);

  // Fonction pour charger plus de machines (bouton explicite)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchMachines(currentPage + 1, activeGroup);
    }
  }, [isLoading, hasMore, currentPage, activeGroup, fetchMachines]);

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

  // Supprimer une machine
  const handleDeleteMachine = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette machine ?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/machines/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      
      setMachines(prev => prev.filter(machine => machine.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la machine');
    }
  };

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
          {machines.length > 0 && <span className="count">({machines.length})</span>}
        </h2>
        
        {machines.length === 0 && isLoading ? (
          <p className="loading">Chargement...</p>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => fetchMachines(1, activeGroup)} className="btn-retry">Réessayer</button>
          </div>
        ) : machines.length === 0 ? (
          <p className="empty-message">Aucune machine dans cette catégorie</p>
        ) : (
          <>
            {/* Liste des machines optimisée pour mobile */}
            <div className="machines-grid">
              {machines.map(machine => (
                <div key={machine.id} className={`machine-card ${machine.categorie}`}>
                  <div className="machine-info">
                    <h3>{machine.nom}</h3>
                    {machine.description && <p className="description">{machine.description}</p>}
                    
                    <div className="muscle-groups">
                      {(() => {
                        const groupes = machine.groupe.split(',');
                        const maxVisibleGroups = 5; // Limiter à 2 groupes visibles
                        
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
                  </div>
                  {/* <button 
                    className="btn-delete"
                    onClick={() => handleDeleteMachine(machine.id)}
                    aria-label="Supprimer cette machine"
                  >
                    ×
                  </button> */}
                </div>
              ))}
            </div>
            
            {/* Indicateur de chargement */}
            {isLoading && <p className="loading-more">Chargement...</p>}
            
            {/* Bouton "Charger plus" (toujours visible s'il y a plus de contenu) */}
            {!isLoading && hasMore && (
              <button className="load-more-button" onClick={loadMore}>
                Afficher plus de machines
              </button>
            )}
            
            {/* Indicateur de fin de liste */}
            {!isLoading && !hasMore && machines.length > 20 && (
              <p className="end-of-list">Vous avez vu toutes les machines</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}