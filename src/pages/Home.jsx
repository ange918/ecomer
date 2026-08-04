import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getPhotos } from '../utils/photos';
import PhotoCard from '../components/PhotoCard';

function Home() {
  const [photos] = useState(() => getPhotos());

  const stats = useMemo(() => ({
    photos: photos.length,
    categories: new Set(photos.map(p => p.category)).size
  }), [photos]);

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
      const targets = [stats.photos, stats.categories];
      if (targets[index] !== undefined) {
        animateCounter(counter, targets[index]);
      }
    });
  }, [stats]);

  const recentPhotos = photos.slice(0, 6);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">STYLE URBAIN</h1>
          <p className="hero-subtitle">Collection 2025</p>
          <Link to="/gallery" className="btn btn-primary">DÉCOUVRIR</Link>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <i className='bx bx-image'></i>
              <span className="stat-number">0</span>
              <p>PHOTOS</p>
            </div>
            <div className="stat-item">
              <i className='bx bx-grid-alt'></i>
              <span className="stat-number">0</span>
              <p>CATÉGORIES</p>
            </div>
            <div className="stat-item">
              <i className='bx bx-user'></i>
              <span className="stat-number">16</span>
              <p>BIG SIXTEEN</p>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2 className="section-title">CATÉGORIES</h2>
          <div className="categories-grid">
            <Link to="/gallery?category=streetwear" className="category-card">
              <div className="category-icon">
                <i className='bx bx-shopping-bag'></i>
              </div>
              <h3>STREETWEAR</h3>
            </Link>
            <Link to="/gallery?category=casual" className="category-card">
              <div className="category-icon">
                <i className='bx bx-coffee'></i>
              </div>
              <h3>CASUAL</h3>
            </Link>
            <Link to="/gallery?category=elegant" className="category-card">
              <div className="category-icon">
                <i className='bx bx-briefcase'></i>
              </div>
              <h3>ÉLÉGANT</h3>
            </Link>
            <Link to="/gallery?category=sport" className="category-card">
              <div className="category-icon">
                <i className='bx bx-run'></i>
              </div>
              <h3>SPORT</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2 className="section-title">PHOTOS RÉCENTES</h2>
          <div className="photos-grid-home">
            {recentPhotos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/gallery" className="btn btn-secondary">VOIR TOUT</Link>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>SUIVEZ-NOUS</h2>
            <p>Restez connecté pour voir nos derniers styles</p>
            <div className="social-links">
              <a href="#" className="social-icon"><i className='bx bxl-instagram'></i></a>
              <a href="#" className="social-icon"><i className='bx bxl-facebook'></i></a>
              <a href="#" className="social-icon"><i className='bx bxl-twitter'></i></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
