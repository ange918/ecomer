const STORAGE_KEY = 'bigsixteen_photos';
const ADMIN_KEY = 'bigsixteen_admin_logged_in';

const defaultPhotos = [
  {
    id: 1,
    title: 'STYLE URBAIN 1',
    category: 'streetwear',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    description: 'Look streetwear moderne',
    date: new Date().toISOString()
  },
  {
    id: 2,
    title: 'ÉLÉGANCE 1',
    category: 'elegant',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800',
    description: 'Tenue élégante et raffinée',
    date: new Date().toISOString()
  },
  {
    id: 3,
    title: 'CASUAL 1',
    category: 'casual',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
    description: 'Style décontracté',
    date: new Date().toISOString()
  }
];

export function getPhotos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPhotos));
    return defaultPhotos;
  }
  return JSON.parse(stored);
}

export function addPhoto(photoData) {
  const photos = getPhotos();
  const newPhoto = {
    ...photoData,
    id: Date.now(),
    date: new Date().toISOString()
  };
  photos.unshift(newPhoto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return newPhoto;
}

export function updatePhoto(id, photoData) {
  const photos = getPhotos();
  const index = photos.findIndex(p => p.id === id);
  if (index !== -1) {
    photos[index] = { ...photos[index], ...photoData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    return photos[index];
  }
  return null;
}

export function deletePhoto(id) {
  const photos = getPhotos();
  const filtered = photos.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function adminLogin(password) {
  if (password === 'admin123') {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_KEY) === 'true';
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}
