# BIGSIXTEEN - Boutique E-commerce & Galerie de Photos

## Vue d'ensemble
Site web complet avec une boutique e-commerce ET une galerie de photos. Construit avec React + Vite, design minimaliste noir/blanc/gris.

**Nom du projet:** BIGSIXTEEN  
**Type:** E-commerce + Galerie de Photos  
**Framework:** React 19.2.0 + Vite 7.2.4  
**État:** Complètement fonctionnel et prêt pour le déploiement

## Changements récents
- **25 novembre 2025**: Ajout de la galerie de photos à côté de la boutique
  - Conservation de toutes les fonctionnalités e-commerce (boutique, panier, produits)
  - Ajout de la page Galerie pour afficher les photos de personnes habillées
  - Dashboard admin avec onglets pour gérer produits ET photos séparément
  - Système de catégories pour photos (Streetwear, Casual, Élégant, Sport)
  - Authentification admin unifiée pour les deux systèmes
  - Stockage localStorage pour produits, panier, photos et authentification

## Architecture du projet

### Stack technique
- **Frontend:** React 19.2.0
- **Build:** Vite 7.2.4  
- **Routing:** React Router DOM 7.1.3
- **Icônes:** Boxicons
- **Police:** Montserrat (Google Fonts)
- **Stockage:** localStorage pour produits, panier, photos et authentification admin

### Structure des dossiers
```
.
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Header.jsx   # Navigation principale (BOUTIQUE + GALERIE)
│   │   ├── Footer.jsx   # Pied de page
│   │   ├── ProductCard.jsx  # Carte produit
│   │   ├── PhotoCard.jsx    # Carte photo avec overlay
│   │   ├── AdminProducts.jsx # Gestion admin des produits
│   │   └── AdminPhotos.jsx   # Gestion admin des photos
│   ├── pages/           # Pages de l'application
│   │   ├── Home.jsx     # Page d'accueil
│   │   ├── Shop.jsx     # Boutique avec filtres et pagination
│   │   ├── Product.jsx  # Détails d'un produit
│   │   ├── Cart.jsx     # Panier d'achat
│   │   ├── Gallery.jsx  # Galerie photos avec filtres
│   │   ├── About.jsx    # À propos
│   │   ├── Contact.jsx  # Contact
│   │   ├── LoginAdmin.jsx  # Login admin (mot de passe uniquement)
│   │   └── Admin.jsx    # Dashboard admin avec onglets
│   ├── utils/
│   │   ├── products.js  # Gestion localStorage (produits, panier, auth)
│   │   └── photos.js    # Gestion localStorage (photos)
│   ├── App.jsx          # Routing principal
│   ├── main.jsx         # Point d'entrée
│   └── styles.css       # Styles globaux complets
├── index.html           # Template HTML
├── vite.config.js       # Configuration Vite (port 5000)
└── package.json         # Dépendances
```

## Fonctionnalités

### Section E-commerce (Boutique)
- **Catalogue:** 30 produits par défaut (T-shirts, chemises, pantalons, casquettes)
- **Filtres:** Recherche, catégorie, prix
- **Détails produit:** Tailles, couleurs, description, gestion du stock
- **Panier:** Ajout, modification quantité, suppression, total dynamique
- **Badge panier:** Compteur dynamique dans le header

### Section Galerie
- **Grille de photos:** Photos de personnes habillées dans différents styles
- **Filtres:** Par catégorie (Streetwear, Casual, Élégant, Sport)
- **Pagination:** 12 photos par page
- **Effets:** Animations au survol, overlay d'informations
- **Photos par défaut:** 3 photos d'exemple

### Dashboard Admin (privé)
- **Login:** Mot de passe unique : admin123
- **Onglets:** PRODUITS et PHOTOS séparés
- **Gestion Produits:**
  - CRUD complet (créer, modifier, supprimer)
  - Champs: nom, catégorie, prix, tailles, couleurs, stock, image, description
  - Statistiques: nombre de produits, catégories, stock total
- **Gestion Photos:**
  - CRUD complet (créer, modifier, supprimer)
  - Champs: titre, catégorie, URL image, description
  - Aperçu d'image avant ajout
  - Statistiques: nombre de photos, catégories, date
- **Authentification:** Système unifié pour gérer boutique et galerie

### Caractéristiques techniques
- **Responsive:** Mobile, tablette et desktop
- **Animations:** Effets au survol, transitions fluides
- **Optimisé:** Hot Module Replacement (HMR) activé
- **Storage:** localStorage pour persistance des données

## Design

### Palette de couleurs
- Noir (#000) - Couleur principale
- Blanc (#fff) - Couleur secondaire  
- Gris (#333, #666, #999, #f5f5f5) - Nuances

### Typographie
- Police: Montserrat (toutes les graisses)
- Titres en MAJUSCULE
- Letterspacing pour l'effet premium

## Données

### Produits par défaut (localStorage)
**30 produits** répartis dans 4 catégories:
- T-shirts
- Chemises
- Pantalons
- Casquettes

### Photos par défaut (localStorage)
**3 photos** d'exemple réparties dans 3 catégories:
- Streetwear
- Élégant
- Casual

### Gestion du stockage
- **bigsixteen_products:** Liste des produits
- **bigsixteen_cart:** Panier d'achat
- **bigsixteen_photos:** Liste des photos
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

## Accès Admin
**⚠️ Important:** Pour accéder au dashboard admin:
- URL: `/admin/login`
- Mot de passe: `admin123`
- Le mot de passe peut être changé dans `src/utils/products.js`

## Déploiement
Prêt pour le déploiement Autoscale:
- Build: `npm run build`
- Distribution: dossier `dist/`
- Compatible tous navigateurs modernes

## Notes techniques
- Les images proviennent d'URLs externes (Unsplash recommandé)
- Pas de backend - tout fonctionne en localStorage
- Compatible tous navigateurs modernes
- Optimisé pour les performances
- Code organisé et commenté

## Améliorations futures recommandées
1. **Backend:** Ajouter une API pour gérer produits et photos côté serveur
2. **Sécurité:** Authentification admin côté serveur avec JWT
3. **Stockage:** Intégrer Replit Object Storage pour les photos
4. **Upload:** Permettre l'upload de fichiers depuis l'ordinateur
5. **Paiement:** Intégrer Stripe pour le processus de commande
6. **SEO:** Métadonnées et optimisation pour les moteurs de recherche
