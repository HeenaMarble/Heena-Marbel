"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './FeaturedProjectsSection.module.css';
import { getProjectCategoriesWithCover } from '@/lib/actions/project-actions';

const FALLBACK_CATEGORIES = [
  {
    id: "home-mandir",
    name: "Home Mandir Architecture",
    cover_image: "/home-temples.jpg",
  },
  {
    id: "fountains",
    name: "Decorative Marble Fountains",
    cover_image: "/fountain.jpg",
  },
  {
    id: "inlay-work",
    name: "Royal Inlay & Flooring",
    cover_image: "/inlaywork.jpeg",
  },
  {
    id: "marble-carvings",
    name: "Artisanal Carvings & Jali",
    cover_image: "/marblecarving.jpeg",
  },
];

export default function FeaturedProjectsSection() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    async function loadLiveCategories() {
      try {
        const fetched = await getProjectCategoriesWithCover();
        if (fetched && fetched.length > 0) {
          const list = fetched.slice(0, 4);
          // If fewer than 4 categories in db, fill with fallback
          if (list.length < 4) {
            const existingIds = new Set(list.map((c) => String(c.id)));
            for (const fb of FALLBACK_CATEGORIES) {
              if (list.length >= 4) break;
              if (!existingIds.has(String(fb.id))) {
                list.push(fb);
              }
            }
          }
          setCategories(list);
        }
      } catch (err) {
        console.warn("Could not fetch project categories from Supabase, keeping fallback:", err);
      }
    }
    loadLiveCategories();
  }, []);

  return (
    <section id="projects-showcase" className={`section ${styles.projectsSection}`}>
      <div className="container">
        {/* Header with Background & Action */}
        <div className={styles.headerWithBg}>
          <div>
            <span className={styles.subheading}>PORTFOLIO SHOWCASE</span>
            <h2 className={`heading ${styles.heading}`}>Featured Masterpieces</h2>
          </div>
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>View All Projects</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* 4 Projects Grid */}
        <div className={styles.grid}>
          {categories.map((cat, index) => {
            const projectUrl = `/projects?cat=${encodeURIComponent(cat.id)}`;
            const coverImg =
              cat.cover_image ||
              FALLBACK_CATEGORIES[index % FALLBACK_CATEGORIES.length].cover_image;

            return (
              <Link
                key={cat.id || index}
                href={projectUrl}
                className={styles.folderCard}
              >
                <div className={styles.imageWrapper}>
                  {coverImg ? (
                    <img
                      src={coverImg}
                      alt={cat.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.folderPlaceholder}>
                      <Sparkles size={32} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Portfolio
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.details}>
                  <div className={styles.titleArea}>
                    <span className={styles.cardSubtitle}>Custom Work</span>
                    <h3 className={styles.cardTitle}>{cat.name}</h3>
                  </div>
                  <div className={styles.arrowCircle}>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
