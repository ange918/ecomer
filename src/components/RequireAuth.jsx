import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

// Garde de route : attend le chargement de la session, puis redirige vers
// /login si l'utilisateur n'est pas connecté.
function RequireAuth({ children }) {
  const location = useLocation();
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="container loading">Chargement…</div>;
  }
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default RequireAuth;
