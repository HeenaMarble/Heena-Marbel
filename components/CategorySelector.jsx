"use client";

import Link from 'next/link';
import styles from '@/components/CategorySelector.module.css';

export default function CategorySelector({ categories, activeSlug, onSelectCategory }) {
  if (!categories || categories.length === 0) return null;

  const handleSelect = (e, slug) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(slug);
    }
  };

  return (
    <nav aria-label="Category selector" className={styles.container}>
      <div className={styles.scrollTrack}>
        {/* All Products Option */}
        <Link
          href="/shop"
          onClick={(e) => handleSelect(e, null)}
          className={`${styles.item} ${styles.allItem} ${!activeSlug ? styles.active : ''}`}
          aria-current={!activeSlug ? 'page' : undefined}
        >
          <div className={`${styles.iconCircle} ${styles.allIconCircle}`}>
            <svg
              className={styles.allIconSvg}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            {!activeSlug && (
              <span className={styles.activeBadge} aria-hidden="true">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2.5 6 5 8.5 9.5 3.5" />
                </svg>
              </span>
            )}
          </div>
          <span className={styles.label}>All Products</span>
        </Link>

        {/* Categories List */}
        {categories.map((c) => {
          const isActive = activeSlug === c.slug;
          return (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              onClick={(e) => handleSelect(e, c.slug)}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={styles.iconCircle}>
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className={styles.iconImg} />
                ) : (
                  <span className={styles.fallbackLetter}>
                    {c.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                {isActive && (
                  <span className={styles.activeBadge} aria-hidden="true">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2.5 6 5 8.5 9.5 3.5" />
                    </svg>
                  </span>
                )}
              </div>
              <span className={styles.label}>{c.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
