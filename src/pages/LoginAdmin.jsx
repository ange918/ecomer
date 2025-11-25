import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, isAdminLoggedIn } from '../utils/products';
import { useEffect } from 'react';

function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (adminLogin(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <i className='bx bx-shield-alt-2'></i>
            <h2>ADMINISTRATION</h2>
            <p>BIGSIXTEEN Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                <i className='bx bx-error-circle'></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>
                <i className='bx bx-user'></i>
                NOM D'UTILISATEUR
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>
                <i className='bx bx-lock'></i>
                MOT DE PASSE
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <i className='bx bx-log-in'></i>
              CONNEXION
            </button>
          </form>

          <div className="login-hint">
            <p><i className='bx bx-info-circle'></i> Accès réservé aux administrateurs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
