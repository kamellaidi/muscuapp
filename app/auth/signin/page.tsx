'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Identifiants incorrects');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>Connexion</h1>
        <Link href="/" className="btn-small">Accueil</Link>
      </header>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" className="btn-submit" style={{ width: '100%' }} disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <span>ou</span>
        </div>
        
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="btn-add"
          style={{ backgroundColor: '#4285F4' }}
        >
          Se connecter avec Google
        </button>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>
            Pas encore de compte ?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--primary-color)' }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}