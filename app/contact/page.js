"use client";

import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './Contact.module.css';
import ContactForm from '@/components/contact/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main style={{ minHeight: '80vh' }}>
        
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className="container">
              <span className="subheading">GET IN TOUCH</span>
              <h1 className={styles.heroTitle}>Contact Heena Marble</h1>
              <p className={styles.heroDesc}>
                Have a custom project in mind? We are ready to bring your architectural visions to life.
              </p>
            </div>
          </div>

          <div className={styles.heroMediaWrapper}>
            <video autoPlay loop muted playsInline className={styles.videoBg}>
              <source src="/construction.mp4" type="video/mp4" />
            </video>
            <div className={styles.heroOverlay}></div>
          </div>
        </section>

        <section className={`section ${styles.content}`}>
          <div className="container">
            <div className={styles.grid}>
              
              <div className={styles.infoBlock}>
                <h3>Our Office</h3>
                
                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className={styles.infoText}>
                    <h4>Location</h4>
                    <p>9th Street, Palada Road,<br />Makrana, Rajasthan 341505, India</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div className={styles.infoText}>
                    <h4>Phone</h4>
                    <p>+91 87693 86438</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.iconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className={styles.infoText}>
                    <h4>Working Hours</h4>
                    <p>Monday - Saturday: 9:00 AM - 7:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className={styles.formBlock}>
                <h3>Send Us a Message</h3>
                <ContactForm />
              </div>

            </div>
          </div>
        </section>

        {/* Global Logistics Section */}
        <section className={`section ${styles.logisticsSection}`}>
          <div className="container">
            <div className={styles.logisticsCard}>
              <div className={styles.logisticsIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div className={styles.logisticsText}>
                <h2>Global Shipping & Logistics</h2>
                <p>
                  Distance is no barrier to acquiring genuine Makrana marble. We have a robust, fully insured international logistics network. Whether you are building a temple in the US, a villa in the UK, or an estate in the UAE, our custom-built, reinforced wooden crates ensure your masterpieces arrive in immaculate condition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className={`section ${styles.mapSection}`}>
          <div className="container">
            <iframe 
              src="https://maps.google.com/maps?q=Palada%20Road,%20Makrana,%20Rajasthan%20341505&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-medium)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={`section ${styles.faqSection}`}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <span className="subheading">COMMON INQUIRIES</span>
              <h2 className="heading text-dark">Frequently Asked Questions</h2>
            </div>
            
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h4>How long does a custom temple project take?</h4>
                <p>Depending on the scale and intricacy, a custom hand-carved temple can take anywhere from 3 to 12 months. We provide a detailed timeline during the consultation phase.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>Do you provide on-site installation?</h4>
                <p>Yes, for large-scale projects, we can deploy a team of our master artisans globally to oversee the final assembly and ensure flawless installation.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>How do I know the marble is pure Makrana?</h4>
                <p>We provide a certificate of authenticity with every major architectural purchase, guaranteeing the purity and high calcium content of our Makrana white marble.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>How should I clean and maintain the marble?</h4>
                <p>Makrana marble is incredibly durable and non-porous. Simply wipe it with a soft cloth and mild, pH-neutral soap. Avoid acidic cleaners, lemon, or vinegar.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
