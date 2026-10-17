'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Calendar, Shield, Zap, Headphones, Star, ArrowRight, Car, Phone } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

export default function HomePage() {
  const router = useRouter();
  const { cars } = useCars();
  const [pickup, setPickup] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const featured = cars.filter(c => c.available).slice(0, 3);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !returnDate) {
      alert('Please select pickup and return dates');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('drivemate_pickup_date', pickup);
      localStorage.setItem('drivemate_return_date', returnDate);
    }
    router.push('/cars');
  };

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-orb orb1"></div>
        <div className="hero-bg-orb orb2"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="badge hero-badge">🚗 India's Premium Car Rental</span>
            <h1 className="hero-title">
              Rent. Drive. <span className="gradient-text">Explore.</span>
            </h1>
            <p className="hero-sub">
              The best cars for rent across India — pick up, enjoy the ride, and drop off. No ownership hassle, pure driving bliss.
            </p>

            <form className="search-card" onSubmit={handleSearch}>
              <div className="search-field">
                <Calendar size={18} className="field-icon" />
                <div className="field-info">
                  <label>Pickup Date</label>
                  <input type="date" value={pickup} onChange={e => setPickup(e.target.value)} required />
                </div>
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <Calendar size={18} className="field-icon" />
                <div className="field-info">
                  <label>Return Date</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn-primary search-btn">
                <Search size={18} /> Find Cars
              </button>
            </form>

            <div className="hero-stats">
              {[['500+', 'Cars for Rent'], ['50K+', 'Happy Renters'], ['100+', 'Cities'], ['4.9★', 'Rating']].map(([v, l]) => (
                <div key={l} className="stat">
                  <span className="stat-val">{v}</span>
                  <span className="stat-label">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-car-image">
            <div className="hero-car-glow"></div>
            <div className="hero-inner-circle">
               <svg viewBox="0 0 200 200" className="hero-curved-text">
                <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="transparent" />
                <text fill="var(--primary)" className="curved-svg-text">
                  <textPath href="#circlePath" startOffset="0%">
                    🔥 MOST RENTED THIS WEEK • MOST RENTED THIS WEEK •
                  </textPath>
                </text>
              </svg>
            </div>
            <img src="/cars/thar.png" alt="Mahindra Thar rental" className="hero-car-img" />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-section" id="about">
        <div className="container">
          <h2 className="section-title">How <span className="gradient-text">Drive Mate</span> Works</h2>
          <p className="section-sub">Renting a car has never been easier</p>
          <div className="how-steps">
            {[
              { step: '01', icon: <Search size={28} />, title: 'Choose Your Car', desc: 'Browse our fleet and pick the perfect rental for your trip.' },
              { step: '02', icon: <Calendar size={28} />, title: 'Pick Your Dates', desc: 'Select pickup date, return date, and your preferred location.' },
              { step: '03', icon: <Car size={28} />, title: 'Drive & Enjoy', desc: 'Collect your car, hit the road, and return it hassle-free.' },
              { step: '04', icon: <Phone size={28} />, title: '24/7 Support', desc: 'Our team is always available if you need help on the road.' },
            ].map(s => (
              <div key={s.step} className="how-step card">
                <div className="hs-number">{s.step}</div>
                <div className="hs-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose <span className="gradient-text">Drive Mate</span>?</h2>
          <p className="section-sub">Trusted by thousands of renters across India</p>
          <div className="features-grid">
            {[
              { icon: <Zap size={28} />, title: 'Instant Booking', desc: 'Book your rental car in under 60 seconds with real-time availability.' },
              { icon: <Shield size={28} />, title: 'Fully Insured', desc: 'Every rental includes comprehensive motor insurance coverage.' },
              { icon: <MapPin size={28} />, title: 'GPS & Roadside Aid', desc: 'All cars come with GPS navigation and 24/7 roadside assistance.' },
              { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Our customer care team is available around the clock for you.' },
            ].map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular <span className="gradient-text">Rentals</span></h2>
              <p className="section-sub">Top-picked rental cars this season</p>
            </div>
            <Link href="/cars" className="btn-outline">
              View All Cars <ArrowRight size={16} />
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map(car => (
              <div key={car.id} className="featured-car-card card">
                <div className="fc-image">
                  <img src={car.image} alt={`Rent ${car.name}`} className="fc-car-img" />
                  <span className="fc-category badge">{car.category}</span>
                  <div className="fc-available-dot" title="Available for rental"></div>
                </div>
                <div className="fc-body">
                  <div className="fc-header">
                    <h3>{car.name}</h3>
                    <div className="fc-rating"><Star size={14} fill="#f5a623" color="#f5a623" /> {car.rating}</div>
                  </div>
                  <p className="fc-tagline">Min. age {car.minAge} · {car.mileageLimit}</p>
                  <div className="fc-price">{formatINR(car.pricePerDay)}<span>/day</span></div>
                  <Link href={`/cars/${car.id}`} className="btn-primary fc-btn">
                    Rent Now <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="cta-section" id="contact">
        <div className="container cta-inner">
          <div>
            <h2>Start your journey today</h2>
            <p>Join 50,000+ happy renters across India. Flexible pickup, free cancellation, no hidden fees.</p>
          </div>
          <Link href="/cars" className="btn-primary cta-btn">
            Browse Rental Cars <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
