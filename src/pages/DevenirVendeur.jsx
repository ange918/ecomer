import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUpVendor } from '../utils/auth';

// Inscription vendeur : infos (étape 1) + mot de passe (étape 2) → lien email.
// Le CIP et la localisation sont demandés après connexion (VendeurFinaliser).
function DevenirVendeur() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', whatsapp: '', password: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const goStep2 = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setBusy(true);
    try {
      await signUpVendor({
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

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-store"></i>
        <h1>Devenir vendeur</h1>
        <p>Vendez votre gaz sur GazExpress</p>
      </div>

      <div className="auth-card">
        {step !== 'sent' && (
          <ol className="wizard-steps">
            <li className={step === 1 ? 'active' : 'done'}><span>1</span>Infos</li>
            <li className={step === 2 ? 'active' : ''}><span>2</span>Compte</li>
          </ol>
        )}

        {step === 1 && (
          <form onSubmit={goStep2}>
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
            <input id="em" type="email" value={form.email} onChange={set('email')} required />
            <label htmlFor="wa">Numéro WhatsApp</label>
            <input id="wa" type="tel" inputMode="tel" placeholder="+229 …" value={form.whatsapp} onChange={set('whatsapp')} required />
            <button type="submit" className="btn btn-primary btn-block">Continuer</button>
            <p className="auth-switch">
              Déjà vendeur ? <Link to="/login">Se connecter</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={createAccount}>
            <label htmlFor="pw">Mot de passe</label>
            <input id="pw" type="password" placeholder="Au moins 6 caractères" value={form.password} onChange={set('password')} required autoFocus />
            <p className="form-hint">
              La photo de votre CIP et votre localisation vous seront demandées juste après la
              confirmation de votre email.
            </p>
            {error && <p className="form-error">{error}</p>}
            <div className="wizard-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Retour</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Création…' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        )}

        {step === 'sent' && (
          <div className="vendor-done">
            <i className="bx bx-envelope"></i>
            <h2>Vérifiez votre email</h2>
            <p>
              Un lien de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez dessus
              pour activer votre compte, puis finalisez votre boutique (CIP + localisation).
            </p>
            <p className="auth-hint">Pensez à vérifier vos spams.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DevenirVendeur;
