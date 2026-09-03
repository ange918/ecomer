import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import oryx from '../assets/products/oryx.png';
import progaz from '../assets/products/progaz.png';
import progazHaut from '../assets/products/progaz-haut.png';
import beninPetro from '../assets/products/benin-petro.png';
import raccord from '../assets/products/raccord.png';
import rechaud from '../assets/products/rechaud.png';
import supportBruleur from '../assets/products/support-bruleur.png';

gsap.registerPlugin(ScrollTrigger);

// Landing page publique — thème sombre + accent vert lime (style OpeN9).
// GazExpress : marché hyperlocal de livraison de gaz à domicile.

const HERO_CARDS = [
  { brand: 'Oryx', kg: '6 kg', price: '4 000 FCFA', eta: '≈ 30 min', image: oryx },
  { brand: 'Progaz', kg: '6 kg', price: '3 900 FCFA', eta: '≈ 25 min', image: progaz },
  { brand: 'Benin Petro', kg: '12,5 kg', price: '7 200 FCFA', eta: '≈ 35 min', image: beninPetro },
];

const POPULAR = [
  { brand: 'Oryx', kg: '6 kg', price: '4 000 FCFA', type: 'Échange', image: oryx },
  { brand: 'Progaz', kg: '12,5 kg', price: '7 300 FCFA', type: 'Échange', image: progazHaut },
  { brand: 'Benin Petro', kg: '6 kg', price: '3 800 FCFA', type: 'Échange', image: beninPetro },
  { brand: 'Progaz', kg: '6 kg', price: '21 000 FCFA', type: 'Neuve', image: progaz },
];

const ACCESSORIES = [
  { name: 'Raccord en T', desc: 'Laiton, robuste', image: raccord },
  { name: 'Pare-vent réchaud', desc: 'Inox, économie de gaz', image: rechaud },
  { name: 'Support brûleur', desc: 'Inox, stable', image: supportBruleur },
];

const BRANDS = [
  { name: 'Oryx', color: '#E4002B' },
  { name: 'Progaz', color: '#7B2A9E' },
  { name: 'Benin Petro', color: '#2F9E44' },
];

const STEPS = [
  { icon: 'bx-mobile-alt', title: 'Je commande', text: "J'indique la marque, la contenance et mon adresse en quelques secondes." },
  { icon: 'bx-box', title: 'On prépare', text: 'Votre recharge est préparée à la marque et à la contenance demandées.' },
  { icon: 'bx-cycling', title: 'On vous livre', text: 'Un livreur vous apporte la bouteille directement à votre porte.' },
  { icon: 'bx-wallet', title: 'Paiement & suivi', text: 'Je paie (Mobile Money ou espèces) et je suis la livraison en temps réel.' },
];

const FEATURES = [
  { icon: 'bx-time-five', title: 'Rapide', text: 'Fini les allers-retours : votre gaz arrive à vous.' },
  { icon: 'bx-map', title: 'À domicile', text: 'Livraison dans votre quartier, sans vous déplacer.' },
  { icon: 'bx-wallet', title: 'Paiement flexible', text: 'Mobile Money (MoMo, Moov, Wave) ou espèces à la livraison.' },
  { icon: 'bx-navigation', title: 'Suivi en temps réel', text: 'Suivez l’avancement de votre commande jusqu’à son arrivée.' },
  { icon: 'bx-shield-quarter', title: 'Sécurité', text: 'Bouteilles conformes et manipulation dans les règles.' },
  { icon: 'bx-refresh', title: 'Échange simplifié', text: 'Bouteille vide reprise contre une pleine, sans effort.' },
];

const FAQ = [
  { q: 'Comment fonctionne la livraison ?', a: 'Vous commandez depuis l’application, nous préparons votre bouteille et un livreur vous l’apporte à domicile. Vous suivez la livraison en temps réel.' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Le paiement Mobile Money (MTN MoMo, Moov Money, Wave) ou en espèces à la livraison.' },
  { q: 'Puis-je échanger ma bouteille vide ?', a: 'Oui. Le livreur reprend votre bouteille vide et vous remet une bouteille pleine de même marque : vous ne payez que la recharge.' },
  { q: 'Dans quelles zones livrez-vous ?', a: 'La livraison couvre les principaux quartiers de la ville. Indiquez votre adresse à la commande pour vérifier la disponibilité.' },
];

function HeroCard({ card, center }) {
  return (
    <article className={`hero-card ${center ? 'is-center' : ''}`}>
      <div className="hero-card-media">
        <img src={card.image} alt={`${card.brand} ${card.kg}`} />
        <span className="hero-card-eta"><i className="bx bx-time-five"></i> {card.eta}</span>
        <button type="button" className="hero-card-heart" aria-label="Favori"><i className="bx bx-heart"></i></button>
        {center && <span className="hero-card-cta">Commander</span>}
        <div className="hero-card-info">
          <span className="hero-card-vendor"><i className="bx bx-purchase-tag-alt"></i> Livré chez vous</span>
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
        <img src={item.image} alt={`${item.brand} ${item.kg}`} />
        <span className="product-tag">{item.type}</span>
      </div>
      <div className="product-body">
        <strong>{item.brand} · {item.kg}</strong>
        <div className="product-foot">
          <span className="product-price">{item.price}</span>
          <Link to="/inscription" className="product-buy" aria-label="Commander"><i className="bx bx-plus"></i></Link>
        </div>
      </div>
    </article>
  );
}

// Carrousel 3D auto-rotatif du hero : les 3 cartes tournent en perspective.
function Hero3DCarousel() {
  const n = HERO_CARDS.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 3800);
    return () => clearInterval(t);
  }, [n]);

  const posClass = (i) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    if (d === 0) return 'is-active';
    return d < 0 ? 'is-left' : 'is-right';
  };

  return (
    <div className="hero3d-wrap">
      <button type="button" className="hero-arrow" aria-label="Précédent" onClick={() => setActive((a) => (a - 1 + n) % n)}>
        <i className="bx bx-chevron-left"></i>
      </button>
      <div className="hero3d">
        {HERO_CARDS.map((card, i) => {
          const cls = posClass(i);
          return (
            <div key={card.brand + i} className={`hero3d-card ${cls}`} onClick={() => setActive(i)}>
              <HeroCard card={card} center={cls === 'is-active'} />
            </div>
          );
        })}
      </div>
      <button type="button" className="hero-arrow" aria-label="Suivant" onClick={() => setActive((a) => (a + 1) % n)}>
        <i className="bx bx-chevron-right"></i>
      </button>
      <div className="hero3d-dots">
        {HERO_CARDS.map((card, i) => (
          <button key={card.brand + i} type="button" aria-label={`Voir ${card.brand}`} className={i === active ? 'on' : ''} onClick={() => setActive(i)}></button>
        ))}
      </div>
    </div>
  );
}

function Landing() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('.lp-anim-hero > *', {
        y: 26,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from('.hero3d-wrap', {
        y: 34,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: 'power3.out',
      });
      gsap.utils.toArray('.lp-reveal').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing" ref={rootRef}>
      {/* Navigation */}
      <header className="lp-nav">
        <div className="lp-container lp-nav-inner">
          <a href="#top" className="lp-brand" onClick={() => setMenuOpen(false)}>
            <span className="lp-logo"><i className="bx bxs-flame"></i></span>
            GazExpress
          </a>
          <nav className="lp-nav-links">
            <a href="#top">Accueil</a>
            <a href="#how">Comment ça marche</a>
            <a href="#why">Pourquoi nous</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn lp-btn-ghost">Se connecter</Link>
            <Link to="/inscription" className="lp-btn lp-btn-primary">
              S'inscrire <i className="bx bx-wallet"></i>
            </Link>
            <button
              type="button"
              className="lp-burger"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <i className={`bx ${menuOpen ? 'bx-x' : 'bx-menu'}`}></i>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lp-mobile-menu">
            <a href="#top" onClick={() => setMenuOpen(false)}>Accueil</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#why" onClick={() => setMenuOpen(false)}>Pourquoi nous</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <Link to="/login" className="lp-btn lp-btn-ghost lp-btn-block" onClick={() => setMenuOpen(false)}>
              Se connecter
            </Link>
            <Link to="/inscription" className="lp-btn lp-btn-primary lp-btn-block" onClick={() => setMenuOpen(false)}>
              S'inscrire
            </Link>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="lp-hero" id="top">
        <div className="lp-grid-bg" aria-hidden="true"></div>
        <span className="lp-spark lp-spark-1" aria-hidden="true">✦</span>
        <span className="lp-spark lp-spark-2" aria-hidden="true">◆</span>
        <span className="lp-spark lp-spark-3" aria-hidden="true">✦</span>

        <div className="lp-container lp-hero-inner lp-anim-hero">
          <span className="lp-badge"><i className="bx bx-bolt-circle"></i> Livraison de gaz à la demande</span>
          <h1>Votre gaz livré<br /><span className="lp-accent">à domicile</span></h1>
          <p className="lp-hero-sub">
            UNE PANNE DE GAZ AU MAUVAIS MOMENT ? COMMANDEZ VOTRE RECHARGE
            ET FAITES-VOUS LIVRER EN QUELQUES CLICS — SANS DÉPLACEMENT.
          </p>
          <div className="lp-hero-cta">
            <Link to="/inscription" className="lp-btn lp-btn-primary lp-btn-lg">Commander <i className="bx bx-up-arrow-alt lp-rot"></i></Link>
            <Link to="/login" className="lp-btn lp-btn-outline lp-btn-lg">Se connecter <i className="bx bx-log-in lp-rot"></i></Link>
          </div>
        </div>

        {/* Carrousel 3D de cartes */}
        <div className="lp-container">
          <Hero3DCarousel />
        </div>
      </section>

      {/* Recharges populaires */}
      <section className="lp-section" id="popular">
        <div className="lp-container lp-reveal">
          <div className="lp-section-head lp-head-row">
            <div>
              <span className="lp-eyebrow">Sélection</span>
              <h2>Recharges populaires</h2>
            </div>
            <Link to="/inscription" className="lp-link-more">Tout voir <i className="bx bx-right-arrow-alt"></i></Link>
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
        <div className="lp-container lp-two-col lp-reveal">
          <div className="lp-pscard">
            <span className="lp-eyebrow lp-eyebrow-muted">Le problème</span>
            <h2>La rupture de gaz, une galère du quotidien</h2>
            <ul className="lp-pslist">
              <li><span className="ps-ico ps-ico-x"><i className="bx bx-x"></i></span> Se déplacer jusqu'au point de vente le plus proche</li>
              <li><span className="ps-ico ps-ico-x"><i className="bx bx-x"></i></span> Porter une bouteille lourde, parfois sous la pluie</li>
              <li><span className="ps-ico ps-ico-x"><i className="bx bx-x"></i></span> Tomber sur un dépôt fermé ou en rupture</li>
            </ul>
          </div>
          <div className="lp-pscard lp-pscard-accent">
            <span className="lp-eyebrow">La solution</span>
            <h2>GazExpress vous livre le gaz à domicile</h2>
            <ul className="lp-pslist">
              <li><span className="ps-ico ps-ico-check"><i className="bx bx-check"></i></span> Commandez depuis votre téléphone</li>
              <li><span className="ps-ico ps-ico-check"><i className="bx bx-check"></i></span> Nous préparons et livrons votre commande</li>
              <li><span className="ps-ico ps-ico-check"><i className="bx bx-check"></i></span> Vous suivez la livraison en temps réel</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="lp-section" id="how">
        <div className="lp-reveal">
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
        </div>
      </section>

      {/* Pourquoi GazExpress — pipeline en cartes étagées */}
      <section className="lp-section lp-alt" id="why">
        <div className="lp-container lp-reveal">
          <div className="why-panel">
            <div className="why-head">
              <div>
                <span className="lp-eyebrow">Pourquoi GazExpress</span>
                <h2>Pensé pour votre confort</h2>
              </div>
              <span className="why-badge"><span className="pulse-dot"></span> 6 bonnes raisons</span>
            </div>
            <div className="why-list">
              {FEATURES.map((f, i) => (
                <div className="why-row" style={{ '--i': i }} key={f.title}>
                  <span className="why-ghost" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="why-body">
                    <div className="why-icon"><i className={`bx ${f.icon}`}></i></div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marques & accessoires */}
      <section className="lp-section">
        <div className="lp-container lp-reveal">
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
          <div className="lp-acc-grid">
            {ACCESSORIES.map((a) => (
              <article className="acc-card" key={a.name}>
                <div className="acc-media"><img src={a.image} alt={a.name} /></div>
                <div className="acc-body">
                  <strong>{a.name}</strong>
                  <span>{a.desc}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" id="faq">
        <div className="lp-container lp-faq-container lp-reveal">
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
          <p>Rejoignez GazExpress et faites-vous livrer votre gaz à domicile.</p>
          <div className="lp-hero-cta">
            <Link to="/inscription" className="lp-btn lp-btn-primary lp-btn-lg">S'inscrire</Link>
            <Link to="/login" className="lp-btn lp-btn-outline lp-btn-lg">Se connecter</Link>
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
            <p>Le gaz domestique commandé en un clic et livré rapidement à domicile.</p>
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
              <a href="#why">Pourquoi nous</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4>Compte</h4>
              <Link to="/inscription">S'inscrire</Link>
              <Link to="/login">Se connecter</Link>
            </div>
            <div>
              <h4>Support</h4>
              <a href="tel:+2290100000000">Nous appeler</a>
              <a href="https://wa.me/2290100000000" target="_blank" rel="noreferrer">WhatsApp</a>
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

export default Landing;
