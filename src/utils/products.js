const STORAGE_KEY = 'bigsixteen_products';
const CART_KEY = 'bigsixteen_cart';
const ADMIN_KEY = 'bigsixteen_admin';

const defaultProducts = [
  {
    id: 1,
    name: 'T-SHIRT CLASSIQUE NOIR',
    category: 'tee-shirt',
    price: 29.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc', 'gris'],
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    description: 'T-shirt en coton de qualité premium, confortable et durable.'
  },
  {
    id: 2,
    name: 'CHEMISE OXFORD BLANCHE',
    category: 'chemise',
    price: 59.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['blanc', 'bleu', 'gris'],
    stock: 30,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    description: 'Chemise Oxford élégante, parfaite pour toutes occasions.'
  },
  {
    id: 3,
    name: 'PANTALON CARGO NOIR',
    category: 'pantalon',
    price: 79.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['noir', 'kaki', 'gris'],
    stock: 40,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500',
    description: 'Pantalon cargo avec multiples poches, style urbain.'
  },
  {
    id: 4,
    name: 'CASQUETTE STREETWEAR',
    category: 'casquette',
    price: 24.99,
    sizes: ['Unique'],
    colors: ['noir', 'blanc', 'rouge'],
    stock: 60,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
    description: 'Casquette snapback ajustable, design moderne.'
  },
  {
    id: 5,
    name: 'T-SHIRT OVERSIZE BLANC',
    category: 'tee-shirt',
    price: 34.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['blanc', 'beige', 'gris'],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500',
    description: 'T-shirt oversize tendance, coupe ample et confortable.'
  },
  {
    id: 6,
    name: 'CHEMISE EN JEAN',
    category: 'chemise',
    price: 69.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['bleu', 'noir'],
    stock: 25,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500',
    description: 'Chemise en jean durable, look casual et décontracté.'
  },
  {
    id: 7,
    name: 'PANTALON CHINO BEIGE',
    category: 'pantalon',
    price: 74.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['beige', 'noir', 'marine'],
    stock: 35,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
    description: 'Pantalon chino élégant, parfait pour un look smart casual.'
  },
  {
    id: 8,
    name: 'CASQUETTE DAD HAT',
    category: 'casquette',
    price: 27.99,
    sizes: ['Unique'],
    colors: ['noir', 'beige', 'kaki'],
    stock: 50,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500',
    description: 'Casquette dad hat vintage, style intemporel.'
  },
  {
    id: 9,
    name: 'T-SHIRT GRAPHIQUE STREET',
    category: 'tee-shirt',
    price: 32.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc'],
    stock: 40,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
    description: 'T-shirt avec imprimé graphique, style streetwear.'
  },
  {
    id: 10,
    name: 'CHEMISE FLANELLE À CARREAUX',
    category: 'chemise',
    price: 64.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['rouge', 'bleu', 'noir'],
    stock: 28,
    image: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=500',
    description: 'Chemise flanelle confortable, motif carreaux tendance.'
  },
  {
    id: 11,
    name: 'PANTALON JOGGING URBAIN',
    category: 'pantalon',
    price: 54.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'gris', 'marine'],
    stock: 55,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    description: 'Pantalon jogging confortable, style décontracté chic.'
  },
  {
    id: 12,
    name: 'CASQUETTE TRUCKER MESH',
    category: 'casquette',
    price: 29.99,
    sizes: ['Unique'],
    colors: ['noir', 'blanc', 'bleu'],
    stock: 45,
    image: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=500',
    description: 'Casquette trucker respirante, mesh à l\'arrière.'
  },
  {
    id: 13,
    name: 'T-SHIRT VINTAGE LOGO',
    category: 'tee-shirt',
    price: 27.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['beige', 'gris', 'blanc'],
    stock: 38,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
    description: 'T-shirt effet vintage avec logo brodé.'
  },
  {
    id: 14,
    name: 'CHEMISE LIN NATUREL',
    category: 'chemise',
    price: 74.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['blanc', 'beige', 'bleu'],
    stock: 22,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    description: 'Chemise en lin léger, parfaite pour l\'été.'
  },
  {
    id: 15,
    name: 'PANTALON JEAN SLIM NOIR',
    category: 'pantalon',
    price: 69.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['noir', 'bleu foncé'],
    stock: 48,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    description: 'Jean slim coupe moderne, très confortable.'
  },
  {
    id: 16,
    name: 'CASQUETTE BASEBALL VINTAGE',
    category: 'casquette',
    price: 26.99,
    sizes: ['Unique'],
    colors: ['beige', 'kaki', 'marine'],
    stock: 52,
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500',
    description: 'Casquette baseball look vintage délavé.'
  },
  {
    id: 17,
    name: 'T-SHIRT POCKET TEE',
    category: 'tee-shirt',
    price: 31.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc', 'marine'],
    stock: 42,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
    description: 'T-shirt avec poche poitrine, style casual.'
  },
  {
    id: 18,
    name: 'CHEMISE CUBAINE IMPRIMÉE',
    category: 'chemise',
    price: 54.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc', 'bleu'],
    stock: 26,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500',
    description: 'Chemise cubaine à col ouvert, imprimés tendance.'
  },
  {
    id: 19,
    name: 'PANTALON TECH SPORTIF',
    category: 'pantalon',
    price: 64.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'gris', 'marine'],
    stock: 35,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    description: 'Pantalon technique respirant, idéal sport et lifestyle.'
  },
  {
    id: 20,
    name: 'CASQUETTE BUCKET HAT',
    category: 'casquette',
    price: 32.99,
    sizes: ['S', 'M', 'L'],
    colors: ['noir', 'beige', 'kaki'],
    stock: 30,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500',
    description: 'Bob reversible tendance, protection solaire.'
  },
  {
    id: 21,
    name: 'T-SHIRT RAYÉ MARINIÈRE',
    category: 'tee-shirt',
    price: 35.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['blanc-marine', 'blanc-noir'],
    stock: 33,
    image: 'https://images.unsplash.com/photo-1627225924765-552d49cf47ad?w=500',
    description: 'T-shirt rayé style marinière, classique intemporel.'
  },
  {
    id: 22,
    name: 'CHEMISE WORKWEAR ÉPAISSE',
    category: 'chemise',
    price: 79.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'beige', 'kaki'],
    stock: 20,
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500',
    description: 'Chemise épaisse style workwear, robuste et durable.'
  },
  {
    id: 23,
    name: 'PANTALON LARGE STREETWEAR',
    category: 'pantalon',
    price: 84.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['noir', 'beige', 'gris'],
    stock: 32,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
    description: 'Pantalon coupe large tendance, style streetwear.'
  },
  {
    id: 24,
    name: 'CASQUETTE 5 PANEL CAMP',
    category: 'casquette',
    price: 34.99,
    sizes: ['Unique'],
    colors: ['noir', 'marine', 'olive'],
    stock: 38,
    image: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?w=500',
    description: 'Casquette 5 panels style camp, légère et confortable.'
  },
  {
    id: 25,
    name: 'T-SHIRT HENLEY COL BOUTONNÉ',
    category: 'tee-shirt',
    price: 38.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['blanc', 'gris', 'noir'],
    stock: 36,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500',
    description: 'T-shirt Henley avec col boutonné, style casual chic.'
  },
  {
    id: 26,
    name: 'CHEMISE SATIN BRILLANTE',
    category: 'chemise',
    price: 69.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc', 'bordeaux'],
    stock: 18,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500',
    description: 'Chemise satin effet brillant, pour occasions spéciales.'
  },
  {
    id: 27,
    name: 'PANTALON VELOURS CÔTELÉ',
    category: 'pantalon',
    price: 89.99,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['beige', 'marron', 'noir'],
    stock: 24,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
    description: 'Pantalon velours côtelé, texture riche et confortable.'
  },
  {
    id: 28,
    name: 'CASQUETTE GAVROCHE PLATE',
    category: 'casquette',
    price: 36.99,
    sizes: ['S', 'M', 'L'],
    colors: ['gris', 'noir', 'marron'],
    stock: 28,
    image: 'https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=500',
    description: 'Casquette gavroche plate, style vintage élégant.'
  },
  {
    id: 29,
    name: 'T-SHIRT LONGLINE ASYMÉTRIQUE',
    category: 'tee-shirt',
    price: 42.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir', 'blanc', 'gris'],
    stock: 25,
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500',
    description: 'T-shirt longline coupe asymétrique, design moderne.'
  },
  {
    id: 30,
    name: 'CHEMISE UTILITAIRE MULTI-POCHES',
    category: 'chemise',
    price: 84.99,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['kaki', 'noir', 'beige'],
    stock: 22,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500',
    description: 'Chemise utilitaire avec multiples poches, style cargo.'
  }
];

export const getProducts = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now()
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id, updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
  }
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id));
};

export const getCart = () => {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const addToCart = (product, size, color, quantity = 1) => {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => item.id === product.id && item.size === size && item.color === color
  );
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      ...product,
      size,
      color,
      quantity
    });
  }
  
  saveCart(cart);
};

export const updateCartItem = (index, quantity) => {
  const cart = getCart();
  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }
  saveCart(cart);
};

export const removeFromCart = (index) => {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem(ADMIN_KEY) === 'true';
};

export const adminLogin = (username, password) => {
  if (username === 'BIGSIXTEEN' && password === '91RERDAKONDE') {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_KEY);
};
