import Hero from "@/components/Hero";

import FAQ from "@/components/FAQ";

import Container from "@/components/Container";
import CTA from "@/components/CTA";
import FeatureCards from "@/components/FeaturedCards";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeatureCards />
      <Container>

        <FAQ />

        <CTA />
      </Container>
      <Script defer data-domain="interviewprep.elidayjuma.com" src="https://analytics.elidayjuma.com/js/script.outbound-links.js" />
      <Footer />
    </>
  );
};

export default HomePage;
