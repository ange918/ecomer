import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { signUpClient } from '../utils/auth';

// Inscription client : nom, prénom, email, WhatsApp, mot de passe →
// email de confirmation (lien) puis connexion.
function Inscription() {
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', whatsapp: '', password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setBusy(true);
    try {
      await signUpClient({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        whatsapp: form.whatsapp.trim(),
      });
      setStep('sent');
    } catch (err) {
      setError(err.message || 'Inscription impossible.');
    } finally {
      setBusy(false);
    }
  };

  if (step === 'sent') {
    return (
      <AuthShell title="Vérifiez votre email" subtitle="Dernière étape" back="/login">
        <div className="vendor-done">
          <i className="bx bx-envelope"></i>
          <h2>Un lien vous attend</h2>
          <p>
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>. Ouvrez votre
            boîte mail et cliquez sur le lien pour activer votre compte.
          </p>
          <p className="auth-hint">Pensez à vérifier vos spams.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Rejoignez GazExpress et commandez votre gaz en quelques secondes."
      back="/login"
    >
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
        <label htmlFor="pw">Mot de passe</label>
        <input id="pw" type="password" placeholder="Au moins 6 caractères" value={form.password} onChange={set('password')} required />
        <label htmlFor="pw2">Confirmer le mot de passe</label>
        <input id="pw2" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Création…' : 'Créer mon compte'}
        </button>
        <p className="auth-switch">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default Inscription;
