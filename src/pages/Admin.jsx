import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Filtres de statut (le menu à gauche sur ordinateur, en ligne sur mobile).
const FILTERS = [
  { key: 'all', label: 'Toutes', icon: 'bx-list-ul' },
  { key: 'en_attente', label: 'En attente', icon: 'bx-time-five' },
  { key: 'active', label: 'En cours', icon: 'bx-cycling' },
  { key: 'livree', label: 'Livrées', icon: 'bx-check-circle' },
  { key: 'annulee', label: 'Annulées', icon: 'bx-x-circle' },
];

function matchesFilter(order, filter) {
  if (filter === 'all') return true;
  if (filter === 'active') return order.status === 'acceptee' || order.status === 'en_route';
  return order.status === filter;
}

function waLink(number) {
  const digits = (number || '').replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

function mapLink(coords) {
  return coords ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}` : null;
}

function mapEmbed(coords) {
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=16&output=embed`;
}

// Boutons de filtre (réutilisés dans la barre latérale et la barre mobile).
function FilterNav({ counts, value, onChange, className }) {
  return (
    <nav className={className}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          className={`admin-filter ${value === f.key ? 'active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          <i className={`bx ${f.icon}`}></i>
          <span>{f.label}</span>
          <em>{counts[f.key] ?? 0}</em>
        </button>
      ))}
    </nav>
  );
}

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [mapOpenId, setMapOpenId] = useState(null);
  const [filter, setFilter] = useState('all');

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
    navigate('/akonde', { replace: true });
  };

  const counts = {
    all: orders.length,
    en_attente: orders.filter((o) => o.status === 'en_attente').length,
    active: orders.filter((o) => o.status === 'acceptee' || o.status === 'en_route').length,
    livree: orders.filter((o) => o.status === 'livree').length,
    annulee: orders.filter((o) => o.status === 'annulee').length,
  };
  const filtered = orders.filter((o) => matchesFilter(o, filter));

  return (
    <div className="admin-shell">
      {/* Barre latérale (ordinateur) */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-logo"><i className="bx bxs-flame"></i></span>
          <span>GazExpress<em>Admin</em></span>
        </div>
        <FilterNav counts={counts} value={filter} onChange={setFilter} className="admin-nav" />
        <button type="button" className="btn btn-ghost admin-logout" onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">Tableau de bord</span>
            <h1>
              Commandes
              {counts.en_attente > 0 && (
                <span className="admin-badge">{counts.en_attente} en attente</span>
              )}
            </h1>
          </div>
          <button type="button" className="btn btn-ghost btn-sm admin-mobile-logout" onClick={handleLogout}>
            <i className="bx bx-log-out"></i>
          </button>
        </header>

        {/* Filtres en ligne (mobile) */}
        <FilterNav counts={counts} value={filter} onChange={setFilter} className="admin-filters-row" />

        {error && <p className="form-error admin-error">{error}</p>}

        {loading ? (
          <p className="admin-empty">Chargement…</p>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="bx bx-package"></i>
            <p>{orders.length === 0 ? "Aucune commande pour l'instant." : 'Aucune commande dans ce filtre.'}</p>
          </div>
        ) : (
          <ul className="admin-grid">
            {filtered.map((o) => {
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
                      <dt>Paiement</dt>
                      <dd>{getPaymentMethod(o.paymentId)?.name || o.paymentId || '—'}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd className="admin-total">{formatXOF(o.total)}</dd>
                    </div>
                  </dl>

                  <div className="admin-loc">
                    <div className="admin-loc-head">
                      <i className="bx bx-map"></i>
                      <div>
                        <strong>{o.address?.label || 'Localisation'}</strong>
                        {o.address?.details && <span>{o.address.details}</span>}
                        {o.address?.coords && (
                          <small>
                            {o.address.coords.lat.toFixed(5)}, {o.address.coords.lng.toFixed(5)}
                          </small>
                        )}
                      </div>
                    </div>
                    {o.address?.coords ? (
                      <>
                        <div className="admin-loc-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => setMapOpenId(mapOpenId === o.id ? null : o.id)}
                          >
                            <i className="bx bx-map-alt"></i>
                            {mapOpenId === o.id ? 'Masquer la carte' : 'Voir sur la carte'}
                          </button>
                          <a
                            href={map}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-ghost"
                          >
                            <i className="bx bx-navigation"></i> Google Maps
                          </a>
                        </div>
                        {mapOpenId === o.id && (
                          <iframe
                            className="admin-map"
                            title={`Carte ${o.id}`}
                            src={mapEmbed(o.address.coords)}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        )}
                      </>
                    ) : (
                      <p className="admin-loc-missing">
                        <i className="bx bx-error-circle"></i> Aucune position GPS fournie.
                      </p>
                    )}
                  </div>

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
      </main>
    </div>
  );
}

export default Admin;
