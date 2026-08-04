// Commandes (MVP) : création, historique et cycle de statut, en localStorage.
// Le cycle est simulé côté client (aucun dépôt/livreur réel ne répond).

import { readJSON, writeJSON, makeId } from './storage';
import { getBrand, getPrice, formatXOF } from './catalog';
import { estimateDistanceKm, computeDeliveryFee } from './geo';

const ORDERS_KEY = 'gazexpress_orders';

// Cycle de vie d'une commande, dans l'ordre.
export const ORDER_STATUSES = ['en_attente', 'acceptee', 'en_route', 'livree'];

export const STATUS_LABELS = {
  en_attente: 'En attente de dépôt',
  acceptee: 'Acceptée',
  en_route: 'En route',
  livree: 'Livrée',
};

export function isActiveStatus(status) {
  return status !== 'livree' && status !== 'annulee';
}

export function getOrders() {
  // Les plus récentes en premier.
  return readJSON(ORDERS_KEY, []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function getOrderById(id) {
  return getOrders().find((o) => o.id === id) ?? null;
}

// Commande en cours (non livrée), s'il y en a une.
export function getActiveOrder() {
  return getOrders().find((o) => isActiveStatus(o.status)) ?? null;
}

// Crée une commande à partir de la sélection client et calcule les montants.
export function createOrder({ brandId, kg, type, address, paymentId }) {
  const brand = getBrand(brandId);
  const productPrice = getPrice(brandId, kg, type);
  const distance = estimateDistanceKm(address?.coords);
  const deliveryFee = computeDeliveryFee(distance);

  const order = {
    id: makeId(),
    brandId,
    brandName: brand?.name ?? brandId,
    kg,
    type, // 'echange' | 'neuf'
    address,
    paymentId,
    productPrice,
    deliveryFee,
    total: productPrice + deliveryFee,
    distanceKm: Math.round(distance * 10) / 10,
    status: 'en_attente',
    rating: null,
    createdAt: new Date().toISOString(),
  };

  writeJSON(ORDERS_KEY, [order, ...readJSON(ORDERS_KEY, [])]);
  return order;
}

// Fait avancer la commande d'un cran dans le cycle de statut.
export function advanceStatus(id) {
  const orders = readJSON(ORDERS_KEY, []);
  const next = orders.map((o) => {
    if (o.id !== id) return o;
    const idx = ORDER_STATUSES.indexOf(o.status);
    if (idx < 0 || idx >= ORDER_STATUSES.length - 1) return o;
    return { ...o, status: ORDER_STATUSES[idx + 1] };
  });
  writeJSON(ORDERS_KEY, next);
  return next.find((o) => o.id === id) ?? null;
}

export function rateOrder(id, rating) {
  const next = readJSON(ORDERS_KEY, []).map((o) =>
    o.id === id ? { ...o, rating } : o
  );
  writeJSON(ORDERS_KEY, next);
}

// Libellé lisible de l'opération.
export function operationLabel(order) {
  const kind = order.type === 'neuf' ? 'Achat neuf' : 'Échange';
  return `${order.brandName} ${order.kg} kg · ${kind}`;
}

export { formatXOF };
