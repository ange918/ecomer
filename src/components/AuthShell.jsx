import { Link, useNavigate } from 'react-router-dom';

// Mise en page des écrans d'authentification : en-tête (bouton retour + logo),
// grand titre aligné à gauche + sous-titre, puis le contenu (formulaire, etc.).
function AuthShell({ title, subtitle, back = '/', children }) {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <header className="auth-shell-top">
        <button
          type="button"
          className="auth-back"
          onClick={() => navigate(back)}
          aria-label="Retour"
        >
          <i className="bx bx-left-arrow-alt"></i>
        </button>
        <Link to="/" className="auth-logo">
          <i className="bx bxs-flame"></i>
          <span>GazExpress</span>
        </Link>
      </header>

      <div className="auth-shell-body">
        <div className="auth-shell-head">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthShell;
