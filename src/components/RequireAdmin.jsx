import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

// Garde de route admin : attend le chargement, redirige vers /login si pas de
// session, et vers /app si l'utilisateur n'est pas administrateur.
function RequireAdmin({ children }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <div className="container loading">Chargement…</div>;
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  if (profile?.role !== 'admin') {
    return <Navigate to="/app" replace />;
  }
  return children;
}

export default RequireAdmin;
