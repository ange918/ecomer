import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>CONTACT</h1>
          <p>Nous sommes à votre écoute</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>INFORMATIONS</h2>
            
            <div className="info-item">
              <i className='bx bx-map'></i>
              <div>
                <h3>Adresse</h3>
                <p>16 Rue de la Mode<br />75001 Paris, France</p>
              </div>
            </div>

            <div className="info-item">
              <i className='bx bx-phone'></i>
              <div>
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="info-item">
              <i className='bx bx-envelope'></i>
              <div>
                <h3>Email</h3>
                <p>contact@bigsixteen.com</p>
              </div>
            </div>

            <div className="info-item">
              <i className='bx bx-time'></i>
              <div>
                <h3>Horaires</h3>
                <p>Lundi - Vendredi: 9h - 18h<br />Samedi: 10h - 17h</p>
              </div>
            </div>

            <div className="social-section">
              <h3>SUIVEZ-NOUS</h3>
              <div className="social-links-large">
                <a href="#" aria-label="Instagram">
                  <i className='bx bxl-instagram'></i>
                </a>
                <a href="#" aria-label="Facebook">
                  <i className='bx bxl-facebook'></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className='bx bxl-twitter'></i>
                </a>
                <a href="#" aria-label="YouTube">
                  <i className='bx bxl-youtube'></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>ENVOYEZ-NOUS UN MESSAGE</h2>
            
            {submitted && (
              <div className="alert alert-success">
                <i className='bx bx-check-circle'></i>
                Merci ! Votre message a été envoyé avec succès.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sujet</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="commande">Question sur une commande</option>
                  <option value="produit">Question sur un produit</option>
                  <option value="retour">Retour / Échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <i className='bx bx-send'></i>
                ENVOYER
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
