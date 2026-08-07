import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getOrders,
  createOrder,
  operationLabel,
  formatXOF,
  STATUS_LABELS,
} from '../utils/orders';

// Historique des recharges + possibilité de recommander à l'identique.
function History() {
  const navigate = useNavigate();
  const [orders] = useState(() => getOrders());

  const reorder = (order) => {
    const fresh = createOrder({
      brandId: order.brandId,
      kg: order.kg,
      type: order.type,
      address: order.address,
      paymentId: order.paymentId,
    });
    navigate(`/suivi/${fresh.id}`);
  };

  if (orders.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Historique</h1>
        <div className="empty-hint large">
          <i className="bx bx-time-five"></i>
          <p>Vous n'avez pas encore commandé.</p>
          <Link to="/commander" className="btn btn-primary">
            Commander du gaz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Historique</h1>
      <ul className="history-list">
        {orders.map((order) => (
          <li key={order.id} className="history-card">
            <Link to={`/suivi/${order.id}`} className="history-main">
              <div>
                <strong>{operationLabel(order)}</strong>
                <span className="order-sub">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  · {STATUS_LABELS[order.status]}
                </span>
                {order.rating > 0 && (
                  <span className="order-rating">
                    <i className="bx bxs-star"></i> {order.rating}/5
                  </span>
                )}
              </div>
              <span className="order-total">{formatXOF(order.total)}</span>
            </Link>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => reorder(order)}>
              <i className="bx bx-repeat"></i> Recommander
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
