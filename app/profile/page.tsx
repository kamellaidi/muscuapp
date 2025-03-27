'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Charger les données de l'utilisateur
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/profile');
          const data = await response.json();
          
          if (response.ok && data.user) {
            setUserData({
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              email: data.user.email || '',
            });
          }
        } catch (error) {
          console.error('Erreur lors du chargement du profil:', error);
        }
      };
      
      fetchUserData();
    }
  }, [status, session]);
  
  // Mettre à jour le profil
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Erreur lors de la mise à jour', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la mise à jour du profil', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour le mot de passe
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ text: 'Le nouveau mot de passe doit contenir au moins 8 caractères', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ text: 'Mot de passe mis à jour avec succès', type: 'success' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setMessage({ text: data.message || 'Erreur lors de la mise à jour du mot de passe', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la mise à jour du mot de passe', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Afficher un écran de chargement si le statut est en cours de vérification
  if (status === 'loading') {
    return (
      <div className="mobile-container">
        <p className="loading">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Mon Profil</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      {session?.user && (
        <>
          <div className="form-container">
            {message && (
              <p className={message.type === 'success' ? 'success-message' : 'error-message'} 
                 style={{ 
                   padding: '10px', 
                   borderRadius: '4px', 
                   marginBottom: '15px',
                   backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                   color: message.type === 'success' ? '#155724' : '#721c24'
                 }}>
                {message.text}
              </p>
            )}
            
            <form onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group half">
                  <label htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="form-input"
                  style={{ backgroundColor: '#f5f5f5' }}
                />
                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                  L'email ne peut pas être modifié
                </small>
              </div>
              
              <button type="submit" className="btn-submit" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
              </button>
            </form>
          </div>
          
          <div className="form-container">
            <h2>Changer le mot de passe</h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="form-input"
                  required
                  minLength={8}
                />
                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                  Au moins 8 caractères
                </small>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              
              <button type="submit" className="btn-submit" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-add"
            style={{ backgroundColor: '#f44336', marginTop: '20px' }}
          >
            Se déconnecter
          </button>
        </>
      )}
    </div>
  );
}