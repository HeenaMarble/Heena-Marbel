"use client";
import { useRef } from 'react';
import styles from './TestimonialsContact.module.css';

export default function TestimonialsContact() {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const testimonials = [
    { id: 1, name: 'Ramesh Sharma', location: 'Jaipur', text: 'Excellent craftsmanship and timely delivery. The quality of Makrana marble is outstanding. Highly recommended!', stars: 5 },
    { id: 2, name: 'Anjali Desai', location: 'Mumbai', text: 'They transformed our home temple into a masterpiece. The attention to detail is truly breathtaking.', stars: 5 },
    { id: 3, name: 'Vikram Singh', location: 'Delhi', text: 'Very professional team. The marble flooring they provided is top-notch and perfectly polished.', stars: 4 },
    { id: 4, name: 'Priya Patel', location: 'Ahmedabad', text: 'Beautiful intricate carving work! It looks exactly like the 3D models they showed us initially.', stars: 5 },
    { id: 5, name: 'Amit Jain', location: 'Surat', text: 'Best marble suppliers in Rajasthan. We sourced all stone for our new office building from them.', stars: 5 },
    { id: 6, name: 'Neha Gupta', location: 'Pune', text: 'The custom marble fountain they designed for our garden is stunning. Great service from start to finish.', stars: 5 },
    { id: 7, name: 'Rajesh Kumar', location: 'Udaipur', text: 'Exceptional quality and competitive pricing. Will definitely work with them again on future projects.', stars: 4 },
    { id: 8, name: 'Meera Reddy', location: 'Hyderabad', text: 'Their artisans are incredibly skilled. The statues we ordered are perfect down to the smallest detail.', stars: 5 },
    { id: 9, name: 'Sanjay Verma', location: 'Bangalore', text: 'Timely delivery and safe packaging. None of the delicate carved pieces were damaged in transit.', stars: 5 },
    { id: 10, name: 'Kavita Joshi', location: 'Indore', text: 'A truly premium experience. Their Makrana marble is authentic and gives a royal look to our home.', stars: 5 },
  ];

  return (
    <section className={`section ${styles.tcSection}`}>
      <div className="container">
        
        {/* Testimonials Section */}
        <div className={styles.testimonialsFull}>
          <div className={styles.headerCentered}>
            <span className="subheading">TESTIMONIALS</span>
            <h2 className={`heading ${styles.testimonialsHeading}`}>What Our Clients Say</h2>
          </div>
          
          <div className={styles.carouselWrapper}>
            <button className={styles.arrowBtn} onClick={scrollLeft}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className={styles.testimonialCarousel} ref={carouselRef}>
              {testimonials.map((t) => (
                <div key={t.id} className={styles.testimonialCard}>
                  <div className={styles.quoteIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <p className={styles.quoteText}>{t.text}</p>
                  <div className={styles.stars}>
                    {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
                  </div>
                  <div className={styles.author}>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.arrowBtn} onClick={scrollRight}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
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
