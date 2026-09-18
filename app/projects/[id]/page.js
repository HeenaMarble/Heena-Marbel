"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import styles from './CaseStudy.module.css';

// Mock data for case studies
const caseStudies = {
  'the-grand-mandir': {
    title: 'The Grand Mandir',
    subtitle: 'A Monumental Architectural Achievement',
    heroBg: '/temple2.jpg',
    client: 'Global Hindu Heritage Society',
    location: 'New Jersey, USA',
    material: 'Pure Makrana White Marble',
    duration: '24 Months',
    vision: 'The client envisioned a sprawling, traditional mandir that would stand as a beacon of cultural heritage for centuries. They specifically requested authentic Makrana marble for its legendary durability and luminous white quality, identical to that used in the Taj Mahal.',
    execution: 'Our master artisans spent over two years hand-carving intricate jali screens, monumental pillars, and ornately detailed domes. The entire structure was dry-assembled at our Rajasthan facility to ensure perfect alignment before being crated and shipped across the globe for final installation.',
    gallery: [
      '/mandir_gallery_1_1789756062064.jpg',
      '/mandir_gallery_2_1789756074185.jpg',
      '/mandir_gallery_3_1789756086926.jpg',
      '/mandir_gallery_4_1789756099301.jpg',
      '/mandir_gallery_5_1789756111973.jpg',
      '/mandir_gallery_6_1789756125013.jpg',
      '/mandir_gallery_7_1789756161276.jpg',
      '/mandir_gallery_8_1789756172290.jpg',
      '/mandir_gallery_9_1789756185127.jpg',
      '/mandir_gallery_10_1789756200558.jpg'
    ]
  },
  'royal-pavilion': {
    title: 'Royal Pavilion',
    subtitle: 'An Exquisite Outdoor Sanctuary',
    heroBg: '/temple1.jpg',
    client: 'Private Royal Estate',
    location: 'Dubai, UAE',
    material: 'Makrana Marble with Semi-Precious Inlay',
    duration: '14 Months',
    vision: 'Designed to be the centerpiece of a sprawling private garden, the Royal Pavilion required a delicate balance of grand structural presence and intricate, jewel-like detailing that could withstand the harsh outdoor climate of the region.',
    execution: 'We integrated traditional Pietra Dura inlay techniques, embedding semi-precious stones directly into the Makrana marble flooring and pillars. The pavilion features custom-engineered structural supports hidden within seamlessly carved marble casings, blending modern engineering with ancient artistry.',
    gallery: [
      '/mandir_gallery_1_1789756062064.jpg',
      '/mandir_gallery_2_1789756074185.jpg',
      '/mandir_gallery_3_1789756086926.jpg',
      '/mandir_gallery_4_1789756099301.jpg',
      '/mandir_gallery_5_1789756111973.jpg',
      '/mandir_gallery_6_1789756125013.jpg',
      '/mandir_gallery_7_1789756161276.jpg',
      '/mandir_gallery_8_1789756172290.jpg',
      '/mandir_gallery_9_1789756185127.jpg',
      '/mandir_gallery_10_1789756200558.jpg'
    ]
  }
};

export default function CaseStudyPage({ params }) {
  const pathname = usePathname();
  // Extract id from pathname if params is not available in client component easily without unwrapping
  const id = pathname.split('/').pop();
  
  const project = caseStudies[id];

  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 992) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (project) {
      const maxIndex = Math.max(0, project.gallery.length - itemsPerView);
      setCurrentGalleryIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  };

  const prevSlide = () => {
    if (project) {
      const maxIndex = Math.max(0, project.gallery.length - itemsPerView);
      setCurrentGalleryIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  if (!project) {
    return (
      <>
        <Navbar />
        <main className={styles.notFound}>
          <h1>Case Study Not Found</h1>
          <Link href="/projects" className="btn-primary">Back to Portfolio</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className={styles.main}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBg}>
            <img src={project.heroBg} alt={project.title} />
            <div className={styles.overlay}></div>
          </div>
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.subtitle}>{project.subtitle}</span>
            <h1 className={styles.title}>{project.title}</h1>
          </div>
        </section>

        {/* Overview Grid */}
        <section className={styles.overviewSection}>
          <div className="container">
            <div className={styles.overviewGrid}>
              <div className={styles.overviewItem}>
                <span className={styles.label}>Client</span>
                <span className={styles.value}>{project.client}</span>
              </div>
              <div className={styles.overviewItem}>
                <span className={styles.label}>Location</span>
                <span className={styles.value}>{project.location}</span>
              </div>
              <div className={styles.overviewItem}>
                <span className={styles.label}>Material</span>
                <span className={styles.value}>{project.material}</span>
              </div>
              <div className={styles.overviewItem}>
                <span className={styles.label}>Duration</span>
                <span className={styles.value}>{project.duration}</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Story */}
        <section className={styles.storySection}>
          <div className="container">
            <div className={styles.splitStory}>
              <div className={styles.storyBlock}>
                <h3 className={styles.storyHeading}>The Vision</h3>
                <p className={styles.storyText}>{project.vision}</p>
              </div>
              <div className={styles.storyBlock}>
                <h3 className={styles.storyHeading}>The Execution</h3>
                <p className={styles.storyText}>{project.execution}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className={styles.gallerySection}>
          <div className="container">
            <h2 className="heading text-center" style={{ marginBottom: '40px' }}>Project Gallery</h2>
            <div style={{ position: 'relative', overflow: 'hidden', padding: '10px 0' }}>
              <div style={{ display: 'flex', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: `translateX(-${currentGalleryIndex * (100 / itemsPerView)}%)` }}>
                {project.gallery.map((img, idx) => (
                  <div key={idx} style={{ minWidth: `${100 / itemsPerView}%`, padding: '0 25px', height: '350px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                      <img src={img} alt={`Project Detail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }} style={{ position: 'absolute', top: '50%', left: '25px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', color: 'var(--text-dark)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, pointerEvents: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }} style={{ position: 'absolute', top: '50%', right: '25px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', color: 'var(--text-dark)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, pointerEvents: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 100, pointerEvents: 'auto' }}>
                {Array.from({ length: Math.max(1, project.gallery.length - itemsPerView + 1) }).map((_, idx) => (
                  <button type="button" key={idx} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentGalleryIndex(idx); }} style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', background: currentGalleryIndex === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} aria-label={`Go to slide ${idx + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <div className="container text-center">
            <h2 className={styles.ctaHeading}>Begin Your Own Masterpiece</h2>
            <p className={styles.ctaText}>Consult with our master artisans to bring your architectural vision to life in pure Makrana marble.</p>
            <Link href="/contact" className={`btn-primary ${styles.ctaBtn}`}>Start a Consultation</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
