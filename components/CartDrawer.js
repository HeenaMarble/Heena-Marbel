"use client";

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={toggleCart}></div>
      <div className={styles.drawer}>
        
        <div className={styles.header}>
          <h3>Your Cart</h3>
          <button className={styles.closeBtn} onClick={toggleCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is currently empty.</p>
              <button className="btn-primary" onClick={toggleCart} style={{marginTop: '20px'}}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.title}</h4>
                    <p className={styles.price}>₹{item.price.toLocaleString()}</p>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <strong>₹{cartTotal.toLocaleString()}</strong>
            </div>
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout.</p>
            <button className={`btn-primary ${styles.checkoutBtn}`}>
              Proceed to Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
