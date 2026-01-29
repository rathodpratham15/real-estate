import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold transition-colors duration-300" style={{ color: '#1a1a1a' }}>
          Realest
        </Link>
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              location.pathname === '/' ? 'font-bold' : ''
            }`} 
            style={{ color: '#1a1a1a' }}
          >
            Home
          </Link>
          <Link 
            to="/listings" 
            className={`nav-link text-sm font-medium transition-all duration-300 hover:opacity-70 ${
              location.pathname === '/listings' ? 'font-bold' : ''
            }`} 
            style={{ color: '#1a1a1a' }}
          >
            Listings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;