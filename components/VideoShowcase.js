import styles from './VideoShowcase.module.css';

export default function VideoShowcase() {
  return (
    <section className={`section ${styles.videoSection}`}>
      <div className="container">
        <h2 className="section-title">Virtual Tours & Craftsmanship</h2>
        <p className={styles.description}>
          Experience the divine aura of our temples and witness the intricate artisanship behind every masterpiece through our immersive video gallery.
        </p>

        <div className={styles.videoGrid}>
          {/* Main featured video */}
          <div className={styles.featuredVideo}>
            <div className={styles.videoWrapper}>
              {/* Replace src with actual client video later */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" 
                title="Virtual Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <h3 className={styles.videoTitle}>360° Temple Virtual Tour</h3>
            <p className={styles.videoDesc}>Take a comprehensive virtual walk through one of our recently completed magnificent marble temple projects.</p>
          </div>

          {/* Secondary videos */}
          <div className={styles.secondaryVideos}>
            <div className={styles.videoCard}>
              <div className={styles.thumbnailWrapper}>
                <img src="/temple1.jpg" alt="Making of Murti" />
                <div className={styles.playButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <h4>The Making of a Marble Murti</h4>
            </div>
            
            <div className={styles.videoCard}>
              <div className={styles.thumbnailWrapper}>
                <img src="/temple2.jpg" alt="Factory Tour" />
                <div className={styles.playButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <h4>Behind the Scenes: Our Workshop</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
