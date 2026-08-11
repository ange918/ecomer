import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { signOut } from '../utils/auth';
import {
  getAllOrders,
  setOrderStatus,
  operationLabel,
  formatXOF,
  STATUS_LABELS,
  isActiveStatus,
} from '../utils/orders';
import { getPaymentMethod } from '../utils/catalog';

// Actions possibles selon le statut courant.
const NEXT_ACTIONS = {
  en_attente: [
    { status: 'acceptee', label: 'Accepter', className: 'btn-primary' },
    { status: 'annulee', label: 'Refuser', className: 'btn-ghost' },
  ],
  acceptee: [
    { status: 'en_route', label: 'En route', className: 'btn-primary' },
    { status: 'annulee', label: 'Annuler', className: 'btn-ghost' },
  ],
  en_route: [{ status: 'livree', label: 'Marquer livrée', className: 'btn-primary' }],
};

function waLink(number) {
  const digits = (number || '').replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

function mapLink(coords) {
  return coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : null;
}

function Admin() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const rows = await getAllOrders();
      // Actives d'abord (les plus récentes en haut), puis les terminées.
      rows.sort((a, b) => {
        const av = isActiveStatus(a.status) ? 0 : 1;
        const bv = isActiveStatus(b.status) ? 0 : 1;
        if (av !== bv) return av - bv;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(rows);
      setError('');
    } catch (err) {
      setError(err.message || 'Chargement impossible.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial + rafraîchissement périodique (nouvelles commandes).
  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [load]);

  const changeStatus = async (id, status) => {
    setBusyId(id);
    try {
      await setOrderStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message || 'Mise à jour impossible.');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const pending = orders.filter((o) => o.status === 'en_attente').length;

  return (
    <div className="admin">
      <header className="admin-header">
        <div>
          <span className="admin-eyebrow">Tableau de bord</span>
          <h1>Commandes {pending > 0 && <span className="admin-badge">{pending} en attente</span>}</h1>
          {profile?.first_name && <p className="admin-sub">Connecté : {profile.first_name}</p>}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Déconnexion
        </button>
      </header>

      {error && <p className="form-error admin-error">{error}</p>}

      {loading ? (
        <p className="admin-empty">Chargement…</p>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <i className="bx bx-package"></i>
          <p>Aucune commande pour l'instant.</p>
        </div>
      ) : (
        <ul className="admin-list">
          {orders.map((o) => {
            const actions = NEXT_ACTIONS[o.status] ?? [];
            const wa = waLink(o.clientWhatsapp);
            const map = mapLink(o.address?.coords);
            return (
              <li key={o.id} className={`admin-card status-${o.status}`}>
                <div className="admin-card-top">
                  <span className={`status-badge status-${o.status}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                  <time>
                    {new Date(o.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </time>
                </div>

                <strong className="admin-op">{operationLabel(o)}</strong>

                <dl className="admin-meta">
                  <div>
                    <dt>Client</dt>
                    <dd>{o.clientName || '—'}</dd>
                  </div>
                  <div>
                    <dt>WhatsApp</dt>
                    <dd>
                      {wa ? (
                        <a href={wa} target="_blank" rel="noreferrer" className="admin-link">
                          <i className="bx bxl-whatsapp"></i> {o.clientWhatsapp}
                        </a>
                      ) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Adresse</dt>
                    <dd>
                      {o.address?.label || '—'}
                      {o.address?.details ? ` — ${o.address.details}` : ''}
                      {map && (
                        <>
                          {' '}
                          <a href={map} target="_blank" rel="noreferrer" className="admin-link">
                            <i className="bx bx-map"></i> Carte
                          </a>
                        </>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Paiement</dt>
                    <dd>{getPaymentMethod(o.paymentId)?.name || o.paymentId || '—'}</dd>
                  </div>
                  <div>
                    <dt>Total</dt>
                    <dd className="admin-total">{formatXOF(o.total)}</dd>
                  </div>
                </dl>

                {actions.length > 0 && (
                  <div className="admin-actions">
                    {actions.map((a) => (
                      <button
                        key={a.status}
                        type="button"
                        className={`btn btn-sm ${a.className}`}
                        disabled={busyId === o.id}
                        onClick={() => changeStatus(o.id, a.status)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Admin;
