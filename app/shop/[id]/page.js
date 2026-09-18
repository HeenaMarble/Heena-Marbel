"use client";

import React, { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductDetail.module.css';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Product Not Found</h1>
          <Link href="/shop" className="btn-primary" style={{ marginTop: '20px' }}>Return to Shop</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh', backgroundColor: 'var(--bg-section)' }}>
        
        <div className="container" style={{ padding: '40px 0' }}>
          <Link href="/shop" className={styles.backLink}>
            Back to Shop
          </Link>
          
          <div className={styles.productLayout}>
            <div className={styles.imageColumn}>
              <div className={styles.imageWrapper}>
                <img src={product.img} alt={product.title} className={styles.mainImage} />
              </div>
            </div>
            
            <div className={styles.detailsColumn}>
              <span className={styles.category}>AUTHENTIC MAKRANA MARBLE</span>
              <h1 className={styles.title}>{product.title}</h1>
              <p className={styles.price}>₹{product.price.toLocaleString()}</p>
              
              <div className={styles.description}>
                <h3>Product Details</h3>
                <p>{product.desc}</p>
                <p>Crafted by master artisans in Makrana, Rajasthan, this piece represents the pinnacle of traditional Indian stone carving. Perfect for elevating your interior or exterior spaces.</p>
              </div>
              
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Premium Quality White Marble</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Hand-carved with intricate detailing</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Durable and weather-resistant</span>
                </div>
              </div>
              
              <button 
                className={`btn-primary ${styles.addToCartBtn}`}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              
              <div className={styles.secureInfo}>
                <p>Shipping & taxes calculated at checkout.</p>
                <div className={styles.guaranteeBox}>
                  <strong>100% Authenticity Guarantee</strong>
                  <p>All our products are carved from authentic, certified Makrana marble.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.reviewsContainer}>
            <div className={styles.reviewsList}>
              <h3>Customer Reviews</h3>
              <div className={styles.overallRating}>
                <div className={styles.stars}>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starHalf}>★</span>
                </div>
                <span>4.8 based on 24 reviews</span>
              </div>
              
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>Rahul Sharma</span>
                  <span className={styles.reviewDate}>2 weeks ago</span>
                </div>
                <div className={styles.stars}>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                </div>
                <p className={styles.reviewText}>Absolutely stunning craftsmanship. The details on the marble are exquisite. Highly recommended!</p>
              </div>

              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>Priya Patel</span>
                  <span className={styles.reviewDate}>1 month ago</span>
                </div>
                <div className={styles.stars}>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starFilled}>★</span>
                  <span className={styles.starEmpty}>★</span>
                </div>
                <p className={styles.reviewText}>Beautiful piece, arrived well packaged and safe. The marble quality is genuine Makrana.</p>
              </div>
            </div>

            <div className={styles.reviewForm}>
              <h3>Write a Review</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Review submitted!"); }}>
                <div className={styles.formGroup}>
                  <label>Your Rating</label>
                  <div className={styles.ratingInput}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} className={styles.starBtn}>★</button>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Review</label>
                  <textarea className={styles.textareaField} rows="4" placeholder="Share your thoughts about this masterpiece" required></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{width: '100%'}}>Submit Review</button>
              </form>
            </div>
          </div>
          
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {PRODUCTS.filter(p => p.id !== id).slice(0, 4).map((related) => (
                <div key={related.id} className={styles.relatedCard}>
                  <Link href={`/shop/${related.id}`} className={styles.relatedLink}>
                    <div className={styles.relatedImageWrapper}>
                      <img src={related.img} alt={related.title} />
                    </div>
                    <div className={styles.relatedDetails}>
                      <h4>{related.title}</h4>
                      <p className={styles.relatedPrice}>₹{related.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottomCta}>
            <h3>Looking for something else?</h3>
            <p>Discover our complete collection of authentic Makrana marble masterpieces.</p>
            <Link href="/shop" className="btn-outline" style={{ marginTop: '15px', display: 'inline-block' }}>
              Explore All Products
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
