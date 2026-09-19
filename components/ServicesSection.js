import styles from './ServicesSection.module.css';

export default function ServicesSection() {
  const services = [
    {
      title: "Marble Carving",
      desc: "Detailed and elegant designs",
      img: "/marblecarving.jpeg"
    },
    {
      title: "Inlay Work",
      desc: "Intricate craftsmanship",
      img: "/inlaywork.jpeg"
    },
    {
      title: "Handicrafts",
      desc: "Unique marble art pieces",
      img: "/handicrafts.jpeg"
    },
    {
      title: "Custom Designs",
      desc: "Tailored to your vision",
      img: "/customdesign.jpeg"
    }
  ];

  return (
    <section id="services" className={`section ${styles.servicesSection}`}>
      <div className="container">
        <span className="subheading">OUR SERVICES</span>
        <h2 className={`heading ${styles.servicesHeading}`}>What We Create</h2>
        
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img src={service.img} alt={service.title} />
              </div>
              <div className={styles.content}>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
