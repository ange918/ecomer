import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminLoggedIn, adminLogout } from '../utils/products';
import AdminProducts from '../components/AdminProducts';
import AdminPhotos from '../components/AdminPhotos';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Se déconnecter ?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

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
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className='bx bx-package'></i> PRODUITS
          </button>
          <button
            className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <i className='bx bx-image'></i> PHOTOS
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'photos' && <AdminPhotos />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
