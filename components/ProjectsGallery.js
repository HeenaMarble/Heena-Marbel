import styles from './ProjectsGallery.module.css';

const projects = [
  {
    id: 1,
    title: "Shree Mahavir Swami Jain Prasaad",
    location: "Rajkot, Gujarat",
    description: "Flooring & Interior (1.5 Cr)",
    image: "/temple2.jpg"
  },
  {
    id: 2,
    title: "Shree Swaminarayan Mandir",
    location: "Mota Varachha, Surat, Gujarat",
    description: "Exquisite stone carving and structural marble work.",
    image: "/temple3.jpg"
  },
  {
    id: 3,
    title: "Shri Chintamani Parshwanath Jain Shwetambar Derasar",
    location: "Ramnagar, Sabarmati, Ahmedabad",
    description: "Intricate jali work and sanctum architecture.",
    image: "/temple1.jpg"
  },
  {
    id: 4,
    title: "Jain Temple Ajitnath Bhagwan",
    location: "Valad, Gujarat",
    description: "Premium temple construction with pristine white marble.",
    image: "/temple2.jpg"
  },
  {
    id: 5,
    title: "Shree 1008 Pushpadant Swami",
    location: "Digambar Jain Temple, Dhule, Maharashtra",
    description: "Complete marble cladding and flooring.",
    image: "/temple3.jpg"
  },
  {
    id: 6,
    title: "Khandelwal Digambar Jain Temple",
    location: "Sadan Berar, Amravati, Maharashtra",
    description: "Exterior facade and detailed pillar carving.",
    image: "/temple1.jpg"
  },
  {
    id: 7,
    title: "Digambar Jain Mandir Shri Mahaveer Swami",
    location: "Por Village, Vadodara, Gujarat",
    description: "Monumental stone artisanship and assembly.",
    image: "/temple2.jpg"
  },
  {
    id: 8,
    title: "Ambesh Gurukul",
    location: "Palghar, Maharashtra",
    description: "Gurukul premises stone detailing on NH-48.",
    image: "/temple3.jpg"
  },
  {
    id: 9,
    title: "Jain Temple Peninsula Salsette 27",
    location: "Mumbai, Maharashtra",
    description: "Urban sanctuary with sophisticated stone interiors.",
    image: "/temple1.jpg"
  }
];

export default function ProjectsGallery() {
  return (
    <section id="projects" className="section" style={{ backgroundColor: '#fcfbf9' }}>
      <div className="container">
        <h2 className="section-title">Our Masterpieces</h2>
        <p className={styles.description}>
          A glimpse into some of our most prestigious projects across India, where devotion meets unmatched craftsmanship.
        </p>
        
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} className={styles.image} />
                <div className={styles.overlay}>
                  <button className="btn-outline" style={{color: '#fff', borderColor: '#fff'}}>View Details</button>
                </div>
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{project.title}</h3>
                <p className={styles.location}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {project.location}
                </p>
                <p className={styles.desc}>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
