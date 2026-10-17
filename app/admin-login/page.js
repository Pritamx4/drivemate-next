'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('dm_admin_token')) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('dm_admin_token', data.token);
        router.replace('/admin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection failed. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.08) 0%, #000 70%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '40px 32px', borderRadius: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div className="logo-icon"><Car size={24} /></div>
          <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-brand)' }}>Drive<span style={{ color: 'var(--primary)' }}>Mate</span></span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Admin Portal</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '28px' }}>Sign in to manage your fleet</p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ width: '100%', padding: '12px 42px 12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: '#888' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255, 68, 68, 0.15)', border: '1px solid rgba(255, 68, 68, 0.3)', color: '#ff6666', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#888', fontSize: '13px' }}>
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
