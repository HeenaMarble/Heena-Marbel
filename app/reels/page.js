import { getPublicReels } from '@/lib/actions/content-actions';
import ReelsClient from './ReelsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Reels | Heena Marble',
  description: 'See our craftsmanship in motion — behind the scenes, finished projects, and more on Instagram.',
};

export default async function ReelsPage() {
  const reels = await getPublicReels();

  return <ReelsClient initialReels={reels} />;
}
