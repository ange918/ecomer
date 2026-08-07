// Catalogue statique du gaz domestique (données mockées pour le MVP).
// Prix indicatifs en francs CFA (XOF). Deux types d'opération :
//  - 'echange' : reprise d'une bouteille vide, on ne paie que la recharge.
//  - 'neuf'    : achat d'une bouteille pleine + consigne.

const BRANDS = [
  {
    id: 'oryx',
    name: 'Oryx',
    color: '#E4002B',
    contenances: [
      { kg: 6, echange: 4000, neuf: 22000 },
      { kg: 12.5, echange: 7500, neuf: 38000 },
    ],
  },
  {
    id: 'progaz',
    name: 'Progaz',
    color: '#7B2A9E',
    contenances: [
      { kg: 6, echange: 3900, neuf: 21000 },
      { kg: 12.5, echange: 7300, neuf: 37000 },
    ],
  },
  {
    id: 'benin-petro',
    name: 'Benin Petro',
    color: '#2F9E44',
    contenances: [
      { kg: 6, echange: 3800, neuf: 21000 },
      { kg: 12.5, echange: 7200, neuf: 36000 },
    ],
  },
];

export function getBrands() {
  return BRANDS;
}

export function getBrand(brandId) {
  return BRANDS.find((b) => b.id === brandId) ?? null;
}

export function getContenances(brandId) {
  return getBrand(brandId)?.contenances ?? [];
}

// Prix de l'opération (hors frais de livraison).
export function getPrice(brandId, kg, type) {
  const contenance = getContenances(brandId).find((c) => c.kg === kg);
  if (!contenance) return 0;
  return type === 'neuf' ? contenance.neuf : contenance.echange;
}

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Espèces à la livraison', icon: 'bx-money' },
  { id: 'mtn', name: 'MTN MoMo', icon: 'bx-mobile-alt' },
  { id: 'moov', name: 'Moov Money', icon: 'bx-mobile-alt' },
  { id: 'wave', name: 'Wave', icon: 'bx-wallet' },
];

export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) ?? null;
}

export function formatXOF(amount) {
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}
