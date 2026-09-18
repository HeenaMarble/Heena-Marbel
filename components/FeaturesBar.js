import styles from './FeaturesBar.module.css';

export default function FeaturesBar() {
  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3233/3233483.png",
      title: "Premium Makrana Marble",
      desc: "World famous for purity & strength"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1000/1000966.png",
      title: "Trusted Craftsmanship",
      desc: "Generations of expertise"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/6182/6182747.png",
      title: "Custom Solutions",
      desc: "As per your vision & space"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2769/2769339.png",
      title: "Pan India Service",
      desc: "Safe & reliable delivery"
    }
  ];

  return (
    <div className={styles.featuresBar}>
      <div className="container">
        <div className={styles.grid}>
          {features.map((item, index) => (
            <div key={index} className={styles.featureItem}>
              <img 
                src={item.icon} 
                alt={item.title} 
                className={styles.icon} 
                style={{filter: 'invert(50%) sepia(50%) saturate(400%) hue-rotate(5deg)'}}
              />
              <div className={styles.text}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
