import { getActiveAnnouncement } from '@/lib/actions/content-actions';
import AnnouncementBarClient from './AnnouncementBarClient';

export default async function AnnouncementBar() {
  const announcement = await getActiveAnnouncement();
  if (!announcement) return null;

  return <AnnouncementBarClient announcement={announcement} />;
}
