# GazExpress

Service de **livraison de gaz domestique à domicile**. L'utilisateur commande sa recharge
depuis l'application ; un **administrateur** reçoit les commandes dans un tableau de bord et les
traite (accepter → en route → livrée).

## Fonctionnalités

**Application client**
- Inscription / connexion (email + mot de passe, via Supabase Auth).
- Commande en quelques étapes : marque, contenance, type (échange / neuf), adresse avec
  **position GPS obligatoire**, moyen de paiement, récapitulatif.
- Suivi de commande en temps réel (statut piloté par l'admin).
- Historique et re-commande, gestion du profil et des adresses.

**Tableau de bord administrateur**
- Accessible via une **URL secrète** (`/akonde/akonde`), sans mot de passe.
- Liste des commandes avec filtres par statut, contact **WhatsApp** du client, adresse +
  **carte** de localisation, et actions de changement de statut.
- Responsive : mobile-first sur téléphone, menu latéral + pleine largeur sur ordinateur.

## Stack

- **React 19** + **Vite 7** + **React Router 7**
- **Supabase** : Auth, base Postgres (table `orders`, RLS), Edge Function `admin-orders`
  (clé `service_role` côté serveur pour le tableau de bord).
- **GSAP** (animations de la landing), **Boxicons** + **Archivo** via CDN.
- Déploiement **Vercel** (SPA fallback via `vercel.json`).

## Architecture

- `src/pages/` — Landing, Login, Inscription, Home, NewOrder, Tracking, History, Profile,
  Support, Admin (tableau de bord).
- `src/utils/` — `orders.js` (commandes via Supabase + Edge Function), `auth.js`, `catalog.js`
  (marques/prix), `geo.js` (géolocalisation), `addresses.js` (adresses en localStorage).
- `src/lib/` — `supabaseClient.js`, `AuthContext.jsx`.
- `supabase/` — `functions/admin-orders/` (Edge Function) et `migrations/`.

## Démarrage

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run lint     # ESLint
```

### Configuration Supabase (optionnelle en dev)
L'URL et la clé publique du projet sont câblées par défaut dans `src/lib/supabaseClient.js`
(la clé publique est conçue pour être exposée côté navigateur, la sécurité repose sur les
politiques RLS). On peut les surcharger via les variables d'environnement Vite
`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.
