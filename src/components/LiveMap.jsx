// Carte de suivi *simulée* (aucune API cartographique).
// Affiche le dépôt, le client et un livreur qui progresse le long d'un tracé.
// `progress` va de 0 (au dépôt) à 1 (arrivé chez le client).

const DEPOT = { x: 40, y: 210 };
const CLIENT = { x: 260, y: 60 };
const CONTROL = { x: 90, y: 40 }; // point de contrôle de la courbe

// Point sur la courbe de Bézier quadratique pour un paramètre t ∈ [0, 1].
function pointAt(t) {
  const mt = 1 - t;
  return {
    x: mt * mt * DEPOT.x + 2 * mt * t * CONTROL.x + t * t * CLIENT.x,
    y: mt * mt * DEPOT.y + 2 * mt * t * CONTROL.y + t * t * CLIENT.y,
  };
}

function LiveMap({ progress = 0 }) {
  const t = Math.max(0, Math.min(1, progress));
  const driver = pointAt(t);
  const path = `M ${DEPOT.x} ${DEPOT.y} Q ${CONTROL.x} ${CONTROL.y} ${CLIENT.x} ${CLIENT.y}`;

  return (
    <svg
      className="live-map"
      viewBox="0 0 300 260"
      role="img"
      aria-label="Carte de suivi de la livraison"
    >
      {/* fond quadrillé façon plan de ville */}
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="300" height="260" fill="url(#grid)" className="map-grid" />

      {/* tracé complet puis portion parcourue */}
      <path d={path} className="route-bg" fill="none" strokeLinecap="round" />
      <path
        d={path}
        className="route-done"
        fill="none"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - t}
      />

      {/* dépôt */}
      <g transform={`translate(${DEPOT.x} ${DEPOT.y})`} className="map-point depot">
        <circle r="10" />
        <text x="0" y="4" textAnchor="middle">🏭</text>
      </g>

      {/* client */}
      <g transform={`translate(${CLIENT.x} ${CLIENT.y})`} className="map-point client">
        <circle r="10" />
        <text x="0" y="4" textAnchor="middle">🏠</text>
      </g>

      {/* livreur */}
      <g transform={`translate(${driver.x} ${driver.y})`} className="map-driver">
        <circle r="12" />
        <text x="0" y="5" textAnchor="middle">🛵</text>
      </g>
    </svg>
  );
}

export default LiveMap;
