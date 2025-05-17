import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import Container from "@/components/Container";
import CTA from "@/components/CTA";
import FeatureCards from "@/components/FeaturedCards";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <FeatureCards />
      <Container>

        <FAQ />

        <CTA />
      </Container>
    </>
  );
};

export default HomePage;
