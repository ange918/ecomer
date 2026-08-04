# GazExpress — Application Client (MVP)

## Vue d'ensemble
Prototype front-end de l'application **Client** de GazExpress, service de livraison à domicile
de gaz domestique. Construit avec React + Vite. **MVP mocké, sans backend** : toutes les
données vivent dans le `localStorage`.

**Framework :** React 19.2 + Vite 7.2
**État :** MVP navigable (interface Client uniquement)

## Périmètre
Seule l'interface **Client** (§3.1 du cahier des charges) est implémentée. Les apps
Livreur/Dépôt et le back-office Admin sont hors périmètre. OTP, paiement Mobile Money et
suivi cartographique sont simulés.

## Architecture

### Stack technique
- **Frontend :** React 19.2, React Router DOM 7
- **Build :** Vite 7.2 (port 5000)
- **Icônes :** Boxicons · **Police :** Montserrat
- **Stockage :** localStorage (`gazexpress_*`)

### Structure
```
src/
├── components/   AppNav, RequireAuth, OrderStatusStepper, LiveMap
├── pages/        Login, Home, NewOrder, Tracking, History, Profile, Support
├── utils/        storage, auth, catalog, geo, orders
├── App.jsx       routing + garde d'auth
├── main.jsx
└── styles.css
```

### Clés localStorage
- `gazexpress_session` — session utilisateur (identifiant, nom)
- `gazexpress_addresses` — adresses de livraison
- `gazexpress_orders` — commandes et leur statut
- `gazexpress_pending_otp` — code OTP en attente (mock)

## Parcours Client (Annexe B)
Connexion (OTP) → commande (marque, contenance, échange/achat, adresse + géoloc, paiement)
→ suivi temps réel simulé → réception + notation → historique.

## Modèle de données
- **catalog.js** : marques (Oryx, Puma, TotalEnergies, Sodigaz), contenances 6/12,5 kg, prix
  en FCFA pour échange (recharge) et achat neuf (bouteille + consigne).
- **orders.js** : cycle `en_attente → acceptee → en_route → livree`, frais de livraison
  modulés selon la distance estimée.
- **geo.js** : géolocalisation navigateur réelle, distance haversine, calcul des frais.

## Développement
- `npm run dev` — serveur (port 5000)
- `npm run build` — build production
- `npm run lint` — ESLint

## Améliorations futures
1. Backend + API (commandes, dépôts, livreurs)
2. Vraie intégration Mobile Money et passerelle OTP/SMS
3. API cartographique réelle (tuiles, itinéraire, suivi GPS livreur)
4. Apps Livreur/Dépôt et back-office Admin
5. Notifications push temps réel
