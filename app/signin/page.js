"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './Auth.module.css';

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className={styles.authMain}>
        <div className={styles.topBanner}>
          Authentic Makrana Marble • Heena Marble Client Portal
        </div>
        
        <div className={styles.authSplitLayout}>
          <div className={styles.imageSection}>
            <div className={styles.imageOverlay}></div>
            <img src="/temple2.jpg" alt="Makrana Marble Texture" />
          </div>
          
          <div className={styles.formSection}>
            <div className={styles.authContainer}>
              <div className={styles.authHeader}>
                <div className={styles.iconWrapper}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path>
                  </svg>
                </div>
                <h2>Welcome Back</h2>
                <p>Sign in to your Sacred Sanctuary account</p>
              </div>

              <form className={styles.authForm} onSubmit={(e) => { e.preventDefault(); alert("Sign in submitted"); }}>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="Enter your email" required />
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.passwordHeader}>
                    <label>Password</label>
                    <Link href="#" className={styles.forgotLink}>Forgot password?</Link>
                  </div>
                  <input type="password" placeholder="Enter your password" required />
                </div>
                <button type="submit" className={styles.submitBtn}>Sign In</button>
              </form>

              <div className={styles.authFooter}>
                <p>Don't have an account? <Link href="/register">Create one</Link></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
