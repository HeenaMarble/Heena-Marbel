import {
  CheckCircle2, Users, Award, Clock, MapPin, Globe, Building, ShieldCheck, Star, Sparkles,
} from 'lucide-react';
import styles from './StatsBar.module.css';
import { getPublicStats } from '@/lib/actions/content-actions';

// Keys must match the ICON_OPTIONS keys used in the admin StatCard editor.
const ICON_MAP = {
  check: CheckCircle2, users: Users, award: Award, clock: Clock,
  'map-pin': MapPin, globe: Globe, building: Building, shield: ShieldCheck,
  star: Star, sparkles: Sparkles,
};

function renderIcon(iconKey) {
  const IconComponent = ICON_MAP[iconKey?.toLowerCase()] || Award;
  return <IconComponent className={styles.icon} />;
}

const FALLBACK_STATS = [
  { icon_key: 'check', number: '500+', label: 'Projects Completed' },
  { icon_key: 'users', number: '300+', label: 'Happy Clients' },
  { icon_key: 'award', number: '10+', label: 'Years of Experience' },
  { icon_key: 'map-pin', number: 'Pan India', label: 'Service Available' },
];

export default async function StatsBar() {
  const dbStats = await getPublicStats();
  const stats = dbStats?.length ? dbStats : FALLBACK_STATS;

  return (
    <div className={styles.statsBar}>
      <div className="container">
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={stat.id ?? index} className={styles.statItem}>
              <div className={styles.iconWrapper}>{renderIcon(stat.icon_key)}</div>
              <div className={styles.content}>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
