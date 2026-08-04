# BIGSIXTEEN

Boutique e-commerce **et** galerie de photos, dans une seule application React.
Design minimaliste noir / blanc / gris, entièrement en français.

> Application front-end : aucune base de données ni backend. Les produits, le panier,
> les photos et l'authentification admin sont stockés dans le `localStorage` du navigateur.

## Stack

- **React 19** + **Vite 7**
- **React Router DOM 7** pour le routing
- **Boxicons** (icônes) et **Montserrat** (police) chargés via CDN
- **ESLint 9** (flat config)

## Démarrage

```bash
npm install
npm run dev      # serveur de développement (http://localhost:5000)
```

### Scripts

| Commande          | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Serveur de développement (port 5000) |
| `npm run build`   | Build de production dans `dist/`     |
| `npm run preview` | Prévisualisation du build            |
| `npm run lint`    | Analyse ESLint                       |

## Structure

```
src/
├── components/     # Header, Footer, ProductCard, PhotoCard, AdminProducts, AdminPhotos
├── pages/          # Home, Shop, Product, Cart, Gallery, About, Contact, LoginAdmin, Admin
├── utils/
│   ├── products.js # Produits, panier et authentification admin (localStorage)
│   └── photos.js   # Photos (localStorage)
├── App.jsx         # Routing principal
├── main.jsx        # Point d'entrée
└── styles.css      # Styles globaux
```

## Fonctionnalités

- **Boutique** : catalogue avec filtres (recherche, catégorie, prix), pagination,
  page produit (tailles, couleurs, stock) et panier avec badge dynamique.
- **Galerie** : grille de photos filtrable par style (streetwear, casual, élégant, sport)
  avec pagination.
- **Dashboard admin** : CRUD complet des produits et des photos, réparti en deux onglets.

## Accès admin

- URL : `/admin/login`
- Mot de passe par défaut : `admin123` (modifiable dans `src/utils/products.js`)

Le mot de passe est vérifié côté client : cet espace admin protège une démo, pas des
données sensibles.
