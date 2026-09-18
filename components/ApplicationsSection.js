import styles from './ApplicationsSection.module.css';

export default function ApplicationsSection() {
  const apps = [
    { title: "Temples", img: "/temple3.jpg" },
    { title: "Mosques", img: "/temple1.jpg" },
    { title: "Gurudwaras", img: "/temple2.jpg" },
    { title: "Churches", img: "/temple3.jpg" },
    { title: "Home Temples", img: "/temple1.jpg" },
    { title: "And More", img: "/temple2.jpg" }
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
