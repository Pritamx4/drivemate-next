import './globals.css';
import { Suspense } from 'react';
import { CarProvider } from '@/context/CarContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "DriveMate | India's Premium Car Rental Service",
  description: 'Rent premium SUVs, luxury sedans, electric and sports cars across India with 24/7 support and unlimited kilometres.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <CarProvider>
          <Suspense fallback={<nav className="navbar" />}>
            <Navbar />
          </Suspense>
          <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
            {children}
          </Suspense>
          <Footer />
        </CarProvider>
      </body>
    </html>
  );
}
