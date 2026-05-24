import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/landing/hero-section";
import TrustCards from "@/components/landing/trust-cards";
import ProcessSection from "@/components/landing/process-section";
import FeaturedProducts from "@/components/landing/featured-products";
import StorySection from "@/components/landing/story-section";
import CtaSection from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustCards />
        <ProcessSection />
        <FeaturedProducts />
        <StorySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
