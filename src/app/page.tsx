import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LearnSection from "@/components/landing/LearnSection";
import AIMentorSection from "@/components/landing/AIMentorSection";
import ProjectsSection from "@/components/landing/ProjectsSection";
import HowItWorks from "@/components/landing/HowItWorks";
import LearningPaths from "@/components/landing/LearningPaths";
import PhilosophySection from "@/components/landing/PhilosophySection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white dark:bg-[#0a090e]">
      <Navbar />
      <main>
        <Hero />
        <LearnSection />
        <AIMentorSection />
        <ProjectsSection />
        <HowItWorks />
        <LearningPaths />
        <PhilosophySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}