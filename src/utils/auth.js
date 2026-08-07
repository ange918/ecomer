// Authentification réelle via Supabase (users passwordless par code email,
// vendeurs email + mot de passe). Remplace l'ancienne auth mockée.

import { supabase } from '../lib/supabaseClient';

// --- Inscription / connexion USER (passwordless, code email) ------------

// Envoie un code à 6 chiffres par email et prépare la création du compte
// avec les métadonnées (rôle user, nom, prénom, WhatsApp).
export async function requestUserSignup({ email, firstName, lastName, whatsapp }) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
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
}

// Envoie un lien de connexion à un email déjà connu (connexion client).
export async function requestUserLogin(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/app`,
    },
  });
  if (error) throw error;
}

// Vérifie le code reçu par email. type: 'email' (OTP connexion) ou 'signup'.
export async function verifyEmailCode(email, token, type = 'email') {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
  if (error) throw error;
  return data;
}

// --- Inscription / connexion VENDEUR (email + mot de passe) -------------

// Crée le compte vendeur ; un email de confirmation (code) est envoyé.
export async function signUpVendor({ email, password, firstName, lastName, whatsapp }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/vendeur`,
      data: {
        role: 'vendor',
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

// --- CIP + détails vendeur (après ouverture de session) -----------------

// Envoie la photo de CIP dans le bucket privé, dossier {uid}/cip.<ext>.
export async function uploadCip(userId, file) {
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
  const path = `${userId}/cip.${ext}`;
  const { error } = await supabase.storage
    .from('cip')
    .upload(path, file, { upsert: true, contentType: file.type || 'image/jpeg' });
  if (error) throw error;
  return path;
}

export async function saveVendorDetails(userId, { cipPath, coords, locationLabel }) {
  const { error } = await supabase.from('vendor_details').upsert({
    id: userId,
    cip_path: cipPath,
    location_lat: coords?.lat ?? null,
    location_lng: coords?.lng ?? null,
    location_label: locationLabel || null,
    status: 'pending',
  });
  if (error) throw error;
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
