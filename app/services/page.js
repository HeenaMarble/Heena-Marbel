"use client";

import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './Services.module.css';

export default function ServicesPage() {
  const services = [
    {
      title: 'Temple Architecture',
      desc: 'Complete end-to-end design and construction of breathtaking marble temples for homes and communities. We specialize in traditional Makrana carving techniques.',
      img: '/temple2.jpg'
    },
    {
      title: 'Custom Statues & Idols',
      desc: 'Hand-carved deities, statues, and sculptures crafted from single blocks of premium marble, capturing intricate details and divine expressions.',
      img: '/temple3.jpg'
    },
    {
      title: 'Premium Flooring & Inlay',
      desc: 'Luxurious marble flooring solutions featuring intricate semi-precious stone inlay work (Pietra Dura) designed to elevate any architectural space.',
      img: '/temple1.jpg'
    },
    {
      title: 'Marble Fountains & Landscaping',
      desc: 'Elegant outdoor marble structures including carved fountains, garden benches, and decorative pillars that withstand the elements.',
      img: '/fountain.jpg'
    }
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        
        <section className={styles.hero}>
          <div className={styles.heroMediaWrapper}>
            <img src="/temple1.jpg" alt="Masterful Marble Services" className={styles.heroImage} />
            <div className={styles.heroOverlay}></div>
          </div>

          <div className={styles.heroContent}>
            <div className="container">
              <span className="subheading">OUR EXPERTISE</span>
              <h1 className={styles.heroTitle}>Masterful Marble Services</h1>
              
              <div className={styles.heroMediaMobile}>
                <img src="/temple1.jpg" alt="Masterful Marble Services" className={styles.heroImage} />
              </div>

              <p className={styles.heroDesc}>
                From sacred temples to luxurious interiors, our comprehensive marble services cover every aspect of stone craftsmanship.
              </p>
            </div>
          </div>
        </section>

        <section className={`section ${styles.servicesShowcase}`}>
          <div className="container" style={{ maxWidth: '1280px' }}>
            <div className={styles.sectionHeader}>
              <span className="subheading">OUR EXPERTISE</span>
              <h2 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-dark)' }}>Premium Services</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '750px', margin: '0 auto' }}>
                From sacred temples to luxurious residential interiors, we provide end-to-end architectural stone solutions. Scroll to explore our master craftsmanship.
              </p>
            </div>
              
            <div className={styles.servicesList}>
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className={`${styles.serviceRow} ${index % 2 === 1 ? styles.reverseRow : ''}`}
                >
                  <div className={styles.serviceImageWrapper}>
                    <img src={service.img} alt={service.title} />
                  </div>
                  <div className={styles.serviceContent}>
                    <div className={styles.serviceBadge}>
                      <span className={styles.serviceNumber}>0{index + 1}</span>
                      <span className={styles.badgeLine}></span>
                    </div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Heena Guarantee */}
        <section className={`section ${styles.guaranteeSection}`}>
          <div className="container">
            <div className={styles.guaranteeGrid}>
              <div className={styles.guaranteeText}>
                <span className="subheading">OUR PROMISE</span>
                <h2 className="heading">The Heena Guarantee</h2>
                <p>
                  When you choose Heena Marble for your architectural needs, you aren't just buying stone—you are investing in centuries of heritage, unmatched quality, and a commitment to perfection.
                </p>
                <ul className={styles.guaranteeList}>
                  <li>
                    <strong>✓ 100% Authentic Makrana Marble:</strong> Certified pure, unadulterated white marble that will never turn yellow.
                  </li>
                  <li>
                    <strong>✓ Master Craftsmanship:</strong> Hand-carved by artisans whose families have worked the stone for generations.
                  </li>
                  <li>
                    <strong>✓ End-to-End Service:</strong> From initial design consultation to final on-site installation, we handle everything.
                  </li>
                  <li>
                    <strong>✓ Global Reach:</strong> Secure packaging and international shipping to bring our masterpieces to your doorstep, anywhere in the world.
                  </li>
                </ul>
              </div>
              <div className={styles.guaranteeImage}>
                <img src="/artisan_chisel.jpg" alt="Marble Detailing" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={`section ${styles.ctaSection}`}>
          <div className="container text-center">
            <h2 className="heading" style={{ color: 'white' }}>Ready to Start Your Project?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 30px auto', fontSize: '1.1rem' }}>
              Whether you need a custom home temple or a massive commercial flooring project, our experts are here to guide you.
            </p>
            <Link href="/contact" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary-dark)', border: 'none' }}>
              Book a Consultation
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
