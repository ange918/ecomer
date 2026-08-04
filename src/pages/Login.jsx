import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp } from '../utils/auth';

// Connexion / inscription par OTP (mockée). Étape 1 : identifiant.
// Étape 2 : saisie du code — affiché à l'écran puisqu'aucun SMS réel n'est envoyé.
function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('identifier');
  const [identifier, setIdentifier] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Entrez un numéro de téléphone ou un email.');
      return;
    }
    setError('');
    setSentCode(requestOtp(identifier.trim()));
    setStep('otp');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (verifyOtp(code)) {
      navigate('/', { replace: true });
    } else {
      setError('Code incorrect. Réessayez.');
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-flame"></i>
        <h1>GazExpress</h1>
        <p>Votre gaz livré à domicile, en quelques clics.</p>
      </div>

      {step === 'identifier' ? (
        <form className="auth-card" onSubmit={handleSendCode}>
          <h2>Connexion</h2>
          <label htmlFor="identifier">Téléphone ou email</label>
          <input
            id="identifier"
            type="text"
            inputMode="tel"
            placeholder="Ex. 07 00 00 00 00"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">
            Recevoir un code
          </button>
        </form>
      ) : (
        <form className="auth-card" onSubmit={handleVerify}>
          <h2>Vérification</h2>
          <p className="auth-hint">
            Code envoyé à <strong>{identifier}</strong>.
          </p>
          <p className="otp-demo">
            <i className="bx bx-info-circle"></i> Démo : votre code est{' '}
            <strong>{sentCode}</strong>
          </p>
          <label htmlFor="code">Code à 4 chiffres</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="0000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">
            Se connecter
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => {
              setStep('identifier');
              setCode('');
              setError('');
            }}
          >
            Modifier l'identifiant
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
