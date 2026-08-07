import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestUserSignup, verifyEmailCode } from '../utils/auth';

// Inscription client : infos → code par email → compte confirmé.
function Inscription() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', whatsapp: '' });
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await requestUserSignup({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        whatsapp: form.whatsapp.trim(),
      });
      setStep('code');
    } catch (err) {
      setError(err.message || "Impossible d'envoyer le code.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await verifyEmailCode(form.email.trim(), code.trim(), 'email');
      navigate('/app', { replace: true });
    } catch {
      setError('Code incorrect ou expiré.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-flame"></i>
        <h1>Créer un compte</h1>
        <p>Client GazExpress</p>
      </div>

      <div className="auth-card">
        {step === 'form' ? (
          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fn">Prénom</label>
                <input id="fn" type="text" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="form-group">
                <label htmlFor="ln">Nom</label>
                <input id="ln" type="text" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>
            <label htmlFor="em">Email</label>
            <input id="em" type="email" placeholder="vous@exemple.com" value={form.email} onChange={set('email')} required />
            <label htmlFor="wa">Numéro WhatsApp</label>
            <input id="wa" type="tel" inputMode="tel" placeholder="+229 …" value={form.whatsapp} onChange={set('whatsapp')} required />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Envoi…' : 'Créer mon compte'}
            </button>
            <p className="auth-switch">
              Déjà inscrit ? <Link to="/login">Se connecter</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verify}>
            <p className="auth-hint">
              Un code a été envoyé à <strong>{form.email}</strong>. Saisissez-le pour confirmer.
            </p>
            <label htmlFor="code">Code reçu par email</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Vérification…' : 'Confirmer mon compte'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Inscription;
