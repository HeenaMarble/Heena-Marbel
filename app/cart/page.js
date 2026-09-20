"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import styles from './Cart.module.css';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-section)' }}>
        
        <section className={styles.heroSection}>
          <div className={`container text-center ${styles.heroContent}`}>
            <span className="subheading" style={{ color: 'var(--primary-color)', letterSpacing: '3px' }}>YOUR SHOPPING BAG</span>
            <h1 className="heading" style={{ fontSize: '3.5rem', margin: '15px 0', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>Review Your Masterpieces</h1>
          </div>
        </section>

        <section className={`section ${styles.cartSection}`}>
          <div className="container">
            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyIconWrapper}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h2>Your bag is empty</h2>
                <p>Discover our exclusive collection of premium stone artifacts and add them to your bag.</p>
                <Link href="/shop" className={`btn-primary ${styles.continueShoppingBtn}`}>
                  Explore Masterpieces
                </Link>
              </div>
            ) : (
              <div className={styles.cartLayout}>
                <div className={styles.cartItems}>
                  <div className={styles.cartHeader}>
                    <div className={styles.colProduct}>Product</div>
                    <div className={styles.colPrice}>Price</div>
                    <div className={styles.colQty}>Quantity</div>
                    <div className={styles.colTotal}>Total</div>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.cartRow}>
                      <div className={`${styles.colProduct} ${styles.productDetails}`}>
                        <div className={styles.imageWrapper}>
                          <img src={item.img} alt={item.title} className={styles.productImage} />
                        </div>
                        <div className={styles.productMeta}>
                          <Link href={`/shop/${item.id}`} className={styles.productTitle}>{item.title}</Link>
                          <span className={styles.productMaterial}>Authentic Makrana Marble</span>
                          <button onClick={() => removeFromCart(item.id)} className={styles.removeBtn}>Remove</button>
                        </div>
                      </div>
                      
                      <div className={styles.colPrice}>
                        ₹{item.price.toLocaleString()}
                      </div>
                      
                      <div className={styles.colQty}>
                        <div className={styles.qtyControl}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      
                      <div className={styles.colTotal}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  <div className={styles.cartFooter}>
                    <Link href="/shop" className={styles.continueLink}>
                      Continue Shopping
                    </Link>
                  </div>
                </div>
                
                <div className={styles.orderSummary}>
                  <h3>Order Summary</h3>
                  
                  <div className={styles.summaryBody}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Shipping Estimate</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Tax Estimate</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <hr className={styles.summaryDivider} />
                  
                  <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                    <span>Estimated Total</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  
                  <button className={`btn-primary ${styles.checkoutBtn}`}>
                    Proceed to Secure Checkout
                  </button>
                  
                  <div className={styles.secureCheckout}>
                    <div className={styles.secureIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <span>SSL Secured & Encrypted Checkout</span>
                  </div>
                  
                  <div className={styles.paymentMethods}>
                    <span>We Accept</span>
                    <div className={styles.paymentIcons}>
                      <div className={styles.payIcon}>VISA</div>
                      <div className={styles.payIcon}>MC</div>
                      <div className={styles.payIcon}>AMEX</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
