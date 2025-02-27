// app/machines/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Machine } from '@/types';

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
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

  const groupesMusculaires: string[] = [
    'Jambes', 'Pectoraux', 'Dos', 'Épaules', 'Biceps', 
    'Triceps', 'Abdominaux', 'Avant-bras', 'Multiple', 'Cardio', 'Récupération'
  ];

  const categories = [
    { id: 'all', name: 'Toutes' },
    { id: 'cardio', name: 'Cardiovasculaires' },
    { id: 'guidee', name: 'Musculation guidée' },
    { id: 'libre', name: 'Poids libres' },
    { id: 'fonctionnel', name: 'Fonctionnels' }
  ];

  // Charger les machines au démarrage
  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) throw new Error('Erreur lors du chargement des machines');
        const data = await res.json();
        setMachines(data);
      } catch (error) {
        console.error('Erreur:', error);
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

  // Ajouter une machine
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
      
      if (!res.ok) throw new Error('Erreur lors de l\'ajout de la machine');
      
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
  const handleDeleteMachine = async (id: number) => {
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
  
  // Filtrer les machines par catégorie
  const filteredMachines = activeCategory === 'all' 
    ? machines 
    : machines.filter(machine => machine.categorie === activeCategory);

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>MuscuApp</h1>
        <p className="subtitle">Pour suivre mon activité à la salle</p>
        <Link href="/" className="btn-small">Retour</Link>
      </header>
      
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
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
          {activeCategory === 'all' ? 'Toutes les machines' : 
           activeCategory === 'cardio' ? 'Machines cardiovasculaires' :
           activeCategory === 'guidee' ? 'Machines de musculation guidée' :
           activeCategory === 'libre' ? 'Équipements poids libres' : 
           'Équipements fonctionnels'}
        </h2>
        
        {isLoading ? (
          <p>Chargement...</p>
        ) : filteredMachines.length === 0 ? (
          <p className="empty-message">Aucune machine dans cette catégorie</p>
        ) : (
          filteredMachines.map(machine => (
            <div key={machine.id} className={`machine-card ${machine.categorie}`}>
              <div className="machine-info">
                <h3>{machine.nom}</h3>
                {machine.description && <p className="description">{machine.description}</p>}
                <span className="muscle-group">{machine.groupe}</span>
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteMachine(machine.id)}
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