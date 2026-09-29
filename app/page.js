import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Hero from '@/components/Hero';
import FeaturesBar from '@/components/FeaturesBar';
import AboutSection from '@/components/AboutSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import FeaturedReelsSection from '@/components/FeaturedReelsSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import ConstructionPromo from '@/components/ConstructionPromo';
import ServicesSection from '@/components/ServicesSection';
import ApplicationsSection from '@/components/ApplicationsSection';
import StatsBar from '@/components/StatsBar';
import TestimonialsContact from '@/components/TestimonialsContact';
import Footer from '@/components/Footer';
import { getFeaturedProducts } from '@/actions/shop';
import {
  getPublicApplications,
  getApplicationsTagline,
  getFeaturedReels,
} from '@/lib/actions/content-actions';

export default async function Home() {
  const [featuredProducts, applications, applicationsTagline, featuredReels] =
    await Promise.all([
      getFeaturedProducts(),
      getPublicApplications(),
      getApplicationsTagline(),
      getFeaturedReels(),
    ]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <FeaturesBar />
        <AboutSection />
        <FeaturedProjectsSection />
        <FeaturedReelsSection reels={featuredReels} />
        <FeaturedProductsSection products={featuredProducts} />
        <ConstructionPromo />
        <ServicesSection />
        <ApplicationsSection applications={applications} tagline={applicationsTagline} />
        <StatsBar />
        <TestimonialsContact />
      </main>
      <Footer />
    </>
  );
}
