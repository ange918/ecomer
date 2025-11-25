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
