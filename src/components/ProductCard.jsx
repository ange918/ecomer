import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image">
        <img src={product.image} alt={product.name} />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="badge badge-warning">Stock limité</span>
        )}
        {product.stock === 0 && (
          <span className="badge badge-danger">Rupture</span>
        )}
      </Link>
      
      <div className="product-info">
        <span className="product-category">{product.category.toUpperCase()}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-bottom">
          <span className="product-price">{product.price.toFixed(2)} €</span>
          <Link to={`/product/${product.id}`} className="btn-quick-view">
            <i className='bx bx-show'></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
