import Pricing from "@/components/PricingSection";
import Hero2 from "@/components/Hero2";
import FAQ from "@/components/FAQ";
import Container from "@/components/Container";
import CTA from "@/components/CTA";
import FeatureCards from "@/components/FeaturedCards";
import WebLayout from "@/components/Layouts/WebLayout";

const HomePage: React.FC = () => {
  return (
    <WebLayout>
      <Hero2 />
      <FeatureCards />
      {/* <Pricing /> */}
      <Container>

        <FAQ />

        <CTA />
      </Container>
    </WebLayout>
  );
};

export default HomePage;
