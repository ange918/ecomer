import { useState } from 'react';
import { loginAdmin } from '../utils/auth';

// Accès au tableau de bord : mot de passe uniquement (l'email admin est fixe).
// En cas de succès, AuthContext met à jour la session et RequireAdmin affiche
// automatiquement le tableau de bord.
function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginAdmin(password);
      // Pas de setBusy(false) : le composant est démonté au rendu du tableau de bord.
    } catch (err) {
      const msg = err?.message || '';
      // Mauvais mot de passe vs autre problème (réseau, service Supabase, etc.).
      if (/invalid login credentials/i.test(msg)) {
        setError('Mot de passe incorrect.');
      } else if (/failed to fetch|network|load failed/i.test(msg)) {
        setError('Connexion au serveur impossible. Vérifiez votre réseau et réessayez.');
      } else {
        setError(msg || 'Connexion impossible. Réessayez dans un instant.');
      }
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <i className="bx bxs-lock-alt"></i>
        <h1>Accès administrateur</h1>
        <p>Entrez le mot de passe pour ouvrir le tableau de bord.</p>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Connexion…' : 'Entrer'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
