import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestUserLogin, loginWithPassword } from '../utils/auth';

// Connexion : onglet Client (lien par email) / onglet Vendeur (mot de passe).
function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('client');

  // Client (lien magique)
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');

  // Vendeur (mot de passe)
  const [vEmail, setVEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const sendLink = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await requestUserLogin(email.trim());
      setStep('sent');
    } catch (err) {
      setError(err.message || "Impossible d'envoyer le lien.");
    } finally {
      setBusy(false);
    }
  };

  const vendorLogin = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginWithPassword(vEmail.trim(), password);
      navigate('/vendeur', { replace: true });
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-flame"></i>
        <h1>GazExpress</h1>
        <p>Votre gaz livré à domicile.</p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={tab === 'client' ? 'active' : ''}
            onClick={() => { setTab('client'); setError(''); }}
          >
            Client
          </button>
          <button
            type="button"
            className={tab === 'vendeur' ? 'active' : ''}
            onClick={() => { setTab('vendeur'); setError(''); }}
          >
            Vendeur
          </button>
        </div>

        {tab === 'client' && step === 'email' && (
          <form onSubmit={sendLink}>
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
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Envoi…' : 'Recevoir un lien de connexion'}
            </button>
            <p className="auth-switch">
              Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
            </p>
          </form>
        )}

        {tab === 'client' && step === 'sent' && (
          <div className="vendor-done">
            <i className="bx bx-envelope"></i>
            <h2>Vérifiez votre email</h2>
            <p>
              Un lien de connexion a été envoyé à <strong>{email}</strong>. Cliquez dessus pour
              vous connecter.
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={() => { setStep('email'); setError(''); }}
            >
              Modifier l'email
            </button>
          </div>
        )}

        {tab === 'vendeur' && (
          <form onSubmit={vendorLogin}>
            <label htmlFor="v-email">Email</label>
            <input
              id="v-email"
              type="email"
              placeholder="boutique@exemple.com"
              value={vEmail}
              onChange={(e) => setVEmail(e.target.value)}
              required
            />
            <label htmlFor="v-pass">Mot de passe</label>
            <input
              id="v-pass"
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
              Vous avez une boutique ? <Link to="/devenir-vendeur">Devenir vendeur</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
