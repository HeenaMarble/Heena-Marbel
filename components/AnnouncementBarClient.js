"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from './AnnouncementBar.module.css';

export default function AnnouncementBarClient({ announcement }) {
  const pathname = usePathname();
  const storageKey = `hm_announcement_dismissed_${announcement.id}`;
  const [dismissed, setDismissed] = useState(false);

  // If the visitor already closed this exact banner earlier in this tab
  // session, keep it hidden. Keyed by announcement id, so a new/edited
  // announcement reappears even if a previous one was dismissed.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === '1') setDismissed(true);
    } catch {
      // sessionStorage unavailable (privacy mode etc.) — just show the banner
    }
  }, [storageKey]);

  function handleDismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(storageKey, '1');
    } catch {}
  }

  // Never show the customer-facing promo banner inside the admin panel.
  if (pathname?.startsWith('/admin')) return null;
  if (dismissed) return null;

  const content = <span className={styles.message}>{announcement.message}</span>;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {announcement.link_url ? (
          <Link href={announcement.link_url} className={styles.link}>
            {content}
          </Link>
        ) : (
          content
        )}
        <button
          type="button"
          onClick={handleDismiss}
          className={styles.closeBtn}
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
