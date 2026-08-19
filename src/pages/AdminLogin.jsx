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
    } catch {
      setError('Mot de passe incorrect.');
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
