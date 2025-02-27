import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Application de suivi d\'entraînement sportif',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
