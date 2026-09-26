import styles from './ApplicationsSection.module.css';

export default function ApplicationsSection({
  applications = [],
  tagline,
  applicationsTagline,
}) {
  const displayTagline = tagline || applicationsTagline || "For Every Sacred & Special Space";

  return (
    <section className={`section ${styles.appSection}`}>
      <div className="container">
        <span className="subheading">OUR APPLICATIONS</span>
        <h2 className={`heading ${styles.appHeading}`}>{displayTagline}</h2>
        
        {applications && applications.length > 0 ? (
          <div className={styles.grid}>
            {applications.map((app) => (
              <div key={app.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={app.image_url} alt={app.title} />
                </div>
                <div className={styles.titleBar}>
                  <h4>{app.title}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
