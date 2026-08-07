import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { signOut } from '../utils/auth';

const STATUS = {
  pending: { icon: 'bx-time-five', label: 'En cours de vérification', text: 'Nous contrôlons votre CIP et votre boutique. Vous serez notifié dès l’activation.' },
  verified: { icon: 'bx-badge-check', label: 'Compte vérifié', text: 'Votre boutique est active. L’espace vendeur complet arrive bientôt.' },
  rejected: { icon: 'bx-x-circle', label: 'Vérification refusée', text: 'Votre dossier n’a pas pu être validé. Contactez le support.' },
};

// Écran de statut du compte vendeur.
function Vendeur() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!session?.user) return;
    supabase
      .from('vendor_details')
      .select('status, cip_path')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        // Profil vendeur incomplet (pas de CIP) → onboarding.
        if (!data || !data.cip_path) {
          navigate('/vendeur/finaliser', { replace: true });
          return;
        }
        setStatus(data.status ?? 'pending');
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const s = STATUS[status] ?? STATUS.pending;

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-store"></i>
        <h1>Espace vendeur</h1>
        <p>{profile?.first_name ? `Bonjour ${profile.first_name}` : 'Bienvenue'}</p>
      </div>

      <div className="auth-card vendor-status">
        {loading ? (
          <p className="muted">Chargement…</p>
        ) : (
          <>
            <i className={`bx ${s.icon} vendor-status-icon status-${status}`}></i>
            <h2>{s.label}</h2>
            <p>{s.text}</p>
          </>
        )}
        <button type="button" className="btn btn-ghost btn-block logout" onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default Vendeur;
