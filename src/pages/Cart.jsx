import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../utils/products';

function Cart() {
  const [cart, setCart] = useState(() => getCart());

  const loadCart = () => {
    setCart(getCart());
  };

  const handleQuantityChange = (index, newQuantity) => {
    updateCartItem(index, newQuantity);
    loadCart();
  };

  const handleRemove = (index) => {
    removeFromCart(index);
    loadCart();
  };

  const handleClearCart = () => {
    if (window.confirm('Vider tout le panier ?')) {
      clearCart();
      loadCart();
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? (subtotal >= 100 ? 0 : 5.99) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <i className='bx bx-cart'></i>
          <h2>VOTRE PANIER EST VIDE</h2>
          <p>Découvrez nos produits et commencez vos achats</p>
          <Link to="/shop" className="btn btn-primary">BOUTIQUE</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>PANIER</h1>
          <button onClick={handleClearCart} className="btn-clear">
            <i className='bx bx-trash'></i> Vider le panier
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <Link to={`/product/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <div className="cart-item-specs">
                    <span>Taille: {item.size}</span>
                    <span>Couleur: {item.color}</span>
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                    className="qty-btn"
                  >
                    <i className='bx bx-minus'></i>
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                    className="qty-btn"
                  >
                    <i className='bx bx-plus'></i>
                  </button>
                </div>

                <div className="cart-item-price">
                  {(item.price * item.quantity).toFixed(2)} €
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className="btn-remove"
                  aria-label="Supprimer"
                >
                  <i className='bx bx-x'></i>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>RÉSUMÉ</h3>
            <div className="summary-line">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="summary-line">
              <span>Livraison</span>
              <span>{shipping === 0 ? 'GRATUIT' : `${shipping.toFixed(2)} €`}</span>
            </div>
            {subtotal < 100 && subtotal > 0 && (
              <p className="shipping-note">
                <i className='bx bx-info-circle'></i>
                Livraison gratuite à partir de 100€
              </p>
            )}
            <div className="summary-total">
              <span>TOTAL</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button className="btn btn-primary btn-checkout" onClick={() => alert('Fonction de paiement à venir!')}>
              COMMANDER
            </button>
            <Link to="/shop" className="btn btn-secondary">
              CONTINUER MES ACHATS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
