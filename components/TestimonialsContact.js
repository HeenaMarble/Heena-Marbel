import styles from './TestimonialsContact.module.css';
import TestimonialsCarousel from './TestimonialsCarousel';
import { getPublicTestimonials } from '@/lib/actions/content-actions';

// Server Component — fetches live testimonials from Supabase at request time
export default async function TestimonialsContact() {
  const testimonials = await getPublicTestimonials();

  return (
    <section className={`section ${styles.tcSection}`}>
      <div className="container">

        {/* Testimonials Section */}
        <div className={styles.testimonialsFull}>
          <div className={styles.headerCentered}>
            <span className="subheading">TESTIMONIALS</span>
            <h2 className={`heading ${styles.testimonialsHeading}`}>What Our Clients Say</h2>
          </div>

          {/* Client component handles scroll interactivity */}
          <TestimonialsCarousel testimonials={testimonials} />
        </div>

        {/* Div2 Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.videoText}>
            <span className="subheading">OUR CRAFT</span>
            <h2 className={`heading ${styles.craftHeading}`}>Unveiling the Beauty of Makrana</h2>
            <p>
              Watch as our master artisans shape raw, premium Makrana marble into divine structures.
              Our commitment to quality ensures every cut, polish, and carving meets the highest standards of heritage architecture.
            </p>
          </div>
          <div className={styles.videoWrapper}>
            <video autoPlay loop muted playsInline>
              <source src="/div2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.contactFull}>
          <span className="subheading">Let's Build Something Beautiful</span>
          <h2 className={`heading ${styles.contactHeading}`}>Get in Touch Today</h2>
          <p className={styles.desc}>
            Whether it's a temple, home or a custom design, we are here to help you.
          </p>

          <div className={styles.actions}>
            <a href="tel:+918769386438" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +91 87693 86438
            </a>
            <a href="https://wa.me/918769386438" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
