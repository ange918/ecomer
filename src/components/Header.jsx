import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCart } from '../utils/products';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = (e) => {
      if (e.key === 'bigsixteen_cart' || e.type === 'cartUpdated') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

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
            <Link to="/shop" onClick={() => setMenuOpen(false)}>BOUTIQUE</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>À PROPOS</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link>
            <Link to="/admin/login" onClick={() => setMenuOpen(false)}>ADMIN</Link>
          </nav>

          <Link to="/cart" className="cart-icon">
            <i className='bx bx-shopping-bag'></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
