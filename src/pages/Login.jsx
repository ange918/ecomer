import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { loginWithPassword } from '../utils/auth';

// Connexion client (email + mot de passe).
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginWithPassword(email.trim(), password);
      navigate('/app', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Content de vous revoir"
      subtitle="Connectez-vous pour commander ou gérer votre boutique."
      back="/"
    >
      <form onSubmit={submit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <label htmlFor="pass">Mot de passe</label>
        <input
          id="pass"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <p className="auth-switch">
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default Login;
