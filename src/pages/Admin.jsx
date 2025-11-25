import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAdminLoggedIn,
  adminLogout,
  getPhotos,
  addPhoto,
  updatePhoto,
  deletePhoto
} from '../utils/photos';

function Admin() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'streetwear',
    image: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    loadPhotos();
  }, [navigate]);

  const loadPhotos = () => {
    setPhotos(getPhotos());
  };

  const handleLogout = () => {
    if (window.confirm('Se déconnecter ?')) {
      adminLogout();
      navigate('/admin/login');
    }
  };

  const openAddModal = () => {
    setEditingPhoto(null);
    setFormData({
      title: '',
      category: 'streetwear',
      image: '',
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      category: photo.category,
      image: photo.image,
      description: photo.description
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const photoData = {
      title: formData.title.toUpperCase(),
      category: formData.category,
      image: formData.image,
      description: formData.description
    };

    if (editingPhoto) {
      updatePhoto(editingPhoto.id, photoData);
    } else {
      addPhoto(photoData);
    }

    setShowModal(false);
    loadPhotos();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Supprimer la photo "${title}" ?`)) {
      deletePhoto(id);
      loadPhotos();
    }
  };

  const categories = new Set(photos.map(p => p.category)).size;

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
            <i className='bx bx-image'></i>
            <div>
              <h3>{photos.length}</h3>
              <p>PHOTOS</p>
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
            <i className='bx bx-calendar'></i>
            <div>
              <h3>{new Date().toLocaleDateString('fr-FR')}</h3>
              <p>DATE</p>
            </div>
          </div>
        </div>

        <div className="admin-actions">
          <h2>GESTION DES PHOTOS</h2>
          <button onClick={openAddModal} className="btn btn-primary">
            <i className='bx bx-plus'></i> AJOUTER UNE PHOTO
          </button>
        </div>

        <div className="admin-photos">
          <table className="photos-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {photos.map(photo => (
                <tr key={photo.id}>
                  <td>
                    <img src={photo.image} alt={photo.title} className="table-img" />
                  </td>
                  <td>{photo.title}</td>
                  <td><span className="category-badge">{photo.category}</span></td>
                  <td>{new Date(photo.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      onClick={() => openEditModal(photo)}
                      className="btn-icon"
                      title="Modifier"
                    >
                      <i className='bx bx-edit'></i>
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id, photo.title)}
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
              <h2>{editingPhoto ? 'MODIFIER PHOTO' : 'NOUVELLE PHOTO'}</h2>
              <button onClick={() => setShowModal(false)} className="btn-close">
                <i className='bx bx-x'></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="photo-form">
              <div className="form-group">
                <label>Titre de la photo</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  <option value="streetwear">Streetwear</option>
                  <option value="casual">Casual</option>
                  <option value="elegant">Élégant</option>
                  <option value="sport">Sport</option>
                </select>
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
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Description de la photo..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPhoto ? 'Modifier' : 'Ajouter'}
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
