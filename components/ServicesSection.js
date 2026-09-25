import styles from './ServicesSection.module.css';
import { getPublicServices } from '@/lib/actions/content-actions';

// Fallback shown only if the DB rows are missing/unreachable, so the section
// never renders empty.
const FALLBACK_SERVICES = [
  { title: "Marble Carving", description: "Detailed and elegant designs", image_url: "/marblecarving.jpeg" },
  { title: "Inlay Work", description: "Intricate craftsmanship", image_url: "/inlaywork.jpeg" },
  { title: "Handicrafts", description: "Unique marble art pieces", image_url: "/handicrafts.jpeg" },
  { title: "Custom Designs", description: "Tailored to your vision", image_url: "/customdesign.jpeg" }
];

export default async function ServicesSection() {
  const dbServices = await getPublicServices();
  const services = dbServices?.length ? dbServices : FALLBACK_SERVICES;

  return (
    <section id="services" className={`section ${styles.servicesSection}`}>
      <div className="container">
        <span className="subheading">OUR SERVICES</span>
        <h2 className={`heading ${styles.servicesHeading}`}>What We Create</h2>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={service.id ?? index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={service.image_url} alt={service.title} />
              </div>
              <div className={styles.content}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
