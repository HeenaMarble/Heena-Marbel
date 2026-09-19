import styles from './AboutSection.module.css';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section id="about" className={`section ${styles.aboutSection}`}>
      <div className={`container ${styles.aboutContainer}`}>
        
        {/* Left Side: Image Showcase */}
        <div className={styles.imageCollage}>
          <div className={styles.mainImage}>
            <img 
              src="/temple1.jpg" 
              alt="Heena Marble Grand Temple" 
            />
          </div>
          
          <div className={styles.topRightImage}>
            <img 
              src="/temple2.jpg" 
              alt="Intricate Marble Carving Work" 
            />
          </div>
        </div>
        
        {/* Right Side: Content */}
        <div className={styles.content}>
          <span className="subheading">ABOUT HEENA MARBLE</span>
          <h2 className={`heading ${styles.aboutHeading}`}>A Legacy Carved in Marble</h2>
          <p className={styles.description}>
            Heena Marble is renowned for its marble carving, inlay work, handicrafts and custom designs. Based in Makrana, Rajasthan, we combine traditional artistry with modern precision to create timeless pieces for temples, mosques, gurudwaras, churches, homes and more.
          </p>
          
          <div className={styles.iconsRow}>
            <div className={styles.iconItem}>
              <img src="https://cdn-icons-png.flaticon.com/512/3233/3233483.png" alt="Tradition" style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
              <span>Traditional<br/>Craftsmanship</span>
            </div>
            <div className={styles.iconItem}>
              <img src="https://cdn-icons-png.flaticon.com/512/6182/6182747.png" alt="Quality" style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
              <span>High Quality<br/>Marble</span>
            </div>
            <div className={styles.iconItem}>
              <img src="https://cdn-icons-png.flaticon.com/512/1000/1000966.png" alt="Satisfaction" style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}/>
              <span>Customer<br/>Satisfaction</span>
            </div>
          </div>
          
          <div className={styles.actionRow}>
            <Link href="/about" className="btn-primary">
              Know More About Us
            </Link>
            
            <div className={styles.trustDivider}></div>
            
            <div className={styles.trustCounter}>
              <span className={styles.counterNumber}>35+</span>
              <div className={styles.counterDetails}>
                <span className={styles.counterLabel}>Years of Heritage</span>
                <span className={styles.counterSub}>Generations of Mastery</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
