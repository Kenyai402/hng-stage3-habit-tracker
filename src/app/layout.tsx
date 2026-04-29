import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegister from '@/components/shared/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits and build streaks',
  manifest: '/manifest.json',
  themeColor: '#5c7a5c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5c7a5c" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body><ServiceWorkerRegister />{children}</body>
    </html>
  );
}
