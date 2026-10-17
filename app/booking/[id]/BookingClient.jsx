'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, Car, ArrowRight } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

export default function BookingClient({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { cars } = useCars();
  const car = cars.find(c => String(c.id) === resolvedParams.id || String(c._id) === resolvedParams.id) || cars[0];

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    license: '',
    pickupDate: '',
    returnDate: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPickup = localStorage.getItem('drivemate_pickup_date');
      const storedReturn = localStorage.getItem('drivemate_return_date');
      if (storedPickup || storedReturn) {
        setForm(prev => ({
          ...prev,
          pickupDate: storedPickup || '',
          returnDate: storedReturn || ''
        }));
      }
    }
  }, []);

  if (!car) {
    return <div style={{ padding: '160px 24px', textAlign: 'center' }}>Loading vehicle details...</div>;
  }

  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
    : 3;

  const total = (car.pricePerDay || 2000) * days;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      carId: car.id || car._id,
      carName: car.name,
      ...form,
      days,
      totalCost: total
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      if (res.ok) {
        const msg = [
          `🚗 *New Car Rental Request — DriveMate*`,
          ``,
          `*Car:* ${car.name} (${car.category})`,
          `*Pickup Date:* ${form.pickupDate}`,
          `*Return Date:* ${form.returnDate}`,
          `*Duration:* ${days} day${days > 1 ? 's' : ''}`,
          `*Total Cost:* ${formatINR(total)}`,
          ``,
          `*Customer Details*`,
          `*Name:* ${form.fullName}`,
          `*Phone:* ${form.phone}`,
          `*Driving Licence:* ${form.license}`,
          `*Address:* ${form.address}`,
          ``,
          `_Booking ID: ${data.booking?._id || 'N/A'}_`,
        ].join('\n');

        const waNumber = data.ownerWhatsApp || '7082628413';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
        
        window.open(waUrl, '_blank');
        router.push('/confirmation');
      } else {
        alert('Booking failed: ' + (data.message || 'Server error'));
      }
    } catch (err) {
      alert('Could not submit booking request. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800 }}>Complete Your <span className="gradient-text">Rental</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Fill in your contact and trip details — your request connects directly to our team via WhatsApp</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="card" style={{ padding: '36px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Renter Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Driving Licence Number *</label>
                <input
                  type="text"
                  name="license"
                  placeholder="e.g. DL-0420110012345"
                  value={form.license}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Delivery Address / Location *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="City, Area or Hotel for pickup"
                  value={form.address}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Pickup Date *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={form.pickupDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', display: 'block', marginBottom: '6px' }}>Return Date *</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '12px' }}
              >
                {loading ? 'Submitting Request...' : 'Send Rental Request via WhatsApp 💬'}
              </button>
            </div>
          </form>

          {/* Booking Summary Box */}
          <div className="card" style={{ padding: '28px', borderRadius: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '18px' }}>Rental Vehicle</h4>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '20px' }}>
              <img src={car.image} alt={car.name} style={{ maxHeight: '110px', objectFit: 'contain' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '10px' }}>{car.name}</h3>
              <span className="badge" style={{ marginTop: '6px' }}>{car.category}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Rate per day:</span>
                <span style={{ color: '#fff' }}>{formatINR(car.pricePerDay)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Total Days:</span>
                <span style={{ color: '#fff' }}>{days}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Security Deposit:</span>
                <span style={{ color: '#25D366' }}>Pay at Pickup</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span>Estimated Total:</span>
                <span style={{ color: 'var(--primary)' }}>{formatINR(total)}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#aaa', lineHeight: '1.5' }}>
              <p>🛡️ <strong>No instant online charges:</strong> We confirm vehicle availability with you on WhatsApp first before payment.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
