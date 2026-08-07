import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestUserSignup } from '../utils/auth';

// Inscription client : infos → lien de confirmation envoyé par email.
function Inscription() {
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', whatsapp: '' });
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
      setStep('sent');
    } catch (err) {
      setError(err.message || "Impossible d'envoyer le lien.");
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
          <div className="vendor-done">
            <i className="bx bx-envelope"></i>
            <h2>Vérifiez votre email</h2>
            <p>
              Un lien de confirmation a été envoyé à <strong>{form.email}</strong>. Ouvrez votre
              boîte mail et cliquez sur le lien pour activer votre compte et vous connecter.
            </p>
            <p className="auth-hint">Pensez à vérifier vos spams.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inscription;
