import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../utils/products';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ products: 0, categories: 0, customers: 0 });

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    
    const categories = new Set(allProducts.map(p => p.category)).size;
    setStats({
      products: allProducts.length,
      categories: categories,
      customers: 1250
    });
  }, []);

  useEffect(() => {
    const animateCounter = (element, target, duration = 2000) => {
      let current = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    };

    const counters = document.querySelectorAll('.stat-number');
    counters.forEach((counter, index) => {
      const targets = [stats.products, stats.categories, stats.customers];
      if (targets[index]) {
        animateCounter(counter, targets[index]);
      }
    });
  }, [stats]);

  const newProducts = products.slice(0, 4);
  const bestsellers = products.slice(4, 8);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">STYLE URBAIN</h1>
          <p className="hero-subtitle">Collection 2025</p>
          <Link to="/shop" className="btn btn-primary">DÉCOUVRIR</Link>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <i className='bx bx-package'></i>
              <span className="stat-number">0</span>
              <p>PRODUITS</p>
            </div>
            <div className="stat-item">
              <i className='bx bx-grid-alt'></i>
              <span className="stat-number">0</span>
              <p>CATÉGORIES</p>
            </div>
            <div className="stat-item">
              <i className='bx bx-user'></i>
              <span className="stat-number">0</span>
              <p>CLIENTS</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2 className="section-title">CATÉGORIES</h2>
          <div className="categories-grid">
            <Link to="/shop?category=tee-shirt" className="category-card">
              <div className="category-icon">
                <i className='bx bx-shopping-bag'></i>
              </div>
              <h3>T-SHIRTS</h3>
            </Link>
            <Link to="/shop?category=chemise" className="category-card">
              <div className="category-icon">
                <i className='bx bx-briefcase'></i>
              </div>
              <h3>CHEMISES</h3>
            </Link>
            <Link to="/shop?category=pantalon" className="category-card">
              <div className="category-icon">
                <i className='bx bx-closet'></i>
              </div>
              <h3>PANTALONS</h3>
            </Link>
            <Link to="/shop?category=casquette" className="category-card">
              <div className="category-icon">
                <i className='bx bx-happy-beaming'></i>
              </div>
              <h3>CASQUETTES</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2 className="section-title">NOUVEAUTÉS</h2>
          <div className="products-grid">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="products-section bg-light">
        <div className="container">
          <h2 className="section-title">BESTSELLERS</h2>
          <div className="products-grid">
            {bestsellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-secondary">VOIR TOUT</Link>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>NEWSLETTER</h2>
            <p>Inscrivez-vous pour recevoir nos offres exclusives</p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault();
              alert('Merci pour votre inscription !');
            }}>
              <input type="email" placeholder="Votre email" required />
              <button type="submit" className="btn btn-primary">S'INSCRIRE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
