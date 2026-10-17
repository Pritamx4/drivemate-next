'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, Fuel, Users, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

const CATEGORIES = ['All', 'SUV', 'Hatchback', 'Sedan', 'Sports', 'Electric'];

export default function BrowsePage() {
  const { cars, loading } = useCars();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [transmission, setTransmission] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filtered = cars
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const matchPrice = c.pricePerDay <= maxPrice;
      const matchTrans = transmission === 'All' || c.transmission === transmission;
      const matchAvail = showUnavailable ? true : c.available;
      return matchSearch && matchCat && matchPrice && matchTrans && matchAvail;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'Price: High to Low') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'Rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div style={{ background: 'linear-gradient(180deg, rgba(0, 212, 255, 0.05) 0%, transparent 100%)', padding: '40px 0 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '40px' }}>
        <div className="container">
          <h1 style={{ fontSize: '38px', fontWeight: 800 }}>Rent a <span className="gradient-text">Premium Car</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>{filtered.length} vehicles available for your self-drive journey</p>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Sidebar Filters */}
        <aside className="card" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="var(--primary)" /> Filters
            </h3>
            <button
              onClick={() => { setActiveCategory('All'); setMaxPrice(15000); setTransmission('All'); setSearch(''); }}
              style={{ background: 'transparent', color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}
            >
              Reset
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 700, display: 'block', marginBottom: '10px' }}>Car Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 500,
                    background: activeCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                    color: activeCategory === cat ? '#000' : '#ccc',
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 700 }}>Max Rent</label>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-tech)' }}>{formatINR(maxPrice)}/day</span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '4px' }}>
              <span>₹1,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', fontWeight: 700, display: 'block', marginBottom: '10px' }}>Transmission</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['All', 'Auto', 'Manual'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="trans"
                    checked={transmission === t}
                    onChange={() => setTransmission(t)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={e => setShowUnavailable(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Show unavailable cars</span>
            </label>
          </div>
        </aside>

        {/* Cars Content */}
        <div>
          {/* Search bar & Sort */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#777' }} />
              <input
                type="text"
                placeholder="Search by car name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '12px 18px',
                background: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Recommended">Recommended</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading rental cars...</div>
          ) : filtered.length === 0 ? (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <h3>No cars found matching your criteria</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try adjusting your search filters</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filtered.map(car => (
                <div key={car.id} className="featured-car-card card">
                  <div className="fc-image">
                    <img src={car.image} alt={car.name} className="fc-car-img" />
                    <span className="fc-category badge">{car.category}</span>
                    <div
                      className="fc-available-dot"
                      style={{ background: car.available ? '#25D366' : '#ff4444', boxShadow: car.available ? '0 0 10px #25D366' : '0 0 10px #ff4444' }}
                      title={car.available ? 'Available' : 'Unavailable'}
                    />
                  </div>
                  <div className="fc-body">
                    <div className="fc-header">
                      <h3>{car.name}</h3>
                      <div className="fc-rating"><Star size={14} fill="#f5a623" color="#f5a623" /> {car.rating}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: '#999', margin: '8px 0 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {car.seats} Seats</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Fuel size={14} /> {car.fuel}</span>
                      <span>⚙️ {car.transmission}</span>
                    </div>
                    <div className="fc-price">{formatINR(car.pricePerDay)}<span>/day</span></div>
                    <Link
                      href={`/cars/${car.id}`}
                      className="btn-primary fc-btn"
                      style={{ opacity: car.available ? 1 : 0.6 }}
                    >
                      {car.available ? 'Rent Now' : 'View Details'} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
