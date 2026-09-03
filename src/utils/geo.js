// Géolocalisation et calculs de distance (MVP).
// La position du navigateur est réelle (API Geolocation) ; la distance au dépôt
// et les frais de livraison sont estimés localement, sans API cartographique.

// Position simulée d'un dépôt partenaire de référence (utilisée pour estimer
// la distance quand le client a partagé sa position GPS).
export const DEPOT_REFERENCE = { lat: 5.348, lng: -4.008 }; // Abidjan (exemple)

const BASE_FEE = 500; // frais de base en FCFA
const FEE_PER_KM = 150; // coût par km

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error("La géolocalisation n'est pas disponible sur cet appareil."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Impossible d'obtenir la position.")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Distance à vol d'oiseau (formule de haversine), en kilomètres.
export function distanceKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// Distance estimée entre une adresse client et le dépôt de référence.
// Retombe sur une valeur par défaut si la position GPS est inconnue.
export function estimateDistanceKm(coords) {
  const d = distanceKm(coords, DEPOT_REFERENCE);
  if (d == null) return 3; // hypothèse par défaut : 3 km
  return Math.max(0.5, Math.min(d, 20));
}

// Frais de livraison modulés selon la distance (section 5 du cahier des charges).
export function computeDeliveryFee(distance) {
  const km = typeof distance === 'number' ? distance : 3;
  return BASE_FEE + Math.round(km) * FEE_PER_KM;
}
