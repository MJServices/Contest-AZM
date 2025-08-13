import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Calendar, Eye, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("cta-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const section = document.getElementById("cta-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const section = document.getElementById("cta-section");
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      id="cta-section"
      className="relative z-10 py-24 px-4 md:py-32 md:px-6 overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/40 to-transparent"></div>

      {/* Interactive Background Gradient */}
      <div
        className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 25%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          {/* Premium Glass Morphism Container */}
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-20 border border-white/20 overflow-hidden shadow-2xl shadow-purple-500/20">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl animate-pulse"></div>
            <div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            {/* Floating Geometric Shapes */}
            <div
              className="absolute top-8 left-8 w-16 h-16 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg"
              style={{ animationDuration: "20s" }}
            ></div>
            <div
              className="absolute bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-sm rounded-full animate-bounce border border-cyan-400/30"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative z-10 text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center mb-8 px-8 py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-400/20 backdrop-blur-xl rounded-full border border-white/20 shadow-xl">
                <Zap className="w-6 h-6 text-purple-400 mr-3 animate-pulse" />
                <span className="text-lg font-medium bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  Ready to Transform Your Space?
                </span>
                <div className="ml-3 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping"></div>
              </div>

              {/* Enhanced Main Heading */}
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent hover:from-pink-400 hover:via-cyan-400 hover:to-purple-400 transition-all duration-1000 leading-[1.15]">
                Start Your Journey
              </h2>

              {/* Enhanced Description */}
              <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-10 md:mb-16 max-w-4xl mx-auto leading-relaxed">
                Join thousands of homeowners and designers who&apos;ve
                discovered their perfect interior design solutions with
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-2">
                  DecorVista
                </span>
              </p>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
                <Link
                  to="/register"
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center overflow-hidden min-w-[280px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <Sparkles className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </Link>

                <Link
                  to="/gallery"
                  className="group relative px-12 py-6 border-2 border-purple-400/50 rounded-2xl font-bold text-xl hover:bg-gradient-to-r hover:from-purple-400/20 hover:to-pink-400/20 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 backdrop-blur-xl bg-white/5 min-w-[280px]"
                >
                  <Eye className="w-6 h-6 mr-3 group-hover:scale-125 transition-all duration-300 inline" />
                  <span className="group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    Explore Gallery
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 rounded-2xl transition-all duration-500"></div>
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: <Eye className="w-8 h-8" />,
                    title: "10K+ Designs",
                    description: "Curated inspiration gallery",
                  },
                  {
                    icon: <Calendar className="w-8 h-8" />,
                    title: "Expert Consultations",
                    description: "Professional guidance",
                  },
                  {
                    icon: <Star className="w-8 h-8" />,
                    title: "5-Star Rated",
                    description: "Trusted by thousands",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group relative p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-purple-400 group-hover:text-pink-400 transition-colors duration-300 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm">
                      {feature.description}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-500"></div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
                  <span className="font-medium">4.9/5 Rating</span>
                </div>
                <div className="w-px h-6 bg-gray-600"></div>
                <div className="font-medium">1000+ Happy Clients</div>
                <div className="w-px h-6 bg-gray-600"></div>
                <div className="font-medium">Free to Start</div>
              </div>
            </div>

            {/* Multiple Sparkle Effects */}
            <div className="absolute top-12 right-12 opacity-60 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div
              className="absolute bottom-12 left-12 opacity-60 animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <div
              className="absolute top-1/2 left-12 opacity-60 animate-pulse"
              style={{ animationDelay: "2s" }}
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>

            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-cyan-500/0 hover:from-purple-500/20 hover:via-pink-500/10 hover:to-cyan-500/20 blur-2xl transition-all duration-1000 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
