import { getApplications, getApplicationsTagline } from '@/lib/actions/content-actions';
import ApplicationsClient from './ApplicationsClient';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const [applications, tagline] = await Promise.all([
    getApplications(),
    getApplicationsTagline(),
  ]);

  return <ApplicationsClient initialApplications={applications} initialTagline={tagline} />;
}
