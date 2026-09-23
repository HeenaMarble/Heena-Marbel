"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ShopSection.module.css';

import { PRODUCTS } from '@/data/products';

export default function ShopSection() {
  const { addToCart } = useCart();

  return (
    <section id="shop" className={`section ${styles.shopSection}`}>
      <div className="container">
        <div className={`${styles.header} ${styles.headerWithBg}`}>
          <div>
            <span className="subheading">ONLINE STORE</span>
            <h2 className={`heading ${styles.shopHeading}`}>Featured Masterpieces</h2>
          </div>
          <Link href="/shop" className="btn-outline">View All Products</Link>
        </div>
        
        <div className={styles.grid}>
          {PRODUCTS.slice(0, 4).map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Link href={`/shop/${product.id}`}>
                  <img src={product.img} alt={product.title} />
                </Link>
              </div>
              <div className={styles.details}>
                <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{product.title}</h3>
                </Link>
                <div className={styles.cardRating}>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starHalf}>★</span>
                  <span className={styles.reviewCount}>(24)</span>
                </div>
                <div className={styles.priceRow}>
                  <div className={styles.priceGroup}>
                    <span className={styles.price}>₹{product.price.toLocaleString()}</span>
                    {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                      <span className={styles.comparePrice}>
                        ₹{Number(product.compare_at_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button 
                    className={styles.inlineAddBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '5px', flexShrink: 0}}>
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
