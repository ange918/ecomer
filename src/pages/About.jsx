function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>À PROPOS</h1>
          <p>L'histoire de BIGSIXTEEN</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>NOTRE HISTOIRE</h2>
              <p>
                BIGSIXTEEN est née en 2020 de la passion pour le streetwear et la mode urbaine.
                Notre mission est de proposer des vêtements de qualité qui allient style, confort et durabilité.
              </p>
              <p>
                Nous sélectionnons avec soin chaque pièce de notre collection pour vous offrir
                des produits qui reflètent votre personnalité et votre style de vie.
              </p>
              <p>
                Aujourd'hui, BIGSIXTEEN est devenue une référence dans le monde du streetwear,
                avec des milliers de clients satisfaits à travers le monde.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Notre boutique" />
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2 className="section-title">NOS VALEURS</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className='bx bx-check-shield'></i>
              <h3>QUALITÉ</h3>
              <p>Des matériaux premium et une fabrication soignée pour des produits durables.</p>
            </div>
            <div className="value-card">
              <i className='bx bx-leaf'></i>
              <h3>DURABILITÉ</h3>
              <p>Engagement pour une mode responsable et respectueuse de l'environnement.</p>
            </div>
            <div className="value-card">
              <i className='bx bx-heart'></i>
              <h3>PASSION</h3>
              <p>Une équipe passionnée dédiée à vous offrir le meilleur du streetwear.</p>
            </div>
            <div className="value-card">
              <i className='bx bx-trending-up'></i>
              <h3>INNOVATION</h3>
              <p>Toujours à la pointe des tendances et de la mode urbaine.</p>
            </div>
          </div>
        </section>

        <section className="gallery-section">
          <h2 className="section-title">GALERIE</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" alt="Collection 1" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" alt="Collection 2" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" alt="Collection 3" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400" alt="Collection 4" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea1c8f76?w=400" alt="Collection 5" />
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400" alt="Collection 6" />
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2 className="section-title">NOTRE ÉQUIPE</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-icon">
                <i className='bx bx-user-circle'></i>
              </div>
              <h3>Alex Martin</h3>
              <p>Fondateur & CEO</p>
            </div>
            <div className="team-member">
              <div className="member-icon">
                <i className='bx bx-user-circle'></i>
              </div>
              <h3>Sophie Durand</h3>
              <p>Directrice Créative</p>
            </div>
            <div className="team-member">
              <div className="member-icon">
                <i className='bx bx-user-circle'></i>
              </div>
              <h3>Marc Dubois</h3>
              <p>Chef de Collection</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
