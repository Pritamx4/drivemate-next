'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState('7082628413');
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp) setWhatsapp(data.whatsapp);
      })
      .catch(console.error);
  }, []);

  // Update hash and scroll position listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // On home page, detect current section dynamically while scrolling
      if (pathname === '/') {
        const aboutEl = document.getElementById('about');
        const contactEl = document.getElementById('contact');
        const scrollPos = window.scrollY + 280;

        if (contactEl && scrollPos >= contactEl.offsetTop) {
          setCurrentHash('#contact');
        } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
          setCurrentHash('#about');
        } else {
          setCurrentHash('');
        }
      }
    };

    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        setCurrentHash(window.location.hash);
      }
    };

    handleHashChange();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    if (pathname !== '/') {
      setCurrentHash('');
    }
  }, [pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Browse Cars', path: '/cars' },
    { label: 'About', path: '/#about' },
    { label: 'Contact', path: '/#contact' },
  ];

  const isActive = (linkPath) => {
    if (linkPath === '/') {
      return pathname === '/' && (!currentHash || currentHash === '#');
    }
    if (linkPath.startsWith('/#')) {
      const targetHash = linkPath.substring(1); // e.g. '#about'
      return pathname === '/' && currentHash === targetHash;
    }
    if (linkPath === '/cars') {
      return pathname.startsWith('/cars') || pathname.startsWith('/booking');
    }
    return pathname === linkPath;
  };

  const handleLinkClick = (path) => {
    setMenuOpen(false);
    if (path.includes('#')) {
      const hash = path.substring(path.indexOf('#'));
      setCurrentHash(hash);
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path === '/') {
      setCurrentHash('');
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentHash('');
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link href="/" className="navbar-logo" onClick={() => handleLinkClick('/')}>
          <div className="logo-icon">
            <Car size={22} />
          </div>
          <span>Drive<span className="logo-accent">Mate</span></span>
        </Link>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={isActive(link.path) ? 'active' : ''}
                onClick={() => handleLinkClick(link.path)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button 
            onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
            className="whatsapp-navbar-btn"
            aria-label="WhatsApp Contact"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.181-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.171.824-.311.048-.722.088-1.144-.048-.266-.088-.597-.19-.99-.36a5.19 5.19 0 0 1-2.158-1.898c-.132-.177-.231-.364-.302-.553l-.004-.012-.002-.005a3.67 3.67 0 0 1-.414-1.838c0-.735.381-1.127.518-1.265.137-.137.301-.171.397-.171.096 0 .192.001.274.004l.053.003c.121.002.239.006.345.244.11.25.378.918.41 1.014.033.096.054.208-.01.336-.063.129-.127.21-.252.34-.125.131-.262.293-.374.393-.124.111-.253.232-.109.48.144.248.641 1.054 1.375 1.706.947.841 1.74 1.103 1.992 1.244.248.144.393.124.539-.039l.21-.248c.15-.178.204-.254.388-.178.188.076.719.339.842.401.122.062.203.093.235.144.031.051.031.297-.113.702zM12.029.012C5.41.012.053 5.361.053 11.977c0 2.256.623 4.458 1.834 6.37L.053 24l5.823-1.517a11.93 1.93 0 0 0 6.152 1.68c6.615 0 11.968-5.359 11.968-11.977C23.996 5.359 18.64.012 12.029.012zm.011 21.691h-.005a9.42 9.42 0 0 1-4.795-1.312l-.344-.203-3.567.93.946-3.454-.223-.355a9.441 9.441 0 0 1-1.444-5.011c.002-5.198 4.238-9.422 9.435-9.422 2.515 0 4.881.98 6.66 2.759a9.38 9.38 0 0 1 2.76 6.671c-.002 5.2-4.234 9.422-9.427 9.422z"/>
            </svg>
          </button>
          <button 
            className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
