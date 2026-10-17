'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car, Plus, Minus, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [openSection, setOpenSection] = useState(null);
  const [whatsapp, setWhatsapp] = useState('7082628413');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(console.error);
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer" suppressHydrationWarning>
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div className="footer-about">
            <Link href="/" className="footer-logo">
              <div className="logo-icon">
                <Car size={20} />
              </div>
              <span>Drive<span className="logo-accent">Mate</span></span>
            </Link>
            <p className="footer-desc">
              Simplifying car rentals across India. Premium vehicles for every journey, backed by 24/7 support and a commitment to excellence.
            </p>
            <div className="social-links">
              {/* WhatsApp */}
              <button 
                className="social-btn"
                onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              {/* Instagram SVG */}
              <button className="social-btn" onClick={() => window.open("https://www.instagram.com/", "_blank")} aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </button>
              {/* X / Twitter SVG */}
              <button className="social-btn" onClick={() => window.open("https://twitter.com/", "_blank")} aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`footer-links ${openSection === 'quick' ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('quick')}>
              Quick Links 
              <span className="accordion-icon-wrap">
                <Plus size={14} className="icon-plus" />
                <Minus size={14} className="icon-minus" />
              </span>
            </h4>
            <div className="footer-section-content">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/cars">Browse Collection</Link></li>
                <li><Link href="/#about">How it Works</Link></li>
                <li><Link href="/#contact">Customer Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Our Services */}
          <div className={`footer-links ${openSection === 'services' ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('services')}>
              Our Services
              <span className="accordion-icon-wrap">
                <Plus size={14} className="icon-plus" />
                <Minus size={14} className="icon-minus" />
              </span>
            </h4>
            <div className="footer-section-content">
              <ul>
                <li><Link href="/cars">Self Drive</Link></li>
                <li><Link href="/cars">Luxury Selection</Link></li>
                <li><Link href="/cars">Long Term Rental</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Us */}
          <div className={`footer-contact ${openSection === 'contact' ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('contact')}>
              Contact Us
              <span className="accordion-icon-wrap">
                <Plus size={14} className="icon-plus" />
                <Minus size={14} className="icon-minus" />
              </span>
            </h4>
            <div className="footer-section-content">
              <p><MapPin size={16} /> MG Road, Sector 29, Gurgaon, Haryana 122002</p>
              <p><Phone size={16} /> +91 9999999999</p>
              <p><Mail size={16} /> support@drivemate.in</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} DriveMate Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
