import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

// Garde de route : redirige vers /login si l'utilisateur n'est pas connecté.
function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default RequireAuth;
