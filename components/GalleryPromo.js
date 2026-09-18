import styles from './GalleryPromo.module.css';
import Link from 'next/link';

export default function GalleryPromo() {
  return (
    <section className={`section ${styles.galleryPromo}`}>
      <div className="container">
        <div className={styles.grid}>
          
          {/* Left: Video */}
          <div className={styles.videoBox}>
            <video 
              src="/construction.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.videoPlayer}
            />
            <div className={styles.videoOverlay}>
              <div className={styles.videoText}>
                <h4>Watch Our Work</h4>
                <span>On YouTube</span>
              </div>
            </div>
          </div>

          {/* Center: Text */}
          <div className={styles.centerText}>
            <span className="subheading">See Our Craftsmanship</span>
            <h2 className="heading" style={{marginBottom: '1rem'}}>Gallery & Projects</h2>
            <p>Explore our latest work and get inspired by the beauty of marble.</p>
            <Link href="#gallery" className="btn-primary" style={{marginTop: '20px'}}>
              View Gallery
            </Link>
          </div>

          {/* Right: Quote */}
          <div className={styles.quoteBox}>
            <img src="/temple1.jpg" alt="Marble Pillar" />
            <div className={styles.quoteOverlay}>
              <blockquote>
                "Marble is not just a stone, it's a story of tradition, faith and timeless beauty."
              </blockquote>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
