'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star, Fuel, Users, ArrowRight, Plus, Minus, X } from 'lucide-react';
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
    <main className="browse-page">
      <div className="browse-header">
        <div className="container">
          <h1>Rent a <span className="gradient-text">Premium Car</span></h1>
          <p>{filtered.length} vehicles available for your self-drive journey</p>
        </div>
      </div>

      <div className="container browse-layout">
        {/* Sidebar Filters */}
        <aside className={`sidebar card ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
            <h3 className="sidebar-title">
              <SlidersHorizontal size={18} color="var(--primary)" />
              <span>Filters</span>
            </h3>
            <div className="mobile-filter-toggle">
              {isMobileFilterOpen ? <Minus size={18} /> : <Plus size={18} />}
            </div>
          </div>

          <div className="filter-content">
            <div className="filter-group">
              <label>Car Type</label>
              <div className="category-pills">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="price-label-row">
                <label>Max Rent</label>
                <span className="price-val">{formatINR(maxPrice)}/day</span>
              </div>
              <input
                type="range"
                min={1000}
                max={15000}
                step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(+e.target.value)}
                className="price-slider"
              />
              <div className="price-range-labels">
                <span>₹1,000</span>
                <span>₹15,000</span>
              </div>
            </div>

            <div className="filter-group">
              <label>Transmission</label>
              <div className="radio-group">
                {['All', 'Auto', 'Manual'].map(t => (
                  <label key={t} className="form-check-label">
                    <input
                      type="radio"
                      name="trans"
                      checked={transmission === t}
                      onChange={() => setTransmission(t)}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  checked={showUnavailable}
                  onChange={e => setShowUnavailable(e.target.checked)}
                />
                <span>Show unavailable cars</span>
              </label>
            </div>

            <button
              onClick={() => { setActiveCategory('All'); setMaxPrice(15000); setTransmission('All'); setSearch(''); }}
              className="btn-outline w-full"
              style={{ marginTop: '10px', width: '100%', padding: '10px' }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Cars Content */}
        <div className="cars-content-area">
          {/* Search bar & Sort */}
          <div className="cars-topbar">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                placeholder="Search by car name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="Recommended">Recommended</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-box">Loading rental cars...</div>
          ) : filtered.length === 0 ? (
            <div className="card empty-box">
              <h3>No cars found matching your criteria</h3>
              <p>Try adjusting your search filters or resetting them</p>
            </div>
          ) : (
            <div className="cars-grid">
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
                    <div className="car-specs-row">
                      <span><Users size={14} /> {car.seats} Seats</span>
                      <span><Fuel size={14} /> {car.fuel}</span>
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
