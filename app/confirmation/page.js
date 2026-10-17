'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, ArrowRight } from 'lucide-react';

const CONFETTI_COLORS = ['#00d4ff', '#0080ff', '#25D366', '#ffffff', '#0052cc'];

export default function ConfirmationPage() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
    }));
    setPieces(p);
  }, []);

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      {/* Confetti Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99 }}>
        {pieces.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: '2px',
              opacity: 0.8,
              animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '580px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="card" style={{ padding: '60px 40px', borderRadius: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 0 40px rgba(37, 211, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <MessageCircle size={44} color="#fff" />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Request Sent!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
            We have forwarded your booking request directly to our team via WhatsApp.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>What happens next?</h3>
            <ul style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Our operations manager reviews the car availability for your requested dates.</li>
              <li style={{ marginBottom: '8px' }}>You will receive confirmation & pickup location details on WhatsApp.</li>
              <li>Documentation and security deposit are handled transparently upon vehicle hand-off.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/cars" className="btn-primary" style={{ flex: 1, padding: '14px' }}>
              <Search size={18} /> Browse More Cars
            </Link>
          </div>

          <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#888', fontSize: '14px' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
