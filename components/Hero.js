import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
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
          <span className="subheading">CRAFTING TIMELESS BEAUTY IN MARBLE</span>
          <h1 className={styles.title}>TILAK STONE ARTS</h1>
          <div className={styles.subtitleWrapper}>
            <span className={styles.line}></span>
            <span className={styles.subtitle}>MAKRANA RAJASTHAN</span>
            <span className={styles.line}></span>
          </div>
          <p className={styles.description}>
            We create masterpieces in marble with precision, passion and perfection. From temples to homes, we bring tradition and craftsmanship to life.
          </p>
          
          <div className={styles.actions}>
            <Link href="#contact" className="btn-primary">
              Get a Free Quote
            </Link>
            <Link href="#projects" className="btn-outline">
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.bottomBadges}>
        <div className="container">
          <div className={styles.badgesWrapper}>
            <div className={styles.badgeGroup}>
              <div className={styles.badge}>
                <img src="https://cdn-icons-png.flaticon.com/512/1000/1000966.png" alt="Carving" className={styles.badgeIcon} style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
                <span>MARBLE CARVING</span>
              </div>
              <div className={styles.badge}>
                <img src="https://cdn-icons-png.flaticon.com/512/3673/3673322.png" alt="Inlay" className={styles.badgeIcon} style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
                <span>INLAY WORK</span>
              </div>
              <div className={styles.badge}>
                <img src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png" alt="Handicraft" className={styles.badgeIcon} style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
                <span>HANDICRAFTS</span>
              </div>
              <div className={styles.badge}>
                <img src="https://cdn-icons-png.flaticon.com/512/1076/1076335.png" alt="Custom" className={styles.badgeIcon} style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
                <span>CUSTOM DESIGNS</span>
              </div>
            </div>
            
            <div className={styles.locationBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Makrana, Rajasthan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
