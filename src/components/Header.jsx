import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>BIGSIXTEEN</h1>
          </Link>

          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
          </button>

          <nav className={`nav ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>ACCUEIL</Link>
            <Link to="/gallery" onClick={() => setMenuOpen(false)}>GALERIE</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>À PROPOS</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link>
            <Link to="/admin/login" onClick={() => setMenuOpen(false)}>ADMIN</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
