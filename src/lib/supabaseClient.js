import { createClient } from '@supabase/supabase-js';

// URL + clé publique (« publishable ») du projet gaz-express.
// La clé publique est conçue pour être exposée côté navigateur : la sécurité
// est assurée par les politiques RLS de Supabase. La clé secrète (service_role)
// n'est JAMAIS utilisée ici. On lit d'abord les variables d'environnement Vite
// (utile pour changer de projet), avec un repli sur les valeurs du projet.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://gyuuvododjhfuckadzji.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_RR2kBUlk5LVT-gaGMTwvNQ_koNmGj9K';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
