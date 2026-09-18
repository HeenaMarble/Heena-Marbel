"use client";

import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import styles from '@/components/ShopSection.module.css';

export default function ShopPage() {
  const { addToCart } = useCart();

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        <section className={`section ${styles.shopSection}`} style={{ paddingTop: '20px' }}>
          <div className="container">
            <div className={`${styles.header} ${styles.headerWithBg}`}>
              <div>
                <span className="subheading">OUR COMPLETE CATALOG</span>
                <h2 className="heading">Shop All Products</h2>
              </div>
            </div>
            
            <div className={styles.grid}>
              {PRODUCTS.map((product) => (
                <div key={product.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={product.img} alt={product.title} />
                    <button 
                      className={styles.quickAdd}
                      onClick={() => addToCart(product)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                  <div className={styles.details}>
                    <h3>{product.title}</h3>
                    <p className={styles.desc}>{product.desc}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
