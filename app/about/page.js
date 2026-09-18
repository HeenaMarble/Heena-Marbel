"use client";

import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        
        <section className={styles.hero}>
          <div className="container">
            <span className="subheading">OUR STORY</span>
            <h1 className="heading" style={{ fontSize: '3.5rem', margin: '15px 0', color: '#fff' }}>The Legacy of Heena Marble</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
              Crafting timeless masterpieces from the finest Makrana marble for over three generations.
            </p>
          </div>
        </section>

        <section className={`section ${styles.content}`}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.imageWrapper}>
                <img src="/temple1.jpg" alt="Marble Crafting" />
              </div>
              <div className={styles.text}>
                <h3>Heritage & Craftsmanship</h3>
                <p>
                  At Heena Marble, we believe that every block of stone has a soul. Based in the heart of Makrana, Rajasthan, we have dedicated our lives to preserving the ancient art of marble carving.
                </p>
                <p>
                  Our artisans are masters of their trade, creating intricate temples, elegant statues, and premium flooring that stand as testaments to architectural beauty and devotion.
                </p>
              </div>
            </div>

            <div className={styles.timeline}>
              <h3>Our Journey</h3>
              <div className={styles.timelineGrid}>
                <div className={styles.timelineCard}>
                  <span className={styles.year}>1985</span>
                  <h4>Foundation</h4>
                  <p>Started as a small workshop in Makrana, hand-carving custom idols.</p>
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.year}>2005</span>
                  <h4>Expansion</h4>
                  <p>Opened our first major showroom and began taking large-scale temple architecture projects.</p>
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.year}>2024</span>
                  <h4>Global Reach</h4>
                  <p>Now delivering premium marble crafts and flooring solutions worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className={`section ${styles.valuesSection}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="subheading">OUR PILLARS</span>
              <h2 className="heading text-center">Core Values</h2>
            </div>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/></svg>
                </div>
                <h4>Purity</h4>
                <p>We source only 100% authentic, unadulterated Makrana marble for all our crafts.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M6 18v4"/><path d="M10 18v4"/><path d="M14 18v4"/><path d="M18 18v4"/><path d="M4 14h16"/><path d="M6 14v-9"/><path d="M10 14v-9"/><path d="M14 14v-9"/><path d="M18 14v-9"/><path d="m2 5 10-3 10 3v4H2Z"/></svg>
                </div>
                <h4>Heritage</h4>
                <p>Preserving centuries-old carving techniques passed down through generations.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
                </div>
                <h4>Craftsmanship</h4>
                <p>Our artisans are absolute masters of detail, turning raw stone into divine art.</p>
              </div>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h4>Durability</h4>
                <p>Our stone withstands the test of time, guaranteed to last for generations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Makrana Process */}
        <section className={`section ${styles.processSection}`}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.text}>
                <span className="subheading">HOW WE WORK</span>
                <h2 className="heading">The Makrana Process</h2>
                <div className={styles.processList}>
                  <div className={styles.processItem}>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <h4>Sourcing the Best Stone</h4>
                      <p>We hand-pick the finest blocks directly from the historic Makrana mines.</p>
                    </div>
                  </div>
                  <div className={styles.processItem}>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <h4>Precision Carving</h4>
                      <p>Master artisans use both traditional chisels and modern tools to shape the stone.</p>
                    </div>
                  </div>
                  <div className={styles.processItem}>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <h4>Polishing & Refining</h4>
                      <p>The marble is polished to a natural, mirror-like finish without artificial chemicals.</p>
                    </div>
                  </div>
                  <div className={styles.processItem}>
                    <div className={styles.stepNum}>4</div>
                    <div>
                      <h4>Global Delivery</h4>
                      <p>Safely packed in custom wooden crates and shipped securely to your doorstep worldwide.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.imageWrapper}>
                <img src="/temple2.jpg" alt="Marble Carving Process" style={{ height: '100%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Master Artisans */}
        <section className={`section ${styles.artisansSection}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className="subheading">THE HANDS BEHIND THE ART</span>
              <h2 className="heading text-center">Meet Our Master Craftsmen</h2>
              <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-light)' }}>
                Behind every breathtaking temple and intricately carved statue is a master artisan who has dedicated their life to the stone.
              </p>
            </div>
            <div className={styles.artisansGrid}>
              <div className={styles.artisanCard}>
                <div className={styles.artisanImg}>
                  <img src="/temple3.jpg" alt="Artisan Work" />
                </div>
                <h4>Divine Sculpting</h4>
                <p>Bringing idols to life with profound devotion.</p>
              </div>
              <div className={styles.artisanCard}>
                <div className={styles.artisanImg}>
                  <img src="/fountain.jpg" alt="Artisan Work" />
                </div>
                <h4>Architectural Carving</h4>
                <p>Creating majestic pillars, arches, and jali work.</p>
              </div>
              <div className={styles.artisanCard}>
                <div className={styles.artisanImg}>
                  <img src="/elephant.jpg" alt="Artisan Work" />
                </div>
                <h4>Inlay & Polishing</h4>
                <p>Mastering the art of seamless finishes and shine.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
