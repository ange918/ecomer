import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/products';
import ProductCard from '../components/ProductCard';

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under30':
          filtered = filtered.filter(p => p.price < 30);
          break;
        case '30to60':
          filtered = filtered.filter(p => p.price >= 30 && p.price <= 60);
          break;
        case 'over60':
          filtered = filtered.filter(p => p.price > 60);
          break;
      }
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, searchTerm, priceRange]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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
    <div className="shop">
      <div className="shop-header">
        <div className="container">
          <h1>BOUTIQUE</h1>
          <p>{filteredProducts.length} produits</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside className="shop-filters">
            <div className="filter-section">
              <h3>RECHERCHE</h3>
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                    checked={selectedCategory === 'tee-shirt'}
                    onChange={() => handleCategoryChange('tee-shirt')}
                  />
                  <span>T-shirts</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'chemise'}
                    onChange={() => handleCategoryChange('chemise')}
                  />
                  <span>Chemises</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'pantalon'}
                    onChange={() => handleCategoryChange('pantalon')}
                  />
                  <span>Pantalons</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'casquette'}
                    onChange={() => handleCategoryChange('casquette')}
                  />
                  <span>Casquettes</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3>PRIX</h3>
              <div className="filter-options">
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'all'}
                    onChange={() => setPriceRange('all')}
                  />
                  <span>Tous les prix</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'under30'}
                    onChange={() => setPriceRange('under30')}
                  />
                  <span>Moins de 30€</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === '30to60'}
                    onChange={() => setPriceRange('30to60')}
                  />
                  <span>30€ - 60€</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'over60'}
                    onChange={() => setPriceRange('over60')}
                  />
                  <span>Plus de 60€</span>
                </label>
              </div>
            </div>
          </aside>

          <div className="shop-content">
            {currentProducts.length === 0 ? (
              <div className="no-products">
                <i className='bx bx-package'></i>
                <p>Aucun produit trouvé</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
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

export default Shop;
