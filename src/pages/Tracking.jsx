import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getOrderById,
  advanceStatus,
  rateOrder,
  operationLabel,
  formatXOF,
  ORDER_STATUSES,
  STATUS_LABELS,
} from '../utils/orders';
import OrderStatusStepper from '../components/OrderStatusStepper';
import LiveMap from '../components/LiveMap';

// Statut correspondant à un niveau de progression (0 → 1).
function statusFromProgress(p) {
  if (p >= 1) return 'livree';
  if (p >= 0.68) return 'en_route';
  if (p >= 0.34) return 'acceptee';
  return 'en_attente';
}

const STATUS_START = { en_attente: 0, acceptee: 0.34, en_route: 0.68, livree: 1 };

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Champs statiques de la commande (lus une fois).
  const [order] = useState(() => getOrderById(id));
  const [progress, setProgress] = useState(() =>
    order ? STATUS_START[order.status] ?? 0 : 0
  );
  const [rating, setRating] = useState(() => order?.rating ?? 0);

  // Statut déjà écrit en storage — pour ne pas dépasser lors de la simulation.
  const persistedStatus = useRef(order?.status ?? 'en_attente');

  // Rediriger si la commande n'existe pas (navigation, pas de setState).
  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order, navigate]);

  // Animation de la progression tant que la commande n'est pas livrée.
  useEffect(() => {
    if (!order || persistedStatus.current === 'livree') return;
    const timer = setInterval(() => {
      setProgress((p) => Math.min(1, p + 0.02));
    }, 220);
    return () => clearInterval(timer);
  }, [order]);

  // Répercuter l'avancement dans le storage (écritures seules, pas de setState).
  useEffect(() => {
    if (!order) return;
    const target = statusFromProgress(progress);
    while (
      ORDER_STATUSES.indexOf(persistedStatus.current) < ORDER_STATUSES.indexOf(target)
    ) {
      advanceStatus(order.id);
      const nextIdx = ORDER_STATUSES.indexOf(persistedStatus.current) + 1;
      persistedStatus.current = ORDER_STATUSES[nextIdx];
    }
  }, [progress, order]);

  if (!order) return null;

  const status = statusFromProgress(progress);
  const delivered = status === 'livree';

  const handleRate = (note) => {
    setRating(note);
    rateOrder(order.id, note);
  };

  return (
    <div className="page tracking">
      <h1 className="page-title">Suivi de commande</h1>

      <div className="tracking-map-card">
        <LiveMap progress={progress} />
        <div className="tracking-eta">
          {delivered ? (
            <>
              <i className="bx bx-check-circle"></i> Commande livrée
            </>
          ) : (
            <>
              <span className="pulse-dot"></span> {STATUS_LABELS[status]}
            </>
          )}
        </div>
      </div>

      <div className="tracking-summary">
        <strong>{operationLabel(order)}</strong>
        <span>{formatXOF(order.total)}</span>
      </div>

      <OrderStatusStepper status={status} />

      {delivered && (
        <div className="rating-card">
          <p>Comment s'est passée la livraison ?</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`star ${n <= rating ? 'on' : ''}`}
                onClick={() => handleRate(n)}
                aria-label={`Noter ${n} sur 5`}
              >
                <i className={`bx ${n <= rating ? 'bxs-star' : 'bx-star'}`}></i>
              </button>
            ))}
          </div>
          {rating > 0 && <p className="rating-thanks">Merci pour votre retour !</p>}
          <Link to="/" className="btn btn-primary btn-block">
            Retour à l'accueil
          </Link>
        </div>
      )}

      {!delivered && (
        <Link to="/support" className="btn btn-outline btn-block">
          <i className="bx bx-support"></i> Besoin d'aide ?
        </Link>
      )}
    </div>
  );
}

export default Tracking;
