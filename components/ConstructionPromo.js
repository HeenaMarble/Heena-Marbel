"use client";

import styles from './ConstructionPromo.module.css';

export default function ConstructionPromo() {
  return (
    <section className={styles.section}>
      <div className={styles.videoContainer}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.videoBg}
        >
          <source src="/vid1.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay}></div>
      </div>

      <div className={styles.contentWrapper}>
        <div className="container">
          <div className={styles.content}>
            <span className={styles.subheading}>ON-SITE EXCELLENCE</span>
            <h2 className={styles.heading}>Precision Construction</h2>
            <p className={styles.text}>
              Witness the mastery of our artisans as they bring architectural visions to life right at the construction site. From raw blocks of Makrana marble to towering pillars and intricate domes, every step is executed with divine precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
