import { Link } from 'react-router-dom';

// Landing page publique — thème sombre + accent vert lime (style OpeN9).
// GazExpress : marché hyperlocal de livraison de gaz à domicile.
// Les cartes du hero et la grille « Recharges populaires » accueillent les photos
// de gaz : tant qu'aucune image n'est fournie, un emplacement (placeholder) s'affiche.

// image: null → placeholder (à remplacer par le chemin de la photo une fois fournie).
const HERO_CARDS = [
  { brand: 'Oryx', kg: '6 kg', price: '4 000 FCFA', vendor: 'Dépôt Cocody', eta: '≈ 30 min', image: null },
  { brand: 'Puma', kg: '12,5 kg', price: '7 300 FCFA', vendor: 'Gaz Express Yop', eta: '≈ 25 min', image: null },
  { brand: 'TotalEnergies', kg: '6 kg', price: '4 200 FCFA', vendor: 'Station Plateau', eta: '≈ 35 min', image: null },
];

const POPULAR = [
  { brand: 'Oryx', kg: '6 kg', price: '4 000 FCFA', type: 'Échange', image: null },
  { brand: 'Sodigaz', kg: '12,5 kg', price: '7 200 FCFA', type: 'Échange', image: null },
  { brand: 'Puma', kg: '6 kg', price: '21 500 FCFA', type: 'Neuve', image: null },
  { brand: 'TotalEnergies', kg: '12,5 kg', price: '7 800 FCFA', type: 'Échange', image: null },
];

const STEPS = [
  { icon: 'bx-mobile-alt', title: 'Je commande', text: "J'indique la marque, la contenance et mon adresse en quelques secondes." },
  { icon: 'bx-map-alt', title: 'Je vois les vendeurs proches', text: 'La plateforme affiche les boutiques disponibles autour de moi.' },
  { icon: 'bx-check-circle', title: 'Le vendeur accepte', text: 'Le vendeur confirme la disponibilité et prend en charge ma commande.' },
  { icon: 'bx-cycling', title: 'Paiement & livraison', text: 'Je paie (Mobile Money ou espèces) et je suis la livraison jusqu’à ma porte.' },
];

const FEATURES = [
  { icon: 'bx-time-five', title: 'Rapide', text: 'Fini les allers-retours : votre gaz arrive à vous.' },
  { icon: 'bx-map', title: 'Proximité', text: 'Des vendeurs proches, donc une livraison plus courte.' },
  { icon: 'bx-wallet', title: 'Paiement flexible', text: 'Mobile Money (MoMo, Moov, Wave) ou espèces à la livraison.' },
  { icon: 'bx-navigation', title: 'Suivi en temps réel', text: 'Suivez votre livreur sur la carte jusqu’à son arrivée.' },
  { icon: 'bx-shield-quarter', title: 'Sécurité', text: 'Vendeurs vérifiés et manipulation conforme aux règles.' },
  { icon: 'bx-refresh', title: 'Échange simplifié', text: 'Bouteille vide reprise contre une pleine, sans effort.' },
];

const BRANDS = [
  { name: 'Oryx', color: '#0B5FFF' },
  { name: 'Puma', color: '#E4002B' },
  { name: 'TotalEnergies', color: '#ED0000' },
  { name: 'Sodigaz', color: '#009640' },
];

const ACCESSORIES = ['Détendeurs', 'Tuyaux', 'Réchauds', 'Brûleurs', 'Raccords'];

const TESTIMONIALS = [
  { name: 'Aïcha K.', role: 'Cliente, Cocody', text: 'Panne de gaz un dimanche soir : commande passée, livrée en 30 min. Un vrai soulagement !' },
  { name: 'Moussa D.', role: 'Vendeur partenaire', text: 'GazExpress m’amène des clients que je n’aurais jamais touchés. Mes ventes ont augmenté.' },
  { name: 'Fatou S.', role: 'Cliente, Yopougon', text: 'Plus besoin de porter la bouteille sous la pluie. Je recommande en deux clics.' },
];

const FAQ = [
  { q: 'Comment fonctionne la livraison ?', a: 'Vous commandez depuis l’application, un vendeur proche accepte votre commande et vous livre à domicile. Vous suivez la livraison en temps réel.' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Le paiement Mobile Money (MTN MoMo, Moov Money, Wave) ou en espèces à la livraison.' },
  { q: 'Puis-je échanger ma bouteille vide ?', a: 'Oui. Le vendeur reprend votre bouteille vide et vous remet une bouteille pleine de même marque : vous ne payez que la recharge.' },
  { q: 'Je tiens une boutique de gaz, comment vendre sur GazExpress ?', a: 'Cliquez sur « Devenir vendeur » : vous recevez les commandes des clients proches et développez vos ventes.' },
];

// Visuel de remplacement quand aucune photo n'est encore fournie.
function BottlePlaceholder() {
  return (
    <div className="ph-media" aria-hidden="true">
      <svg viewBox="0 0 80 120" className="ph-bottle">
        <rect x="33" y="0" width="14" height="16" rx="4" fill="#c6f135" />
        <rect x="14" y="14" width="52" height="104" rx="22" fill="#26262b" stroke="#3a3a42" />
        <rect x="14" y="46" width="52" height="20" fill="#c6f135" opacity="0.85" />
        <text x="40" y="61" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0a0a0b">GAZ</text>
      </svg>
      <span className="ph-label"><i className="bx bx-image-add"></i> Photo à venir</span>
    </div>
  );
}

function HeroCard({ card, center }) {
  return (
    <article className={`hero-card ${center ? 'is-center' : ''}`}>
      <div className="hero-card-media">
        {card.image ? <img src={card.image} alt={`${card.brand} ${card.kg}`} /> : <BottlePlaceholder />}
        <span className="hero-card-eta"><i className="bx bx-time-five"></i> {card.eta}</span>
        <button type="button" className="hero-card-heart" aria-label="Favori"><i className="bx bx-heart"></i></button>
        {center && <span className="hero-card-cta">Commander</span>}
        <div className="hero-card-info">
          <span className="hero-card-vendor"><i className="bx bxs-store"></i> {card.vendor}</span>
          <div className="hero-card-meta">
            <strong>{card.brand} · {card.kg}</strong>
            <span className="hero-card-price">{card.price}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProductCard({ item }) {
  return (
    <article className="product-card">
      <div className="product-media">
        {item.image ? <img src={item.image} alt={`${item.brand} ${item.kg}`} /> : <BottlePlaceholder />}
        <span className="product-tag">{item.type}</span>
      </div>
      <div className="product-body">
        <strong>{item.brand} · {item.kg}</strong>
        <div className="product-foot">
          <span className="product-price">{item.price}</span>
          <Link to="/login" className="product-buy"><i className="bx bx-plus"></i></Link>
        </div>
      </div>
    </article>
  );
}

function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <a href="#top" className="lp-brand">
            <span className="lp-logo"><i className="bx bxs-flame"></i></span>
            GazExpress
          </a>
          <nav className="lp-nav-links">
            <a href="#top">Accueil</a>
            <a href="#how">Comment ça marche</a>
            <a href="#vendors">Vendeurs</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn lp-btn-ghost">Se connecter</Link>
            <Link to="/login" className="lp-btn lp-btn-primary">
              S'inscrire <i className="bx bx-wallet"></i>
            </Link>
            <button type="button" className="lp-burger" aria-label="Menu"><i className="bx bx-menu"></i></button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero" id="top">
        <div className="lp-grid-bg" aria-hidden="true"></div>
        <span className="lp-spark lp-spark-1" aria-hidden="true">✦</span>
        <span className="lp-spark lp-spark-2" aria-hidden="true">◆</span>
        <span className="lp-spark lp-spark-3" aria-hidden="true">✦</span>

        <div className="lp-container lp-hero-inner">
          <span className="lp-badge"><i className="bx bx-bolt-circle"></i> Livraison de gaz à la demande</span>
          <h1>Votre gaz livré<br /><span className="lp-accent">à domicile</span></h1>
          <p className="lp-hero-sub">
            UNE PANNE DE GAZ AU MAUVAIS MOMENT ? UN VENDEUR PROCHE DE CHEZ VOUS
            VOUS LIVRE EN QUELQUES CLICS — SANS DÉPLACEMENT.
          </p>
          <div className="lp-hero-cta">
            <Link to="/login" className="lp-btn lp-btn-primary lp-btn-lg">Commander <i className="bx bx-up-arrow-alt lp-rot"></i></Link>
            <a href="#vendors" className="lp-btn lp-btn-outline lp-btn-lg">Devenir vendeur <i className="bx bx-up-arrow-alt lp-rot"></i></a>
          </div>
        </div>

        {/* Carrousel de cartes */}
        <div className="lp-container">
          <div className="hero-carousel">
            <button type="button" className="hero-arrow" aria-label="Précédent"><i className="bx bx-chevron-left"></i></button>
            <div className="hero-cards">
              {HERO_CARDS.map((card, i) => (
                <HeroCard key={card.brand + i} card={card} center={i === 1} />
              ))}
            </div>
            <button type="button" className="hero-arrow" aria-label="Suivant"><i className="bx bx-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* Recharges populaires */}
      <section className="lp-section" id="popular">
        <div className="lp-container">
          <div className="lp-section-head lp-head-row">
            <div>
              <span className="lp-eyebrow">Sélection</span>
              <h2>Recharges populaires</h2>
            </div>
            <Link to="/login" className="lp-link-more">Tout voir <i className="bx bx-right-arrow-alt"></i></Link>
          </div>
          <div className="product-grid">
            {POPULAR.map((item, i) => (
              <ProductCard key={item.brand + i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Problème → Solution */}
      <section className="lp-section">
        <div className="lp-container lp-two-col">
          <div className="lp-card lp-problem-card">
            <span className="lp-eyebrow lp-eyebrow-warn">Le problème</span>
            <h2>La rupture de gaz, une galère du quotidien</h2>
            <ul className="lp-list">
              <li><i className="bx bx-x-circle"></i> Se déplacer jusqu'au point de vente le plus proche</li>
              <li><i className="bx bx-x-circle"></i> Porter une bouteille lourde, parfois sous la pluie</li>
              <li><i className="bx bx-x-circle"></i> Tomber sur un dépôt fermé ou en rupture</li>
            </ul>
          </div>
          <div className="lp-card lp-solution-card">
            <span className="lp-eyebrow lp-eyebrow-ok">La solution</span>
            <h2>GazExpress vous connecte au vendeur le plus proche</h2>
            <ul className="lp-list">
              <li><i className="bx bx-check-circle"></i> Commandez depuis votre téléphone</li>
              <li><i className="bx bx-check-circle"></i> Un vendeur proche accepte et vous livre</li>
              <li><i className="bx bx-check-circle"></i> Vous suivez la livraison en temps réel</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="lp-section" id="how">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Simple et rapide</span>
            <h2>Comment ça marche</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((step, i) => (
              <div className="lp-step" key={step.title}>
                <div className="lp-step-num">{i + 1}</div>
                <i className={`bx ${step.icon}`}></i>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="lp-section lp-alt">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Pourquoi GazExpress</span>
            <h2>Pensé pour votre confort</h2>
          </div>
          <div className="lp-features">
            {FEATURES.map((f) => (
              <div className="lp-feature" key={f.title}>
                <div className="lp-feature-icon"><i className={`bx ${f.icon}`}></i></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marques & accessoires */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Toutes vos recharges</span>
            <h2>Marques &amp; accessoires disponibles</h2>
          </div>
          <div className="lp-brands">
            {BRANDS.map((b) => (
              <span className="lp-brand-chip" key={b.name}>
                <span className="lp-brand-dot" style={{ background: b.color }}></span>
                {b.name}
              </span>
            ))}
          </div>
          <div className="lp-accessories">
            {ACCESSORIES.map((a) => (
              <span className="lp-acc-chip" key={a}><i className="bx bx-wrench"></i> {a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pour les vendeurs */}
      <section className="lp-section lp-vendors" id="vendors">
        <div className="lp-container lp-two-col lp-vendors-inner">
          <div>
            <span className="lp-eyebrow lp-eyebrow-lime">Vous avez une boutique de gaz ?</span>
            <h2>Devenez vendeur et développez vos ventes</h2>
            <p className="lp-vendors-text">
              Vous vendez du gaz ou des accessoires ? Rejoignez GazExpress, recevez les
              commandes des clients proches de vous et augmentez votre chiffre d'affaires,
              sans changer votre façon de travailler.
            </p>
            <ul className="lp-list lp-list-lime">
              <li><i className="bx bx-check-circle"></i> Touchez plus de clients dans votre zone</li>
              <li><i className="bx bx-check-circle"></i> Gérez vos commandes et votre stock facilement</li>
              <li><i className="bx bx-check-circle"></i> Paiements suivis, livraisons organisées</li>
            </ul>
            <Link to="/login" className="lp-btn lp-btn-primary lp-btn-lg">
              <i className="bx bxs-store"></i> Devenir vendeur
            </Link>
          </div>
          <div className="lp-vendors-visual" aria-hidden="true">
            <VendorIllustration />
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="lp-section lp-alt">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Ils nous font confiance</span>
            <h2>Des clients et vendeurs satisfaits</h2>
          </div>
          <div className="lp-testimonials">
            {TESTIMONIALS.map((t) => (
              <figure className="lp-testimonial" key={t.name}>
                <div className="lp-stars">
                  {[1, 2, 3, 4, 5].map((n) => <i className="bx bxs-star" key={n}></i>)}
                </div>
                <blockquote>{t.text}</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" id="faq">
        <div className="lp-container lp-faq-container">
          <div className="lp-section-head">
            <span className="lp-eyebrow">Questions fréquentes</span>
            <h2>Tout ce qu'il faut savoir</h2>
          </div>
          <div className="lp-faq">
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}<i className="bx bx-chevron-down"></i></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="lp-final-cta">
        <div className="lp-container lp-final-inner">
          <h2>Ne manquez plus jamais de gaz</h2>
          <p>Rejoignez GazExpress et faites-vous livrer par un vendeur proche de chez vous.</p>
          <div className="lp-hero-cta">
            <Link to="/login" className="lp-btn lp-btn-primary lp-btn-lg">S'inscrire / Se connecter</Link>
            <a href="#vendors" className="lp-btn lp-btn-outline lp-btn-lg">Devenir vendeur</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <a href="#top" className="lp-brand">
              <span className="lp-logo"><i className="bx bxs-flame"></i></span>
              GazExpress
            </a>
            <p>Le gaz domestique livré à domicile, par des vendeurs proches de vous.</p>
            <div className="lp-socials">
              <a href="#top" aria-label="Facebook"><i className="bx bxl-facebook"></i></a>
              <a href="#top" aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
              <a href="#top" aria-label="WhatsApp"><i className="bx bxl-whatsapp"></i></a>
            </div>
          </div>
          <div className="lp-footer-cols">
            <div>
              <h4>Produit</h4>
              <a href="#how">Comment ça marche</a>
              <a href="#faq">FAQ</a>
              <Link to="/login">Se connecter</Link>
            </div>
            <div>
              <h4>Vendeurs</h4>
              <a href="#vendors">Devenir vendeur</a>
              <Link to="/login">Espace vendeur</Link>
            </div>
            <div>
              <h4>Support</h4>
              <a href="tel:+2250700000000">Nous appeler</a>
              <a href="https://wa.me/2250700000000" target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="lp-container lp-footer-bottom">
          <span>© {new Date().getFullYear()} GazExpress. Tous droits réservés.</span>
          <span>Fait avec ❤ pour votre quotidien</span>
        </div>
      </footer>
    </div>
  );
}

function VendorIllustration() {
  return (
    <svg viewBox="0 0 320 240" className="lp-illus" role="img" aria-label="Boutique de gaz">
      <rect x="40" y="70" width="240" height="140" rx="14" fill="#ffffff" opacity="0.05" />
      <rect x="40" y="70" width="240" height="34" rx="14" fill="#c6f135" />
      <text x="160" y="93" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0a0a0b">BOUTIQUE GAZ</text>
      {[70, 130, 190].map((x) => (
        <g key={x} transform={`translate(${x} 130)`}>
          <rect x="0" y="10" width="34" height="60" rx="14" fill="#26262b" stroke="#3a3a42" />
          <rect x="10" y="30" width="14" height="10" fill="#c6f135" opacity="0.8" />
          <rect x="12" y="0" width="10" height="12" rx="3" fill="#c6f135" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

export default Landing;
