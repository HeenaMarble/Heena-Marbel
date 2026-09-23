"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from '@/components/ShopSection.module.css';

export default function ShopGrid({ products }) {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return (
      <p style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary, #666)' }}>
        No products available right now. Check back soon.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
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
  );
}
