import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSettings } from "../firebase/firestore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const fetchSettings = async () => {
      const cached = localStorage.getItem("portfolio_settings_cache");
      if (cached) {
        setSettings(JSON.parse(cached).data);
      }
      const data = await getSettings();
      setSettings(data);
    };

    window.addEventListener("scroll", handleScroll);
    fetchSettings();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Works", path: "/works" },
    { name: "Contact", path: "/contact" },
  ];

  const brandName = settings?.profile?.name || "Portfolio";

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          {brandName}
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ul className="nav-desktop" style={{ 
            display: 'flex', 
            gap: '2.5rem', 
            listStyle: 'none',
          }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path}
                  style={{ 
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)',
                    opacity: location.pathname === link.path ? 1 : 0.7,
                    transition: 'var(--transition)',
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = 1}
                  onMouseLeave={(e) => e.target.style.opacity = location.pathname === link.path ? 1 : 0.7}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-toggle"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--text-main)",
              display: 'none' // Hidden by default, shown via CSS if needed (or keep it simple)
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className="glass"
        style={{
          position: 'fixed',
          top: scrolled ? '70px' : '90px',
          left: 0,
          right: 0,
          padding: '2rem',
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '1.5rem',
          borderBottom: '1px solid var(--border)',
          zIndex: 999,
          animation: 'fadeInUp 0.4s ease'
        }}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name}
            to={link.path} 
            onClick={() => setIsOpen(false)}
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800',
              color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-main)',
              textDecoration: 'none'
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
