import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import CategoriesSection from "@/components/sections/CategoriesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedProfessionalsSection from "@/components/sections/FeaturedProfessionalsSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProfessionalsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
