// Commandes : création et suivi via Supabase (table `orders`).
// L'utilisateur crée une commande ; l'administrateur la reçoit dans son tableau
// de bord et fait avancer le statut (accepter → en route → livrée).

import { supabase } from '../lib/supabaseClient';
import { getBrand, getPrice, formatXOF } from './catalog';
import { estimateDistanceKm, computeDeliveryFee } from './geo';

// Cycle de vie d'une commande, dans l'ordre.
export const ORDER_STATUSES = ['en_attente', 'acceptee', 'en_route', 'livree'];

export const STATUS_LABELS = {
  en_attente: 'En attente',
  acceptee: 'Acceptée',
  en_route: 'En route',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export function isActiveStatus(status) {
  return status !== 'livree' && status !== 'annulee';
}

// Convertit une ligne Supabase (snake_case) en objet commande utilisé par l'UI.
function fromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    clientName: row.client_name,
    clientWhatsapp: row.client_whatsapp,
    brandId: row.brand_id,
    brandName: row.brand_name,
    kg: row.kg,
    type: row.type,
    address: {
      label: row.address_label,
      details: row.address_details,
      coords:
        row.address_lat != null && row.address_lng != null
          ? { lat: row.address_lat, lng: row.address_lng }
          : null,
    },
    paymentId: row.payment_id,
    productPrice: row.product_price,
    deliveryFee: row.delivery_fee,
    total: row.total,
    distanceKm: row.distance_km,
    status: row.status,
    rating: row.rating,
    createdAt: row.created_at,
  };
}

// Crée une commande à partir de la sélection client et calcule les montants.
// Snapshot du nom + WhatsApp du client pour que l'admin puisse le contacter.
export async function createOrder({ brandId, kg, type, address, paymentId }) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) throw new Error('Vous devez être connecté pour commander.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, whatsapp')
    .eq('id', user.id)
    .maybeSingle();

  const brand = getBrand(brandId);
  const productPrice = getPrice(brandId, kg, type);
  const distance = estimateDistanceKm(address?.coords);
  const deliveryFee = computeDeliveryFee(distance);
  const clientName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      client_name: clientName || null,
      client_whatsapp: profile?.whatsapp ?? null,
      brand_id: brandId,
      brand_name: brand?.name ?? brandId,
      kg,
      type,
      address_label: address?.label ?? null,
      address_details: address?.details ?? null,
      address_lat: address?.coords?.lat ?? null,
      address_lng: address?.coords?.lng ?? null,
      payment_id: paymentId,
      product_price: productPrice,
      delivery_fee: deliveryFee,
      total: productPrice + deliveryFee,
      distance_km: Math.round(distance * 10) / 10,
      status: 'en_attente',
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

// Commandes du client connecté, les plus récentes en premier (RLS).
export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return fromRow(data);
}

// Commande en cours (non livrée / non annulée), s'il y en a une.
export async function getActiveOrder() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .not('status', 'in', '(livree,annulee)')
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return fromRow((data ?? [])[0]);
}

export async function rateOrder(id, rating) {
  const { error } = await supabase.from('orders').update({ rating }).eq('id', id);
  if (error) throw error;
}

// --- Administration -----------------------------------------------------
// Le tableau de bord passe par l'Edge Function `admin-orders` (clé privilégiée
// côté Supabase) : aucun accès admin ni secret n'est nécessaire côté client.

// Toutes les commandes.
export async function getAllOrders() {
  const { data, error } = await supabase.functions.invoke('admin-orders', {
    body: { action: 'list' },
  });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

// Fixe le statut d'une commande.
export async function setOrderStatus(id, status) {
  const { data, error } = await supabase.functions.invoke('admin-orders', {
    body: { action: 'setStatus', id, status },
  });
  if (error) throw error;
  return fromRow(data);
}

// Libellé lisible de l'opération.
export function operationLabel(order) {
  const kind = order.type === 'neuf' ? 'Achat neuf' : 'Échange';
  return `${order.brandName} ${order.kg} kg · ${kind}`;
}

export { formatXOF };
