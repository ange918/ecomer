// Authentification réelle via Supabase (client email + mot de passe).
// L'admin est un compte dont le profil a `role = 'admin'` (défini côté base).

import { supabase } from '../lib/supabaseClient';

// --- Inscription CLIENT (email + mot de passe) --------------------------

// Crée le compte client ; un email de confirmation (lien) est envoyé.
export async function signUpClient({ email, password, firstName, lastName, whatsapp }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/app`,
      data: {
        role: 'user',
        first_name: firstName,
        last_name: lastName,
        whatsapp,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function loginWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// --- Session / profil ---------------------------------------------------

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
