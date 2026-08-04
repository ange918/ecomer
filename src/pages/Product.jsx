import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getProductById, addToCart } from '../utils/products';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getProductById(id), [id]);
  const [selectedSize, setSelectedSize] = useState(() => product?.sizes[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(() => product?.colors[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Réinitialiser la sélection quand on passe d'un produit à un autre, sans effet.
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setSelectedSize(product?.sizes[0] ?? '');
    setSelectedColor(product?.colors[0] ?? '');
    setQuantity(1);
  }

  // Rediriger si le produit n'existe pas (effet = navigation, pas de setState).
  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return <div className="container loading">Chargement...</div>;
  }

  return (
    <div className="product-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <i className='bx bx-arrow-back'></i> Retour
        </button>

        <div className="product-detail">
          <div className="product-image-large">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details">
            <span className="product-category">{product.category.toUpperCase()}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price-large">{product.price.toFixed(2)} €</div>

            <p className="product-description">{product.description}</p>

            <div className="product-stock">
              {product.stock > 5 ? (
                <span className="in-stock">
                  <i className='bx bx-check-circle'></i> En stock
                </span>
              ) : product.stock > 0 ? (
                <span className="low-stock">
                  <i className='bx bx-error-circle'></i> Stock limité ({product.stock} restants)
                </span>
              ) : (
                <span className="out-stock">
                  <i className='bx bx-x-circle'></i> Rupture de stock
                </span>
              )}
            </div>

            <div className="product-options">
              <div className="option-group">
                <label>TAILLE</label>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>COULEUR</label>
                <div className="color-options">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>QUANTITÉ</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    <i className='bx bx-minus'></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="qty-btn"
                  >
                    <i className='bx bx-plus'></i>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`btn btn-primary btn-add-cart ${added ? 'added' : ''}`}
            >
              {added ? (
                <>
                  <i className='bx bx-check'></i> AJOUTÉ AU PANIER
                </>
              ) : (
                <>
                  <i className='bx bx-cart'></i> AJOUTER AU PANIER
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
