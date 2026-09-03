// Carte de suivi de livraison — vraie carte OpenStreetMap via Leaflet.
// Affiche le dépôt, le client (coordonnées GPS de la commande) et un livreur
// qui progresse le long du tracé. `progress` va de 0 (au dépôt) à 1 (chez le
// client) et découle du statut réel fixé par l'admin.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Marqueur emoji via divIcon : pas d'image, donc pas le bug classique des
// icônes Leaflet cassées par le bundler.
function emojiIcon(emoji, size = 34) {
  return L.divIcon({
    className: 'map-emoji',
    html: `<span style="font-size:${Math.round(size * 0.62)}px;line-height:${size}px">${emoji}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Position du livreur interpolée linéairement entre le dépôt et le client.
function interpolate(depot, client, t) {
  return [
    depot.lat + (client.lat - depot.lat) * t,
    depot.lng + (client.lng - depot.lng) * t,
  ];
}

function LiveMap({ progress = 0, client, depot }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const driverRef = useRef(null);

  const t = Math.max(0, Math.min(1, progress));

  // Initialisation unique de la carte (au montage).
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    if (client) {
      // Tracé dépôt → client + marqueurs, cadrage sur les deux points.
      const route = [
        [depot.lat, depot.lng],
        [client.lat, client.lng],
      ];
      L.polyline(route, {
        color: '#ef4a26',
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      L.marker([depot.lat, depot.lng], { icon: emojiIcon('🏭') }).addTo(map);
      L.marker([client.lat, client.lng], { icon: emojiIcon('🏠') }).addTo(map);

      driverRef.current = L.marker(interpolate(depot, client, t), {
        icon: emojiIcon('🛵', 40),
        zIndexOffset: 1000,
      }).addTo(map);

      map.fitBounds(route, { padding: [40, 40] });
    } else {
      // Repli : GPS client inconnu → on centre simplement sur le dépôt.
      L.marker([depot.lat, depot.lng], { icon: emojiIcon('🏭') }).addTo(map);
      map.setView([depot.lat, depot.lng], 13);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      driverRef.current = null;
    };
    // Init une seule fois : les mises à jour de progression sont gérées plus bas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Déplacement du livreur quand la progression (le statut) change.
  useEffect(() => {
    if (driverRef.current && client) {
      driverRef.current.setLatLng(interpolate(depot, client, t));
    }
  }, [t, client, depot]);

  return (
    <div
      ref={containerRef}
      className="live-map"
      role="img"
      aria-label="Carte de suivi de la livraison"
    />
  );
}

export default LiveMap;
