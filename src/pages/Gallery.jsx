import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPhotos } from '../utils/photos';
import PhotoCard from '../components/PhotoCard';

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 12;

  useEffect(() => {
    const allPhotos = getPhotos();
    setPhotos(allPhotos);
  }, []);

  useEffect(() => {
    let filtered = [...photos];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPhotos(filtered);
    setCurrentPage(1);
  }, [photos, selectedCategory]);

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="gallery">
      <div className="gallery-header">
        <div className="container">
          <h1>GALERIE</h1>
          <p>{filteredPhotos.length} photos</p>
        </div>
      </div>

      <div className="container">
        <div className="gallery-layout">
          <aside className="gallery-filters">
            <div className="filter-section">
              <h3>CATÉGORIE</h3>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => handleCategoryChange('all')}
                  />
                  <span>Tout</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'streetwear'}
                    onChange={() => handleCategoryChange('streetwear')}
                  />
                  <span>Streetwear</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'casual'}
                    onChange={() => handleCategoryChange('casual')}
                  />
                  <span>Casual</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'elegant'}
                    onChange={() => handleCategoryChange('elegant')}
                  />
                  <span>Élégant</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'sport'}
                    onChange={() => handleCategoryChange('sport')}
                  />
                  <span>Sport</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="gallery-content">
            {currentPhotos.length === 0 ? (
              <div className="no-photos">
                <i className='bx bx-image'></i>
                <p>Aucune photo trouvée</p>
              </div>
            ) : (
              <>
                <div className="photos-grid">
                  {currentPhotos.map(photo => (
                    <PhotoCard key={photo.id} photo={photo} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn-page"
                    >
                      <i className='bx bx-chevron-left'></i>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn-page ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="btn-page"
                    >
                      <i className='bx bx-chevron-right'></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
