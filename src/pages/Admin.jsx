import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAdminLoggedIn,
  adminLogout,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../utils/products';

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'tee-shirt',
    price: '',
    sizes: '',
    colors: '',
    stock: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    loadProducts();
  }, [navigate]);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const handleLogout = () => {
    if (window.confirm('Se déconnecter ?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'tee-shirt',
      price: '',
      sizes: '',
      colors: '',
      stock: '',
      image: '',
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name.toUpperCase(),
      category: formData.category,
      price: parseFloat(formData.price),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim()),
      stock: parseInt(formData.stock),
      image: formData.image,
      description: formData.description
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setShowModal(false);
    loadProducts();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer le produit "${name}" ?`)) {
      deleteProduct(id);
      loadProducts();
    }
  };

  const categories = new Set(products.map(p => p.category)).size;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1><i className='bx bx-dashboard'></i> DASHBOARD ADMIN</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            <i className='bx bx-log-out'></i> Déconnexion
          </button>
        </div>
      </div>

      <div className="container">
        <div className="admin-stats">
          <div className="stat-card">
            <i className='bx bx-package'></i>
            <div>
              <h3>{products.length}</h3>
              <p>PRODUITS</p>
            </div>
          </div>
          <div className="stat-card">
            <i className='bx bx-grid-alt'></i>
            <div>
              <h3>{categories}</h3>
              <p>CATÉGORIES</p>
            </div>
          </div>
          <div className="stat-card">
            <i className='bx bx-box'></i>
            <div>
              <h3>{totalStock}</h3>
              <p>STOCK TOTAL</p>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <h2>GESTION DES PRODUITS</h2>
          <button onClick={openAddModal} className="btn btn-primary">
            <i className='bx bx-plus'></i> AJOUTER UN PRODUIT
          </button>
        </div>

        <div className="admin-products">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="table-img" />
                  </td>
                  <td>{product.name}</td>
                  <td><span className="category-badge">{product.category}</span></td>
                  <td>{product.price.toFixed(2)} €</td>
                  <td>
                    <span className={`stock-badge ${product.stock <= 5 ? 'low' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => openEditModal(product)}
                      className="btn-icon"
                      title="Modifier"
                    >
                      <i className='bx bx-edit'></i>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="btn-icon danger"
                      title="Supprimer"
                    >
                      <i className='bx bx-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'MODIFIER PRODUIT' : 'NOUVEAU PRODUIT'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">
                <i className='bx bx-x'></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="tee-shirt">T-shirt</option>
                    <option value="chemise">Chemise</option>
                    <option value="pantalon">Pantalon</option>
                    <option value="casquette">Casquette</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tailles (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                    placeholder="S, M, L, XL"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Couleurs (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({...formData, colors: e.target.value})}
                    placeholder="noir, blanc, gris"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de l'image</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
