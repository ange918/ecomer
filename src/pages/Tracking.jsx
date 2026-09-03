import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getOrderById,
  rateOrder,
  operationLabel,
  formatXOF,
  STATUS_LABELS,
} from '../utils/orders';
import OrderStatusStepper from '../components/OrderStatusStepper';
import LiveMap from '../components/LiveMap';
import { DEPOT_REFERENCE } from '../utils/geo';

// Progression de la carte dérivée du statut réel (fixé par l'admin).
const STATUS_PROGRESS = {
  en_attente: 0.08,
  acceptee: 0.4,
  en_route: 0.72,
  livree: 1,
};

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  // Chargement + rafraîchissement (le statut évolue côté admin).
  useEffect(() => {
    let active = true;
    const fetchOrder = () =>
      getOrderById(id)
        .then((o) => {
          if (!active) return;
          if (!o) {
            navigate('/app', { replace: true });
            return;
          }
          setOrder(o);
          setRating((r) => (r === 0 ? o.rating ?? 0 : r));
          setLoading(false);
        })
        .catch(() => {
          if (active) setLoading(false);
        });

    fetchOrder();
    const timer = setInterval(fetchOrder, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="page tracking">
        <h1 className="page-title">Suivi de commande</h1>
        <p className="empty-hint">Chargement…</p>
      </div>
    );
  }
  if (!order) return null;

  const status = order.status;
  const cancelled = status === 'annulee';
  const delivered = status === 'livree';
  const progress = STATUS_PROGRESS[status] ?? 0.08;

  const handleRate = async (note) => {
    setRating(note);
    try {
      await rateOrder(order.id, note);
    } catch {
      /* la note est cosmétique, on ignore l'échec réseau */
    }
  };

  return (
    <div className="page tracking">
      <h1 className="page-title">Suivi de commande</h1>

      {cancelled ? (
        <div className="tracking-cancelled">
          <i className="bx bx-x-circle"></i>
          <p>Cette commande a été annulée.</p>
        </div>
      ) : (
        <>
          <div className="tracking-map-card">
            <LiveMap
              progress={progress}
              client={order.address?.coords}
              depot={DEPOT_REFERENCE}
            />
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
        </>
      )}

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
          <Link to="/app" className="btn btn-primary btn-block">
            Retour à l'accueil
          </Link>
        </div>
      )}

      {!delivered && !cancelled && (
        <Link to="/support" className="btn btn-outline btn-block">
          <i className="bx bx-support"></i> Besoin d'aide ?
        </Link>
      )}
      {cancelled && (
        <Link to="/app" className="btn btn-primary btn-block">
          Retour à l'accueil
        </Link>
      )}
    </div>
  );
}

export default Tracking;
