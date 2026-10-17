'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Car, Plus, Trash2, Eye, EyeOff, LogOut, CheckCircle, XCircle, Camera, RefreshCw, Calendar, Users, Fuel } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Sports', 'Electric', 'Luxury'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { cars, loading, addCar, removeCar, toggleAvailability, refreshCars } = useCars();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'bookings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'SUV',
    pricePerDay: '',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Auto',
    image: '/cars/scorpio_n.png',
    description: '',
    mileageLimit: 'Unlimited KMs',
    minAge: 21
  });

  const notify = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  };

  useEffect(() => {
    const token = localStorage.getItem('dm_admin_token');
    if (!token) {
      router.replace('/admin-login');
    } else {
      setIsAuthenticated(true);
      fetchBookings();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('dm_admin_token');
    router.replace('/admin-login');
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
        notify('Image uploaded successfully!');
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCar = async (e) => {
    e.preventDefault();
    const success = await addCar({
      ...form,
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats),
      minAge: Number(form.minAge),
      isAvailable: true
    });

    if (success) {
      setShowAddModal(false);
      setForm({
        name: '', category: 'SUV', pricePerDay: '', seats: 5, fuel: 'Petrol',
        transmission: 'Auto', image: '/cars/scorpio_n.png', description: '',
        mileageLimit: 'Unlimited KMs', minAge: 21
      });
      notify('Car added successfully to fleet!');
    } else {
      alert('Failed to add car');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dm_admin_token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        notify(`Booking status updated to ${status}`);
      }
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  const handleSeedCars = async () => {
    if (!confirm('Re-seed initial cars in the database?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        await refreshCars();
        notify(`Database seeded! Added ${data.count} cars.`);
      } else {
        alert('Seed failed: ' + data.message);
      }
    } catch (err) {
      alert('Seed error');
    } finally {
      setSeeding(false);
    }
  };

  if (!isAuthenticated) return null;

  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.available).length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px', background: '#050505' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Admin <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>DriveMate Fleet & Booking Operations</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleSeedCars} disabled={seeding} className="btn-outline" style={{ fontSize: '13px', padding: '10px 18px' }}>
              <RefreshCw size={15} /> {seeding ? 'Seeding...' : 'Seed Initial Cars'}
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>
              <Plus size={16} /> Add New Car
            </button>
            <button onClick={handleLogout} style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)', color: '#ff6666', borderRadius: '8px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {msg && (
          <div style={{ background: 'rgba(0, 212, 255, 0.15)', border: '1px solid var(--primary)', color: '#fff', padding: '12px 20px', borderRadius: '10px', marginBottom: '24px' }}>
            ✅ {msg}
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Total Fleet</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>{totalCars}</div>
          </div>
          <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Available Cars</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#25D366', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>{availableCars}</div>
          </div>
          <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Pending Requests</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#f5a623', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>{pendingBookings}</div>
          </div>
          <div className="card" style={{ padding: '24px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Total Bookings</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-tech)', marginTop: '4px' }}>{bookings.length}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('cars')}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              background: activeTab === 'cars' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'cars' ? '#000' : '#aaa'
            }}
          >
            Fleet Cars ({cars.length})
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); fetchBookings(); }}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              background: activeTab === 'bookings' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'bookings' ? '#000' : '#aaa'
            }}
          >
            Booking Requests ({bookings.length})
          </button>
        </div>

        {/* Content: Cars Fleet Tab */}
        {activeTab === 'cars' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {cars.map(car => (
              <div key={car.id} className="card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', padding: '20px', textAlign: 'center', position: 'relative' }}>
                  <span className="badge" style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px' }}>{car.category}</span>
                  <img src={car.image} alt={car.name} style={{ height: '110px', objectFit: 'contain' }} />
                </div>
                <div style={{ marginTop: '16px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{car.name}</h3>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-tech)' }}>{formatINR(car.pricePerDay)}/d</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#888', marginTop: '6px' }}>
                    <span>{car.transmission}</span>
                    <span>·</span>
                    <span>{car.fuel}</span>
                    <span>·</span>
                    <span>{car.seats} Seats</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    onClick={() => toggleAvailability(car.id)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: car.available ? 'rgba(37, 211, 102, 0.15)' : 'rgba(255, 68, 68, 0.15)',
                      color: car.available ? '#25D366' : '#ff6666',
                      border: '1px solid',
                      borderColor: car.available ? 'rgba(37, 211, 102, 0.3)' : 'rgba(255, 68, 68, 0.3)'
                    }}
                  >
                    {car.available ? 'Available' : 'Unavailable'}
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete ${car.name}?`)) removeCar(car.id); }}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#888', borderRadius: '8px', padding: '8px 12px' }}
                    title="Delete car"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content: Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                <h3>No booking requests found</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>New customer requests will show up here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map(b => (
                  <div key={b._id} className="card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{b.carName}</h3>
                        <span className="badge" style={{
                          background: b.status === 'Confirmed' ? 'rgba(37, 211, 102, 0.15)' : b.status === 'Cancelled' ? 'rgba(255, 68, 68, 0.15)' : 'rgba(245, 166, 35, 0.15)',
                          color: b.status === 'Confirmed' ? '#25D366' : b.status === 'Cancelled' ? '#ff6666' : '#f5a623',
                          borderColor: 'transparent'
                        }}>
                          {b.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#bbb', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>👤 <strong>{b.fullName}</strong> — 📞 {b.phone}</span>
                        <span>🪪 Licence: {b.license}</span>
                        <span>📍 Delivery: {b.address}</span>
                        <span>📅 {b.pickupDate} to {b.returnDate} ({b.days} days)</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-tech)' }}>
                        {formatINR(b.totalCost)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={b.status}
                          onChange={e => handleUpdateStatus(b._id, e.target.value)}
                          style={{
                            background: '#111',
                            color: '#fff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '13px'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => window.open(`https://wa.me/${b.phone}?text=Hello ${b.fullName}, regarding your DriveMate rental for ${b.carName}...`, '_blank')}
                          className="btn-primary"
                          style={{ fontSize: '12px', padding: '8px 14px' }}
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Car Modal */}
        {showAddModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', borderRadius: '24px', background: '#0a0a0a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Add New Vehicle to Fleet</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', color: '#888', fontSize: '20px' }}>✕</button>
              </div>

              <form onSubmit={handleCreateCar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Vehicle Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. BMW M4 Competition"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Price/Day (₹) *</label>
                    <input
                      type="number"
                      placeholder="2500"
                      value={form.pricePerDay}
                      onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Seats</label>
                    <input
                      type="number"
                      value={form.seats}
                      onChange={e => setForm({ ...form, seats: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Fuel Type</label>
                    <select
                      value={form.fuel}
                      onChange={e => setForm({ ...form, fuel: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Transmission</label>
                    <select
                      value={form.transmission}
                      onChange={e => setForm({ ...form, transmission: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    >
                      <option value="Auto">Auto</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Image URL / Upload</label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={e => setForm({ ...form, image: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* Upload file directly */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                  <label style={{ fontSize: '12px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Camera size={16} color="var(--primary)" />
                    <span>Upload image from your computer (PNG/JPG/WEBP):</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginTop: '8px', fontSize: '13px' }}
                  />
                  {uploading && <span style={{ color: 'var(--primary)', fontSize: '12px', display: 'block', marginTop: '4px' }}>Uploading image...</span>}
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of vehicle comfort, features and condition..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                    Save Car
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
