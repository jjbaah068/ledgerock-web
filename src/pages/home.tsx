import Navbar from "../components/navbar";
import Hero from "../components/hero";
import FeaturedLots from "../components/featuredlotspinned";
import Services from "../components/services";
import LivingPreview from "../components/livingpreview";
import Footer from "../components/footer";

export default function Home() {
  return (
    <>
      <Navbar transparent/>
      <Hero />   
      <FeaturedLots />
      <LivingPreview />
      <Services />
      <Footer />
    </>
  );
}