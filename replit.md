# BIGSIXTEEN - Site E-Commerce Complet

## Vue d'ensemble
Site e-commerce moderne pour vendre des vêtements (pantalons, chemises, t-shirts, casquettes). Construit avec React + Vite, inspiré de FashLink.

**Nom du projet:** BIGSIXTEEN  
**Type:** Application E-Commerce Frontend  
**Framework:** React 19.2.0 + Vite 7.2.4  
**État:** Complètement fonctionnel et prêt pour le déploiement

## Changements récents
- **25 novembre 2025**: Création complète du site e-commerce
  - Installation de React Router pour la navigation
  - Création de toutes les pages (Accueil, Boutique, Produit, Panier, À propos, Contact, Admin)
  - Implémentation du dashboard admin avec login sécurisé
  - Système de panier complet avec localStorage
  - Design noir/blanc/gris avec police Montserrat
  - Responsive et animations
  - Correction du bug du badge du panier (événements personnalisés)

## Architecture du projet

### Stack technique
- **Frontend:** React 19.2.0
- **Build:** Vite 7.2.4  
- **Routing:** React Router DOM 7.1.3
- **Icônes:** Boxicons
- **Police:** Montserrat (Google Fonts)
- **Stockage:** localStorage pour produits, panier et authentification admin

### Structure des dossiers
```
.
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Header.jsx   # Navigation avec badge panier réactif
│   │   ├── Footer.jsx   # Pied de page
│   │   └── ProductCard.jsx  # Carte produit
│   ├── pages/           # Pages de l'application
│   │   ├── Home.jsx     # Page d'accueil avec hero, stats, catégories
│   │   ├── Shop.jsx     # Boutique avec filtres et recherche
│   │   ├── Product.jsx  # Page produit détaillée
│   │   ├── Cart.jsx     # Panier d'achats
│   │   ├── About.jsx    # À propos de la marque
│   │   ├── Contact.jsx  # Formulaire de contact
│   │   ├── LoginAdmin.jsx  # Login admin
│   │   └── Admin.jsx    # Dashboard admin CRUD
│   ├── utils/
│   │   └── products.js  # Gestion localStorage (produits, panier, auth)
│   ├── App.jsx          # Routing principal
│   ├── main.jsx         # Point d'entrée
│   └── styles.css       # Styles globaux complets
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite (port 5000)
└── package.json         # Dépendances

```

## Fonctionnalités

### Pages publiques
- **Accueil:** Hero, compteurs animés, catégories, nouveautés, bestsellers, newsletter
- **Boutique:** Grille de produits, filtres (catégorie, prix), recherche, pagination
- **Page Produit:** Images, description, sélection taille/couleur, ajout au panier
- **Panier:** Liste articles, modification quantité, calcul total, localStorage
- **À propos:** Histoire, valeurs, galerie photos, équipe
- **Contact:** Formulaire, informations, réseaux sociaux

### Dashboard Admin
- **Login:** Nom d'utilisateur: BIGSIXTEEN / Mot de passe: 91RERDAKONDE
- **Statistiques:** Nombre de produits, catégories, stock total (compteurs animés)
- **CRUD Produits:** Ajouter, modifier, supprimer des produits
- **Champs produit:** nom, catégorie, prix, tailles, couleurs, stock, image URL, description
- **Stockage:** localStorage avec mise à jour immédiate dans la boutique

### Caractéristiques techniques
- **Panier réactif:** Badge mis à jour automatiquement via événements personnalisés
- **Filtrage:** Par catégorie et plage de prix
- **Recherche:** Recherche en temps réel dans les produits
- **Pagination:** 8 produits par page
- **Responsive:** Mobile, tablette et desktop
- **Animations:** Transitions au survol, compteurs animés, effets visuels

## Design

### Palette de couleurs
- Noir (#000) - Couleur principale
- Blanc (#fff) - Couleur secondaire  
- Gris (#333, #666, #999, #f5f5f5) - Nuances
- Accents: Rouge (#f44336), Vert (#2e7d32), Orange (#ff9800)

### Typographie
- Police: Montserrat (toutes les graisses)
- Titres en MAJUSCULE
- Letterspacing pour l'effet premium

### Composants UI
- Boutons primaires/secondaires
- Cartes produits avec effets hover
- Formulaires stylisés
- Badges de statut (stock, nouveau)
- Modales (dashboard admin)
- Tables responsive

## Données

### Produits par défaut (localStorage)
8 produits initiaux répartis dans 4 catégories:
- 2 T-shirts
- 2 Chemises
- 2 Pantalons
- 2 Casquettes

### Gestion du stockage
- **bigsixteen_products:** Liste des produits
- **bigsixteen_cart:** Panier utilisateur
- **bigsixteen_admin:** État de connexion admin

## Développement

### Scripts disponibles
- `npm run dev` - Serveur de développement (port 5000)
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build
- `npm run lint` - Vérification ESLint

### Configuration
- **Port:** 5000 (0.0.0.0)
- **Host allowed:** true (pour proxy Replit)
- **HMR:** Activé (Hot Module Replacement)

## Déploiement
Configuré pour Autoscale deployment:
- Build: `npm run build`
- Preview: `vite preview --host 0.0.0.0 --port`
- Distribution: dossier `dist/`

## Identifiants Admin
**⚠️ Important:** Pour accéder au dashboard admin:
- URL: `/admin/login`
- Nom d'utilisateur: `BIGSIXTEEN`
- Mot de passe: `91RERDAKONDE`

## Notes techniques
- Les images proviennent d'Unsplash (URLs externes)
- Pas de backend - tout fonctionne en localStorage
- Compatible tous navigateurs modernes
- Optimisé pour les performances
- Code organisé et commenté
