"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

import CartIcon from './CartIcon';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Reels', path: '/reels' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logo}>
          {/* Mobile Hamburger Button */}
          <button 
            className={styles.hamburgerBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <Link href="/" className={styles.logoImageLink}>
            <img src="/logo.png" alt="Heena Marble Logo" className={styles.logoImage} />
          </Link>
        </div>
        
        <nav className={styles.navLinks}>
          {navItems.map((item) => {
            // Treat the current route as active if the pathname starts with the item's path (for nested routes like /projects/the-grand-mandir), except for Home '/'
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            return (
              <Link key={item.name} href={item.path} className={isActive ? styles.active : ''}>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={styles.navAction}>
          <div className={styles.searchBar}>
            <button 
              className={styles.searchButton} 
              aria-label="Search"
              onClick={() => {
                if (window.innerWidth <= 992) {
                  setIsMobileMenuOpen(true);
                } else {
                  document.querySelector(`.${styles.searchInput}`)?.focus();
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input type="text" placeholder="Search..." className={styles.searchInput} />
          </div>
          
          <div className={styles.userMenuContainer} ref={profileRef}>
            <button 
              className={styles.userButton} 
              aria-label="User Profile"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            
            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"></path>
                  </svg>
                </div>
                <h3>Sacred Sanctuary</h3>
                <p>Sign in to track orders, save favorites & consultations</p>
                <Link href="/signin" className={styles.signInBtn} onClick={() => setIsProfileOpen(false)}>Sign In</Link>
                <Link href="/register" className={styles.createAccBtn} onClick={() => setIsProfileOpen(false)}>Create Account</Link>
              </div>
            )}
          </div>

          <CartIcon />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuHeader}>
            <Link href="/" className={styles.logoImageLink} onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/logo.png" alt="Heena Marble Logo" className={styles.logoImage} />
            </Link>
            <button 
              className={styles.closeMenuBtn}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className={styles.mobileSearch}>
            <input type="text" placeholder="Search..." className={styles.mobileSearchInput} />
          </div>

          <nav className={styles.mobileNavLinks}>
            {navItems.map((item) => {
              const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <Link 
                  key={item.name} 
                  href={item.path} 
                  className={isActive ? styles.activeMobile : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className={styles.mobileDivider}></div>
            <Link href="/signin" className={styles.mobileAuthLink} onClick={() => setIsMobileMenuOpen(false)}>Sign In / Register</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
