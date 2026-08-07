// Petits helpers de persistance localStorage partagés par toute l'application.
// L'app GazExpress (MVP) n'a pas de backend : toutes les données vivent ici.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Identifiant simple et unique pour les entités créées côté client.
export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
