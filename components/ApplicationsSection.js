import styles from './ApplicationsSection.module.css';

export default function ApplicationsSection() {
  const apps = [
    { title: "Temples", img: "/temples.jpg" },
    { title: "Mosques", img: "/mosques.jpg" },
    { title: "Gurudwaras", img: "/gurudwaras.jpg" },
    { title: "Churches", img: "/churches.jpg" },
    { title: "Home Temples", img: "/home-temples.jpg" },
    { title: "And More", img: "/and-more.jpg" }
  ];

  return (
    <section className={`section ${styles.appSection}`}>
      <div className="container">
        <span className="subheading">OUR APPLICATIONS</span>
        <h2 className="heading">For Every Sacred & Special Space</h2>
        
        <div className={styles.grid}>
          {apps.map((app, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={app.img} alt={app.title} />
              </div>
              <div className={styles.titleBar}>
                <h4>{app.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
