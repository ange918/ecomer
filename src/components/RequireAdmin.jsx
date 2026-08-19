import { useAuth } from '../lib/AuthContext';
import AdminLogin from '../pages/AdminLogin';

// Garde de route admin : tant que l'utilisateur n'est pas administrateur, on
// affiche l'écran de mot de passe (accès par mot de passe seul, sans email).
function RequireAdmin({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="container loading">Chargement…</div>;
  }
  if (profile?.role !== 'admin') {
    return <AdminLogin />;
  }
  return children;
}

export default RequireAdmin;
