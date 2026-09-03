# GazExpress

## Vue d'ensemble
Service de **livraison de gaz domestique à domicile**. L'utilisateur commande sa recharge depuis
l'app ; un **administrateur** reçoit et traite les commandes via un tableau de bord. Construit
avec React + Vite, backend **Supabase**, déployé sur **Vercel**.

**Framework :** React 19 + Vite 7 + React Router 7
**Backend :** Supabase (Auth, Postgres + RLS, Edge Function)

## Architecture

### Stack
- **Frontend :** React 19, React Router DOM 7, GSAP (landing)
- **Build :** Vite 7 (port 5000) · **Icônes :** Boxicons · **Police :** Archivo
- **Backend :** Supabase — Auth (email + mot de passe), table `orders` (RLS),
  Edge Function `admin-orders` (clé `service_role` pour le tableau de bord)
- **Adresses** conservées en `localStorage` (`gazexpress_addresses`)

### Structure
```
src/
├── components/   AppNav, RequireAuth, AuthShell, OrderStatusStepper, LiveMap
├── pages/        Landing, Login, Inscription, Home, NewOrder, Tracking,
│                 History, Profile, Support, Admin
├── utils/        orders (Supabase), auth, catalog, geo, addresses, storage
├── lib/          supabaseClient, AuthContext
├── App.jsx       routing + gardes d'auth
├── main.jsx
└── styles.css
supabase/
├── functions/admin-orders/   Edge Function du tableau de bord
└── migrations/               schéma orders + RLS
```

## Parcours
- **Client :** inscription / connexion → commande (marque, contenance, échange/neuf, adresse +
  **GPS obligatoire**, paiement) → suivi temps réel → historique.
- **Admin :** URL secrète `/akonde/akonde` (sans mot de passe) → liste des commandes, contact
  WhatsApp, carte de localisation, changement de statut. Responsive mobile / ordinateur.

## Modèle de données
- **catalog.js** : marques (Oryx, Progaz, Benin Petro), contenances 6 / 12,5 kg, prix FCFA
  (échange / achat neuf).
- **orders** (Supabase) : cycle `en_attente → acceptee → en_route → livree` (+ `annulee`),
  frais de livraison selon la distance estimée.
- **geo.js** : géolocalisation navigateur, distance haversine, calcul des frais.

## Développement
- `npm run dev` — serveur (port 5000)
- `npm run build` — build production
- `npm run lint` — ESLint
