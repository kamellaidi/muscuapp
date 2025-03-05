// app/page.tsx
import Link from 'next/link';
import React from 'react';

export default function Home(): React.ReactElement {
  return (
    <div className="mobile-container">
      <header className="app-header">
        <h1>MuscuApp</h1>
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
        
        <Link href="/planifier" className="nav-button">
          <span className="nav-icon">📋</span>
          <span>PLANIFIER</span>
        </Link>
        
        <Link href="/machines" className="nav-button">
          <span className="nav-icon">🏋️</span>
          <span>MACHINES</span>
        </Link>
      </div>
    </div>
  );
}