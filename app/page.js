import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Hero from '@/components/Hero';
import FeaturesBar from '@/components/FeaturesBar';
import AboutSection from '@/components/AboutSection';
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import ConstructionPromo from '@/components/ConstructionPromo';
import ServicesSection from '@/components/ServicesSection';
import ApplicationsSection from '@/components/ApplicationsSection';
import StatsBar from '@/components/StatsBar';
import TestimonialsContact from '@/components/TestimonialsContact';
import Footer from '@/components/Footer';
import { getFeaturedProducts } from '@/actions/shop';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <FeaturesBar />
        <AboutSection />
        <FeaturedProjectsSection />
        <FeaturedProductsSection products={featuredProducts} />
        <ConstructionPromo />
        <ServicesSection />
        <ApplicationsSection />
        <StatsBar />
        <TestimonialsContact />
      </main>
      <Footer />
    </>
  );
}
