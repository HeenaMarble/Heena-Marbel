"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { getSiteSettings } from '@/lib/actions/content-actions';

// Fallbacks match the previously-hardcoded copy exactly, so if settings
// haven't loaded yet (or a field is blank), nothing looks broken.
const DEFAULTS = {
  phone: '+91 87693 86438',
  phone_2: '+91 98295 06544',
  phone_3: '+91 77377 86059',
  whatsapp_number: '+91 87693 86438',
  email: 'shahid@heenamarble.com',
  website_url: 'www.heenamarble.com',
  address: '9th Street, Palada Road,\nMakrana Rajasthan 341505',
  instagram_url: 'https://www.instagram.com/heena_marble/reels/',
  facebook_url: 'https://www.facebook.com/HeenaMarble',
  footer_tagline: 'Crafting timeless beauty in marble.',
  footer_strip_text: 'AUTHENTIC MAKRANA MARBLE • MASTER CRAFTSMANSHIP • GLOBAL SHIPPING',
  copyright_name: 'Heena Marble',
};

function renderMultiline(text) {
  return String(text)
    .split('\n')
    .map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
}

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    services: false,
    contact: false,
    followUs: false,
  });

  useEffect(() => {
    let cancelled = false;
    getSiteSettings()
      .then((data) => {
        if (!cancelled && data) setSettings(data);
      })
      .catch((err) => {
        console.error('Failed to load site settings for footer:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const s = (key) => (settings && settings[key]) || DEFAULTS[key];

  const toggleSection = (key) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.preFooterBanner}>
        <div className="container">
          <p>{s('footer_strip_text')}</p>
        </div>
      </div>
      
      {/* Center-Aligned Luxury Brand Header */}
      <div className={styles.brandHeader}>
        <div className="container">
          <div className={styles.brandCenter}>
            <img src="/logo.png" alt="Heena Marble Logo" className={styles.logoImage} />
            <p className={styles.tagline}>{s('footer_tagline')}</p>
            <div className={styles.brandDivider}>
              <span className={styles.dividerLine}></span>
              <span className={styles.dividerDiamond}>◆</span>
              <span className={styles.dividerLine}></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`container ${styles.footerGrid}`}>
        {/* Quick Links */}
        <div className={styles.linkGroup}>
          <button 
            type="button" 
            className={styles.accordionHeader} 
            onClick={() => toggleSection('quickLinks')}
            aria-expanded={openSections.quickLinks}
          >
            <h4>Quick Links</h4>
            <span className={`${styles.accordionIcon} ${openSections.quickLinks ? styles.iconRotated : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
          </button>
          <div className={`${styles.accordionContent} ${openSections.quickLinks ? styles.isOpen : ''}`}>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#services">Services</Link></li>
              <li><Link href="#projects">Our Work</Link></li>
              <li><Link href="#contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Services */}
        <div className={styles.linkGroup}>
          <button 
            type="button" 
            className={styles.accordionHeader} 
            onClick={() => toggleSection('services')}
            aria-expanded={openSections.services}
          >
            <h4>Our Services</h4>
            <span className={`${styles.accordionIcon} ${openSections.services ? styles.iconRotated : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
          </button>
          <div className={`${styles.accordionContent} ${openSections.services ? styles.isOpen : ''}`}>
            <ul>
              <li>Marble Carving</li>
              <li>Inlay Work</li>
              <li>Handicrafts</li>
              <li>Custom Designs</li>
              <li>Temples & Religious Structures</li>
              <li>Home Temples & More</li>
            </ul>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className={styles.linkGroup}>
          <button 
            type="button" 
            className={styles.accordionHeader} 
            onClick={() => toggleSection('contact')}
            aria-expanded={openSections.contact}
          >
            <h4>Contact Info</h4>
            <span className={`${styles.accordionIcon} ${openSections.contact ? styles.iconRotated : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
          </button>
          <div className={`${styles.accordionContent} ${openSections.contact ? styles.isOpen : ''}`}>
            <ul className={styles.contactList}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div>
                  {renderMultiline([s('phone'), s('phone_2'), s('phone_3')].filter(Boolean).join('\n'))}
                </div>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{s('email')}</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span>{s('website_url')}</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div>
                  {renderMultiline(s('address'))}
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Socials */}
        <div className={styles.linkGroup}>
          <button 
            type="button" 
            className={styles.accordionHeader} 
            onClick={() => toggleSection('followUs')}
            aria-expanded={openSections.followUs}
          >
            <h4>Follow Us</h4>
            <span className={`${styles.accordionIcon} ${openSections.followUs ? styles.iconRotated : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
          </button>
          <div className={`${styles.accordionContent} ${openSections.followUs ? styles.isOpen : ''}`}>
            <div className={styles.socialIcons}>
              <a href={s('instagram_url')} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <div className={styles.socialIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
              </a>
              <a href={s('facebook_url')} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
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
      </div>
      
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomFlex}`}>
          <p>© {new Date().getFullYear()} {s('copyright_name')}. All Rights Reserved.</p>
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
