import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSession,
  updateProfile,
  logout,
  getAddresses,
  addAddress,
  removeAddress,
  setDefaultAddress,
} from '../utils/auth';
import { getCurrentPosition } from '../utils/geo';

// Profil : nom éditable, gestion des adresses, déconnexion.
function Profile() {
  const navigate = useNavigate();
  const [session] = useState(() => getSession());
  const [name, setName] = useState(() => session?.name ?? '');
  const [saved, setSaved] = useState(false);
  const [addresses, setAddresses] = useState(() => getAddresses());

  // Formulaire d'ajout d'adresse
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');

  const saveName = (e) => {
    e.preventDefault();
    updateProfile({ name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const useMyLocation = async () => {
    setGeoStatus('loading');
    try {
      setCoords(await getCurrentPosition());
      setGeoStatus('ok');
    } catch (err) {
      setGeoStatus(err.message || 'error');
    }
  };

  const addNewAddress = (e) => {
    e.preventDefault();
    if (!label.trim() && !details.trim()) return;
    addAddress({ label: label.trim() || 'Domicile', details: details.trim(), coords });
    setAddresses(getAddresses());
    setLabel('');
    setDetails('');
    setCoords(null);
    setGeoStatus('');
  };

  const handleRemove = (id) => {
    removeAddress(id);
    setAddresses(getAddresses());
  };

  const handleSetDefault = (id) => {
    setDefaultAddress(id);
    setAddresses(getAddresses());
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page profile">
      <h1 className="page-title">Profil</h1>

      <form className="card" onSubmit={saveName}>
        <div className="profile-id">
          <i className="bx bxs-user-circle"></i>
          <span>{session?.identifier}</span>
        </div>
        <label htmlFor="name">Nom</label>
        <input
          id="name"
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-block">
          {saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </form>

      <section className="card">
        <h2>Mes adresses</h2>
        {addresses.length === 0 ? (
          <p className="muted">Aucune adresse enregistrée.</p>
        ) : (
          <ul className="saved-addresses">
            {addresses.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>
                    {a.label}
                    {a.isDefault && <span className="badge-default">Par défaut</span>}
                  </strong>
                  {a.details && <em>{a.details}</em>}
                </div>
                <div className="addr-actions">
                  {!a.isDefault && (
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleSetDefault(a.id)}
                    >
                      Définir par défaut
                    </button>
                  )}
                  <button
                    type="button"
                    className="link-btn danger"
                    onClick={() => handleRemove(a.id)}
                    aria-label="Supprimer l'adresse"
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="address-form" onSubmit={addNewAddress}>
          <label htmlFor="p-label">Nouvelle adresse</label>
          <input
            id="p-label"
            type="text"
            placeholder="Nom (Domicile, Bureau…)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Quartier, rue, repère…"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button type="button" className="btn btn-outline btn-block" onClick={useMyLocation}>
            <i className="bx bx-current-location"></i>
            {coords ? 'Position enregistrée' : 'Utiliser ma position'}
          </button>
          {geoStatus === 'loading' && <p className="form-hint">Localisation en cours…</p>}
          {geoStatus === 'ok' && (
            <p className="form-hint ok">
              <i className="bx bx-check"></i> Position GPS captée.
            </p>
          )}
          {geoStatus && geoStatus !== 'loading' && geoStatus !== 'ok' && (
            <p className="form-error">{geoStatus}</p>
          )}
          <button type="submit" className="btn btn-primary btn-block">
            Ajouter l'adresse
          </button>
        </form>
      </section>

      <button type="button" className="btn btn-ghost btn-block logout" onClick={handleLogout}>
        <i className="bx bx-log-out"></i> Se déconnecter
      </button>
    </div>
  );
}

export default Profile;
