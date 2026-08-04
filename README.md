# GazExpress — App Client (MVP)

Prototype **front-end** de l'application Client de **GazExpress**, un service de livraison
à domicile de gaz domestique (modèle *on-demand delivery*).

> **MVP mocké** : cette version ne couvre que l'interface **Client** décrite au §3.1 du
> cahier des charges. Il n'y a **pas de backend** — toutes les données (session, adresses,
> commandes) sont persistées dans le `localStorage` du navigateur. L'OTP, le paiement
> Mobile Money et le suivi cartographique sont **simulés**.

## Stack

- **React 19** + **Vite 7**, **React Router 7**
- **Boxicons** + **Montserrat** via CDN
- **ESLint 9** (flat config)

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5000
```

| Commande          | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Serveur de développement (port 5000) |
| `npm run build`   | Build de production dans `dist/`     |
| `npm run preview` | Prévisualisation du build            |
| `npm run lint`    | Analyse ESLint                       |

## Fonctionnalités (parcours Client)

1. **Connexion** — téléphone/email + code OTP (le code est affiché à l'écran pour la démo).
2. **Accueil** — commande en cours, raccourci « Commander », dernières recharges.
3. **Commander** — assistant en 4 étapes : marque (Oryx, Puma, TotalEnergies, Sodigaz) et
   contenance (6 / 12,5 kg), type d'opération (échange vs achat neuf), adresse (avec
   géolocalisation du navigateur), mode de paiement (espèces / MTN MoMo / Moov / Wave),
   récapitulatif avec frais de livraison calculés selon la distance.
4. **Suivi** — carte simulée avec livreur qui se rapproche, frise de statut
   (`en attente → acceptée → en route → livrée`), puis notation.
5. **Historique** — commandes passées + « Recommander ».
6. **Profil** — nom, gestion des adresses, déconnexion.
7. **Support** — contacts (appel / WhatsApp) et FAQ.

## Structure

```
src/
├── components/   AppNav, RequireAuth, OrderStatusStepper, LiveMap
├── pages/        Login, Home, NewOrder, Tracking, History, Profile, Support
├── utils/        storage, auth, catalog, geo, orders  (couche données localStorage)
├── App.jsx       routing + garde d'authentification
├── main.jsx      point d'entrée
└── styles.css    styles globaux (mobile-first)
```

## Hors périmètre (à intégrer ultérieurement)

App Livreur/Dépôt, back-office Admin, vraie intégration Mobile Money et passerelle OTP,
API cartographique/itinéraire réelle, notifications push serveur, conformité réglementaire
du transport de gaz.
