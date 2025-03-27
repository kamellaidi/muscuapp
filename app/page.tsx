'use client';

import Link from 'next/link';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function Home(): React.ReactElement {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="mobile-container">
      <header className="app-header">
        <div className="header-content">
          <h1>MuscuApp</h1>
        </div>
        <p className="subtitle">Pour suivre mon activité à la salle</p>
      </header>

      <div className="nav-container">
        <Link href="/seance" className="nav-button">
          <span className="nav-icon">💪</span>
          <span>SÉANCE</span>
        </Link>

        <Link href="/historique" className="nav-button">
          <span className="nav-icon">📊</span>
          <span>HISTORIQUE</span>
        </Link>

        <Link href="/plans" className="nav-button">
          <span className="nav-icon">📋</span>
          <span>PLANS</span>
        </Link>

        <Link href="/machines" className="nav-button">
          <span className="nav-icon">🏋️</span>
          <span>MACHINES</span>
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="nav-container" style={{ marginTop: '20px' }}>
          <Link href="/profile" className="nav-button" style={{ backgroundColor: 'var(--primary-color)', color: 'white', gridColumn: 'span 2' }}>
            <span className="nav-icon">👤</span>
            <span>MON PROFIL</span>
          </Link>
        </div>
      ) : (
        <div className="nav-container" style={{ marginTop: '20px' }}>
          <Link href="/auth/signin" className="nav-button" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
            <span className="nav-icon">🔑</span>
            <span>SE CONNECTER</span>
          </Link>

          <Link href="/auth/signup" className="nav-button" style={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}>
            <span className="nav-icon">✏️</span>
            <span>S'INSCRIRE</span>
          </Link>
        </div>
      )}


    </div>
  );
}