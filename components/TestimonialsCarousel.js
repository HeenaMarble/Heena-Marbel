"use client";
import { useRef } from 'react';
import styles from './TestimonialsContact.module.css';

export default function TestimonialsCarousel({ testimonials }) {
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

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.arrowBtn} onClick={scrollLeft} aria-label="Previous testimonials">
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
            <p className={styles.quoteText}>{t.message}</p>
            <div className={styles.stars}>
              {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
            </div>
            <div className={styles.author}>
              <strong>{t.name}</strong>
              <span>{t.location}</span>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.arrowBtn} onClick={scrollRight} aria-label="Next testimonials">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
