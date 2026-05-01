import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Capabilities } from "@/components/landing/Capabilities";
import { Process } from "@/components/landing/Process";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { MascotPortal } from "@/components/landing/MascotPortal";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { Marquee } from "@/components/landing/Marquee";
import { NeuralField } from "@/components/landing/NeuralField";
import { SystemTicker } from "@/components/landing/SystemTicker";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <NeuralField />
      <ScrollProgress />
      <Nav />
      <div className="relative z-10">
        <Hero />
        <Stats />
        <Marquee />
        <Capabilities />
        <Process />
        <Pricing />
        <CTA />
        <Footer />
      </div>
      <SystemTicker />
      <MascotPortal />
    </main>
  );
};

export default Index;
