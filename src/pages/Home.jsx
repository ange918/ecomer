import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import {
  getActiveOrder,
  getOrders,
  operationLabel,
  formatXOF,
  STATUS_LABELS,
} from '../utils/orders';

// Tableau de bord d'accueil : commande active, raccourci de commande, dernières recharges.
function Home() {
  const [session] = useState(() => getSession());
  const [activeOrder] = useState(() => getActiveOrder());
  const [recentOrders] = useState(() => getOrders().slice(0, 3));

  const greetingName = session?.name?.trim() || 'à vous';

  return (
    <div className="page home">
      <section className="greeting">
        <p className="eyebrow">Bonjour</p>
        <h1>Bienvenue {greetingName} 👋</h1>
      </section>

      {activeOrder && (
        <Link to={`/suivi/${activeOrder.id}`} className="active-order-card">
          <div className="active-order-head">
            <span className="pulse-dot"></span>
            <span>Commande en cours</span>
          </div>
          <strong>{operationLabel(activeOrder)}</strong>
          <span className="active-order-status">
            {STATUS_LABELS[activeOrder.status]}
            <i className="bx bx-chevron-right"></i>
          </span>
        </Link>
      )}

      <Link to="/commander" className="cta-order">
        <div className="cta-icon">
          <i className="bx bxs-flame"></i>
        </div>
        <div className="cta-text">
          <strong>Commander du gaz</strong>
          <span>Échange ou bouteille neuve, livré chez vous</span>
        </div>
        <i className="bx bx-chevron-right cta-arrow"></i>
      </Link>

      <section className="home-section">
        <div className="section-head">
          <h2>Dernières recharges</h2>
          <Link to="/historique" className="section-link">
            Tout voir
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-hint">
            <i className="bx bx-package"></i>
            <p>Aucune recharge pour l'instant.</p>
          </div>
        ) : (
          <ul className="order-list">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link to={`/suivi/${order.id}`} className="order-row">
                  <div>
                    <strong>{operationLabel(order)}</strong>
                    <span className="order-sub">{STATUS_LABELS[order.status]}</span>
                  </div>
                  <span className="order-total">{formatXOF(order.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
