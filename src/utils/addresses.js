// Adresses de livraison — conservées en localStorage pour l'instant
// (migration vers Supabase prévue ultérieurement).

import { readJSON, writeJSON, makeId } from './storage';

const ADDRESSES_KEY = 'gazexpress_addresses';

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
  if (next.length > 0 && !next.some((a) => a.isDefault)) {
    next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }
  writeJSON(ADDRESSES_KEY, next);
}

export function setDefaultAddress(id) {
  const next = getAddresses().map((a) => ({ ...a, isDefault: a.id === id }));
  writeJSON(ADDRESSES_KEY, next);
}
