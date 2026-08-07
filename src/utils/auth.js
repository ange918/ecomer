// Authentification simulée (MVP) : OTP mocké, profil et adresses en localStorage.
// Aucune passerelle SMS/email réelle — le code OTP est généré côté client et
// affiché à l'utilisateur pour la démo. À remplacer par un vrai service en prod.

import { readJSON, writeJSON, makeId } from './storage';

const SESSION_KEY = 'gazexpress_session';
const ADDRESSES_KEY = 'gazexpress_addresses';
const PENDING_OTP_KEY = 'gazexpress_pending_otp';

// --- OTP (mock) ---------------------------------------------------------

// Génère un code à 4 chiffres, le mémorise et le renvoie (pour affichage démo).
export function requestOtp(identifier) {
  const code = String(Math.floor(1000 + Math.random() * 9000));
  writeJSON(PENDING_OTP_KEY, { identifier, code });
  return code;
}

export function getPendingIdentifier() {
  return readJSON(PENDING_OTP_KEY, null)?.identifier ?? null;
}

// Vérifie le code saisi ; en cas de succès, ouvre la session utilisateur.
export function verifyOtp(code) {
  const pending = readJSON(PENDING_OTP_KEY, null);
  if (!pending || pending.code !== String(code).trim()) {
    return false;
  }

  const existing = readJSON(SESSION_KEY, null);
  const session = existing ?? {
    id: makeId(),
    identifier: pending.identifier,
    name: '',
    createdAt: new Date().toISOString(),
  };
  writeJSON(SESSION_KEY, session);
  localStorage.removeItem(PENDING_OTP_KEY);
  return true;
}

// --- Session / profil ---------------------------------------------------

export function getSession() {
  return readJSON(SESSION_KEY, null);
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function updateProfile(updates) {
  const session = getSession();
  if (!session) return null;
  const next = { ...session, ...updates };
  writeJSON(SESSION_KEY, next);
  return next;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// --- Adresses -----------------------------------------------------------

export function getAddresses() {
  return readJSON(ADDRESSES_KEY, []);
}

export function getDefaultAddress() {
  const addresses = getAddresses();
  return addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
}

export function addAddress(address) {
  const addresses = getAddresses();
  const entry = {
    id: makeId(),
    label: address.label || 'Adresse',
    details: address.details || '',
    coords: address.coords || null,
    isDefault: addresses.length === 0 || !!address.isDefault,
  };
  const next = entry.isDefault
    ? [...addresses.map((a) => ({ ...a, isDefault: false })), entry]
    : [...addresses, entry];
  writeJSON(ADDRESSES_KEY, next);
  return entry;
}

export function updateAddress(id, updates) {
  const next = getAddresses().map((a) => (a.id === id ? { ...a, ...updates } : a));
  writeJSON(ADDRESSES_KEY, next);
}

export function removeAddress(id) {
  let next = getAddresses().filter((a) => a.id !== id);
  // S'assurer qu'il reste toujours une adresse par défaut si la liste n'est pas vide.
  if (next.length > 0 && !next.some((a) => a.isDefault)) {
    next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }
  writeJSON(ADDRESSES_KEY, next);
}

export function setDefaultAddress(id) {
  const next = getAddresses().map((a) => ({ ...a, isDefault: a.id === id }));
  writeJSON(ADDRESSES_KEY, next);
}
