import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () =>
        heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 py-16 md:px-6 md:py-20 overflow-visible"
    >
      {/* Interactive Background Gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)`,
        }}
      />

      {/* Glass Morphism Container */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Premium Badge */}
        <div
          className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex items-center mb-8 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-400/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl shadow-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400 mr-3 animate-pulse" />
            <span className="text-lg font-medium bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              ✨ Transform Your Space with DecorVista
            </span>
            <div className="ml-3 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Main Heading with Enhanced Typography */}
        <div
          className={`transform transition-all duration-1000 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[1.15] md:leading-tight">
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent hover:from-pink-400 hover:via-cyan-400 hover:to-purple-400 transition-all duration-1000">
              Create
            </span>
            <span className="block text-4xl md:text-7xl lg:text-8xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mt-4 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 transition-all duration-1000">
              Stunning Interiors
            </span>
            <div className="flex items-center justify-center mt-6">
              <Sparkles
                className="w-12 h-12 md:w-16 md:h-16 text-purple-400 animate-spin mr-4"
                style={{ animationDuration: "3s" }}
              />
              <span className="text-4xl md:text-6xl">✨</span>
              <Sparkles
                className="w-12 h-12 md:w-16 md:h-16 text-pink-400 animate-spin ml-4"
                style={{
                  animationDuration: "4s",
                  animationDirection: "reverse",
                }}
              />
            </div>
          </h1>
        </div>

        {/* Enhanced Description */}
        <div
          className={`transform transition-all duration-1000 delay-400 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <p className="text-xl md:text-3xl lg:text-4xl mb-16 text-gray-300 max-w-5xl mx-auto leading-relaxed font-light">
            Bridge the gap between homeowners and professional designers with
            our
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-2">
              comprehensive platform
            </span>
            for
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold mx-2">
              interior design inspiration
            </span>
          </p>
        </div>

        {/* Enhanced Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-8 justify-center items-center transform transition-all duration-1000 delay-600 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <Link
            to="/gallery"
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center overflow-hidden min-w-[280px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <Eye className="w-7 h-7 mr-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
            <span className="relative z-10">Explore Gallery</span>
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-all duration-300 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </Link>

          <Link
            to="/register"
            className="group relative px-12 py-6 border-2 border-purple-400/50 rounded-2xl font-bold text-xl hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 backdrop-blur-xl flex items-center justify-center bg-white/5 min-w-[280px]"
          >
            <Calendar className="w-7 h-7 mr-4 group-hover:scale-125 transition-all duration-300" />
            <span className="group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              Book Consultation
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 rounded-2xl transition-all duration-500"></div>
          </Link>
        </div>

        {/* Video Play Button */}
        <div
          className={`mt-16 transform transition-all duration-1000 delay-800 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <button className="group relative flex items-center justify-center mx-auto">
            <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center hover:scale-110 transition-all duration-500 shadow-2xl shadow-purple-500/30">
              <Play className="w-8 h-8 text-purple-300 ml-1 group-hover:scale-125 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
            </div>
            <span className="ml-4 text-lg font-medium text-gray-300 group-hover:text-purple-300 transition-colors duration-300">
              Watch Demo
            </span>
          </button>
        </div>

        {/* Floating Stats */}
        <div
          className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transform transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          {[
            { number: "10K+", label: "Happy Clients", icon: "👥" },
            { number: "500+", label: "Design Projects", icon: "🏠" },
            { number: "50+", label: "Expert Designers", icon: "✨" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Floating Action Indicators */}
        <div className="mt-20 flex justify-center space-x-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce opacity-60 hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "1.2s" }}
      >
        <div
          className="flex flex-col items-center animate-bounce cursor-pointer group"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <div className="text-sm text-gray-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">
            Scroll to explore
          </div>
          <ChevronDown className="w-8 h-8 text-purple-400 animate-pulse group-hover:text-pink-400 transition-colors duration-300" />
          <ChevronDown
            className="w-6 h-6 text-pink-400 -mt-2 animate-pulse group-hover:text-cyan-400 transition-colors duration-300"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      {/* Ambient Light Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </section>
  );
}
