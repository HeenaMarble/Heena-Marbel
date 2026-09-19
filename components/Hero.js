import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.heroWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className={styles.bgVideo}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className={styles.overlay}></div>
        </div>
        
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.content}>
            <span className={`subheading ${styles.heroSubheading}`}>CRAFTING TIMELESS BEAUTY IN MARBLE</span>
            <h1 className={styles.title}>HEENA MARBLE</h1>
            <div className={styles.subtitleWrapper}>
              <span className={styles.line}></span>
              <span className={styles.subtitle}>MAKRANA RAJASTHAN</span>
              <span className={styles.line}></span>
            </div>
            <p className={styles.description}>
              We create masterpieces in marble with precision, passion and perfection. From temples to homes, we bring tradition and craftsmanship to life.
            </p>
            
            <div className={styles.actions}>
              <Link href="/contact" className="btn-primary">
                Get a Free Quote
              </Link>
              <Link href="/projects" className="btn-outline">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Badges Strip - Option 2: Luxury Minimalist Hairline Grid */}
      <div className={styles.bottomBadges}>
        <div className="container">
          <div className={styles.badgesWrapper}>
            <div className={styles.badgeGrid}>
              <div className={styles.badgeItem}>
                <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6a3 3 0 0 1 6 0v6" />
                </svg>
                <span className={styles.badgeTitle}>Marble Carving</span>
              </div>

              <div className={styles.badgeItem}>
                <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h12l4 6-10 12L2 9z" />
                  <path d="M2 9h20M10 3l-4 6 6 12 6-12-4-6" />
                </svg>
                <span className={styles.badgeTitle}>Inlay Work</span>
              </div>

              <div className={styles.badgeItem}>
                <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v2a3 3 0 0 1-1 2.24V9a4 4 0 0 1 2 3.46v3.08a4 4 0 0 1-2 3.46H10a4 4 0 0 1-2-3.46v-3.08A4 4 0 0 1 10 9V7.24A3 3 0 0 1 9 5V3z" />
                  <path d="M8 21h8" />
                </svg>
                <span className={styles.badgeTitle}>Handicrafts</span>
              </div>

              <div className={styles.badgeItem}>
                <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                </svg>
                <span className={styles.badgeTitle}>Custom Designs</span>
              </div>
            </div>

            <div className={styles.locationBar}>
              <span className={styles.locationLine}></span>
              <div className={styles.locationTag}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Makrana, Rajasthan</span>
              </div>
              <span className={styles.locationLine}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
