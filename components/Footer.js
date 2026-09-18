"use client";

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.preFooterBanner}>
        <div className="container">
          <p>AUTHENTIC MAKRANA MARBLE &nbsp; • &nbsp; MASTER CRAFTSMANSHIP &nbsp; • &nbsp; GLOBAL SHIPPING</p>
        </div>
      </div>
      <div className={`container ${styles.footerGrid}`}>
        
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Heena Marble Logo" className={styles.logoImage} />
          </div>
          <p className={styles.tagline}>Crafting timeless beauty in marble.</p>
        </div>
        
        {/* Quick Links */}
        <div className={styles.linkGroup}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#services">Services</Link></li>
            <li><Link href="#projects">Our Work</Link></li>
            <li><Link href="#contact">Contact</Link></li>
          </ul>
        </div>
        
        {/* Services */}
        <div className={styles.linkGroup}>
          <h4>Our Services</h4>
          <ul>
            <li>Marble Carving</li>
            <li>Inlay Work</li>
            <li>Handicrafts</li>
            <li>Custom Designs</li>
            <li>Temples & Religious Structures</li>
            <li>Home Temples & More</li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div className={styles.linkGroup}>
          <h4>Contact Info</h4>
          <ul className={styles.contactList}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +91 87693 86438
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              shahid@heenamarble.com
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              www.heenamarble.com
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              9th Street, Palada Road,<br/>Makrana Rajasthan 341505
            </li>
          </ul>
        </div>
        
        {/* Socials */}
        <div className={styles.linkGroup}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="https://www.instagram.com/heena_marble/reels/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </a>
            <a href="https://www.facebook.com/HeenaMarble" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <div className={styles.socialIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
            </a>
          </div>
          <p className={styles.socialText}>Stay connected for latest updates and new projects.</p>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomFlex}`}>
          <p>&copy; {new Date().getFullYear()} Heena Marble. All Rights Reserved.</p>
          <div className={styles.bottomLinks}>
            <span>Tradition</span>
            <span className={styles.separator}>|</span>
            <span>Craftsmanship</span>
            <span className={styles.separator}>|</span>
            <span>Trust</span>
          </div>
          <button className={styles.scrollTop} onClick={() => window.scrollTo(0,0)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
