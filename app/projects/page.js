"use client";

import { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './Projects.module.css';

export default function ProjectsPage() {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    if (videoRef1.current) videoRef1.current.playbackRate = 0.7;
    if (videoRef2.current) videoRef2.current.playbackRate = 0.7;
  }, []);
  const projects = [
    { title: 'Sri Venkateswara Temple', desc: 'Full architectural build, Makrana White', img: '/temple2.jpg' },
    { title: 'The Royal Estate', desc: 'Premium Inlay Flooring (30,000 sq ft)', img: '/temple1.jpg' },
    { title: 'Jain Mandir, Gujarat', desc: 'Intricate ceiling carving and pillars', img: '/temple3.jpg' },
    { title: 'Luxury Hotel Lobby', desc: 'Custom fountain and centerpieces', img: '/fountain.jpg' },
    { title: 'Private Residence, Delhi', desc: 'Tulsi pot and garden landscaping', img: '/temple1.jpg' },
    { title: 'Heritage Villa', desc: 'Decorative elephant statues and entrance', img: '/elephant.jpg' }
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        
        <section className={styles.hero}>
          <div className="container">
            <span className="subheading">OUR PORTFOLIO</span>
            <h1 className="heading" style={{ fontSize: '3rem', margin: '10px 0' }}>Showcase of Masterpieces</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto' }}>
              Explore our proudest architectural achievements and custom installations across the globe.
            </p>
          </div>
        </section>

        {/* Other Projects Grid */}
        <section className={`section ${styles.content}`}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="heading text-dark">More Masterpieces</h2>
            </div>
            <div className={styles.grid}>
              {projects.map((proj, idx) => (
                <div key={idx} className={styles.projectCard}>
                  <img src={proj.img} alt={proj.title} />
                  <div className={styles.overlay}>
                    <h3>{proj.title}</h3>
                    <p>{proj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Video Project 1 */}
        <section className={styles.splitVideoSection}>
          <div className={styles.splitLayout}>
            <div className={styles.splitVideo}>
              <video ref={videoRef1} autoPlay loop muted playsInline>
                <source src="/div3.mp4" type="video/mp4" />
              </video>
            </div>
            <div className={styles.splitContent}>
              <span className="subheading">FEATURED PROJECT</span>
              <h2>The Grand Mandir</h2>
              <p>
                A monumental architectural achievement carved entirely from pure Makrana marble. This project required over two years of master craftsmanship to complete the intricate pillars and domed ceilings.
              </p>
              <button className="btn-primary" style={{ marginTop: '30px' }}>View Case Study</button>
            </div>
          </div>
        </section>

        {/* Featured Video Project 2 */}
        <section className={styles.splitVideoSection}>
          <div className={`${styles.splitLayout} ${styles.rowReverse}`}>
            <div className={styles.splitVideo}>
              <video ref={videoRef2} autoPlay loop muted playsInline>
                <source src="/div4.mp4" type="video/mp4" />
              </video>
            </div>
            <div className={styles.splitContent}>
              <span className="subheading">FEATURED PROJECT</span>
              <h2>Royal Pavilion</h2>
              <p>
                An exquisite outdoor pavilion designed for a private royal estate. Featuring seamless inlay work and ornate jali screens that play beautifully with natural light.
              </p>
              <button className="btn-primary" style={{ marginTop: '30px' }}>View Case Study</button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
