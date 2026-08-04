import { Link } from 'react-router-dom';

// Support & urgence : contacts directs et FAQ courte.
const FAQ = [
  {
    q: 'Comment fonctionne l\'échange de bouteille ?',
    a: 'Le livreur reprend votre bouteille vide et vous remet une bouteille pleine de même marque et gabarit. Vous ne payez que la recharge.',
  },
  {
    q: 'Quels moyens de paiement sont acceptés ?',
    a: 'Espèces à la livraison ou Mobile Money (MTN MoMo, Moov Money, Wave).',
  },
  {
    q: 'Combien de temps pour être livré ?',
    a: 'La commande est envoyée au dépôt partenaire le plus proche disponible. Vous suivez le livreur en temps réel jusqu\'à son arrivée.',
  },
];

function Support() {
  return (
    <div className="page support">
      <h1 className="page-title">Aide & support</h1>

      <div className="support-actions">
        <a href="tel:+2250700000000" className="support-btn">
          <i className="bx bx-phone-call"></i>
          <span>
            <strong>Appeler le support</strong>
            <em>Assistance immédiate</em>
          </span>
        </a>
        <a
          href="https://wa.me/2250700000000"
          target="_blank"
          rel="noreferrer"
          className="support-btn"
        >
          <i className="bx bxl-whatsapp"></i>
          <span>
            <strong>WhatsApp</strong>
            <em>Écrire à un conseiller</em>
          </span>
        </a>
      </div>

      <section className="card">
        <h2>Questions fréquentes</h2>
        <div className="faq">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Link to="/" className="btn btn-ghost btn-block">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default Support;
