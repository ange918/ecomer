import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>BIGSIXTEEN</h3>
            <p>Votre destination pour des vêtements de qualité et style urbain.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><i className='bx bxl-instagram'></i></a>
              <a href="#" aria-label="Facebook"><i className='bx bxl-facebook'></i></a>
              <a href="#" aria-label="Twitter"><i className='bx bxl-twitter'></i></a>
              <a href="#" aria-label="YouTube"><i className='bx bxl-youtube'></i></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>NAVIGATION</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/shop">Boutique</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CATÉGORIES</h4>
            <ul>
              <li><Link to="/shop?category=tee-shirt">T-shirts</Link></li>
              <li><Link to="/shop?category=chemise">Chemises</Link></li>
              <li><Link to="/shop?category=pantalon">Pantalons</Link></li>
              <li><Link to="/shop?category=casquette">Casquettes</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>INFORMATIONS</h4>
            <ul>
              <li><a href="#">Livraison</a></li>
              <li><a href="#">Retours</a></li>
              <li><a href="#">Conditions</a></li>
              <li><a href="#">Confidentialité</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 BIGSIXTEEN. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
