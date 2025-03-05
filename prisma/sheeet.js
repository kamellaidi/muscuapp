'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Machine, Workout } from '@/types';

export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newWorkout, setNewWorkout] = useState({
    machineId: '',
    repetitions: '',
    poids: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Charger les machines au démarrage
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) throw new Error('Erreur lors du chargement des machines');
        const data = await res.json();
        setMachines(data);
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchMachines();
  }, []);

  // Charger les entraînements à chaque changement de date
  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/workouts?date=${selectedDate}`);
        if (!res.ok) throw new Error('Erreur lors du chargement des entraînements');
        const data = await res.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [selectedDate]);

  // Gestion du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewWorkout(prev => ({ ...prev, [name]: value }));
  };

  // Ajouter un entraînement
  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWorkout.machineId || !newWorkout.repetitions || !newWorkout.poids) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          machineId: parseInt(newWorkout.machineId),
          repetitions: parseInt(newWorkout.repetitions),
          poids: parseFloat(newWorkout.poids)
        })
      });
      
      if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'entraînement');
      
      const newWorkoutData = await res.json();
      setWorkouts(prev => [newWorkoutData, ...prev]);
      
      // Réinitialiser le formulaire
      setNewWorkout({
        machineId: '',
        repetitions: '',
        poids: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'entraînement');
    }
  };

  // Supprimer un entraînement
  const handleDeleteWorkout = async (id: number) => {
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

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>MuscuApp</h1>
        <p className="subtitle">Pour suivre mon activité à la salle</p>
        <Link href="/machines" className="btn-small">Machines</Link>
      </header>
      
      <div className="date-selector">
        <label htmlFor="date">Date:</label>
        <input 
          type="date" 
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
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
            <div className="form-group">
              <label htmlFor="machine">Machine:</label>
              <select
                id="machine"
                name="machineId"
                value={newWorkout.machineId}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner une machine</option>
                <optgroup label="Machines cardiovasculaires">
                  {machines.filter(m => m.categorie === 'cardio').map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom} - {machine.description}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Machines de musculation guidée">
                  {machines.filter(m => m.categorie === 'guidee').map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom} - {machine.description}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Équipements poids libres">
                  {machines.filter(m => m.categorie === 'libre').map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom} - {machine.description}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Équipements fonctionnels">
                  {machines.filter(m => m.categorie === 'fonctionnel').map(machine => (
                    <option key={machine.id} value={machine.id}>
                      {machine.nom} - {machine.description}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="repetitions">Répétitions:</label>
              <input
                type="number"
                id="repetitions"
                name="repetitions"
                value={newWorkout.repetitions}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
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
      
      <div className="workout-list">
        <h2>Exercices du {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
        
        {isLoading ? (
          <p>Chargement...</p>
        ) : workouts.length === 0 ? (
          <p className="empty-message">Aucun exercice enregistré pour cette date</p>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className={`workout-card ${workout.machine.categorie}`}>
              <div className="workout-info">
                <h3>{workout.machine.nom}</h3>
                <span className="muscle-group">{workout.machine.groupe}</span>
                <div className="workout-stats">
                  <span>{workout.repetitions} répétitions</span>
                  <span>{workout.poids} kg</span>
                </div>
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteWorkout(workout.id)}
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