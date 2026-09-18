"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from '../signin/Auth.module.css';

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className={styles.authMain}>
        <div className={styles.topBanner}>
          Authentic Makrana Marble • Heena Marble Client Portal
        </div>
        
        <div className={styles.authSplitLayout}>
          <div className={styles.formSection}>
            <div className={styles.authContainer}>
              <div className={styles.authHeader}>
                <div className={styles.iconWrapper}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path>
                  </svg>
                </div>
                <h2>Create Account</h2>
                <p>Join the Sacred Sanctuary to track orders and save favorites</p>
              </div>

              <form className={styles.authForm} onSubmit={(e) => { e.preventDefault(); alert("Account created"); }}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <input type="password" placeholder="Create a password" required />
                </div>
                <button type="submit" className={styles.submitBtn}>Create Account</button>
              </form>

              <div className={styles.authFooter}>
                <p>Already have an account? <Link href="/signin">Sign in</Link></p>
              </div>
            </div>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}></div>
            <img src="/temple1.jpg" alt="Makrana Marble Temple" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
