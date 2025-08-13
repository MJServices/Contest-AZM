import { useState } from "react";
import HeroSection from "../components/HeroSection";
import ParticlesBackground from "../components/ParticlesBackground";
import MouseFollower from "../components/MouseFollower";
import FeaturesSection from "../components/FeaturesSection";
import UserTypesSection from "../components/UserTypesSection";
import CategoriesSection from "../components/CategoriesSection";
import StatsSection from "../components/StatsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FloatingBackground from "../components/FloatingBackground";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden relative">
      {/* Enhanced Background Components */}
      <ParticlesBackground />
      <MouseFollower activeCard={activeCard} />
      <FloatingBackground />

      {/* Additional Glass Morphism Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating geometric shapes with glass effect */}
        <div
          className="absolute top-1/3 right-1/3 w-24 h-24 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/5 w-20 h-20 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-bounce border border-pink-400/30"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/5 w-16 h-16 border-2 border-cyan-400/30 backdrop-blur-sm bg-cyan-400/10 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Mobile menu managed by Navbar */}

      {/* Main Content Sections with enhanced spacing and glass effects */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="relative">
          <HeroSection />
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent backdrop-blur-sm"></div>
          <div className="relative z-10">
            <FeaturesSection setActiveCard={setActiveCard} />
          </div>
        </section>

        {/* User Types Section */}
        <section id="user-types" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent"></div>
          <div className="relative z-10">
            <UserTypesSection setActiveCard={setActiveCard} />
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-transparent backdrop-blur-sm"></div>
          <div className="relative z-10">
            <CategoriesSection setActiveCard={setActiveCard} />
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
          <div className="relative z-10">
            <StatsSection />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent backdrop-blur-sm"></div>
          <div className="relative z-10">
            <TestimonialsSection setActiveCard={setActiveCard} />
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative py-14 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/40 to-transparent"></div>
          <div className="relative z-10">
            <CTASection />
          </div>
        </section>

        {/* Footer */}
        <footer className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent backdrop-blur-lg"></div>
          <div className="relative z-10">
            <Footer />
          </div>
        </footer>
      </main>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`,
          }}
        ></div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:scale-110 hover:shadow-purple-500/70 transition-all duration-300 z-40 group"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
      </button>
    </div>
  );
}
