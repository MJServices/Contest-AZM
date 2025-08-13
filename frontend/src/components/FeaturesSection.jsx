import { useState, useEffect } from "react";
import {
  Eye,
  ShoppingBag,
  Calendar,
  Heart,
  Star,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function FeaturesSection({ setActiveCard }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("features-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Inspiration Gallery",
      description:
        "Browse thousands of high-quality interior design images by category and style with advanced filtering",
      color: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      delay: "0ms",
      stats: "10K+ Images",
      href: "/gallery",
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Product Catalog",
      description:
        "Comprehensive furniture and decor listings with detailed specifications and real-time pricing",
      color: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      delay: "200ms",
      stats: "5K+ Products",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Designer Consultations",
      description:
        "Book appointments with verified professional interior designers for personalized guidance",
      color: "from-green-400 to-teal-500",
      bgGradient: "from-green-500/20 to-teal-500/20",
      delay: "400ms",
      stats: "50+ Experts",
      href: "/book-consultation",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Design Collections",
      description:
        "Save your favorite designs and create personalized mood boards with collaborative features",
      color: "from-pink-400 to-red-500",
      bgGradient: "from-pink-500/20 to-red-500/20",
      delay: "600ms",
      stats: "Unlimited Saves",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Review System",
      description:
        "Rate and review products and designers with detailed feedback and community insights",
      color: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      delay: "800ms",
      stats: "Verified Reviews",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Professional Network",
      description:
        "Connect with expert interior designers and showcase portfolios in our premium marketplace",
      color: "from-indigo-400 to-purple-500",
      bgGradient: "from-indigo-500/20 to-purple-500/20",
      delay: "1000ms",
      stats: "Pro Network",
    },
  ];

  const handleCardHover = (index) => {
    setHoveredCard(index);
    if (setActiveCard) setActiveCard(index);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
    if (setActiveCard) setActiveCard(null);
  };

  return (
    <section
      id="features-section"
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Section Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
            <span className="text-lg font-medium text-purple-300">
              Platform Features
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent hover:from-pink-400 hover:via-cyan-400 hover:to-purple-400 transition-all duration-1000">
            Everything You Need
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive tools for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-2">
              homeowners
            </span>
            ,
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold mx-2">
              designers
            </span>
            , and administrators
          </p>
        </div>

        {/* Enhanced Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transform hover:scale-105 hover:-translate-y-6 transition-all duration-700 cursor-pointer overflow-hidden ${
                hoveredCard === index
                  ? "scale-105 -translate-y-6 border-purple-400/50 shadow-2xl shadow-purple-500/20"
                  : ""
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
              style={{
                animationDelay: feature.delay,
                transitionDelay: isVisible ? feature.delay : "0ms",
              }}
            >
              {/* Click overlay to make entire card navigable on mobile */}
              {feature.href && (
                <Link
                  to={feature.href}
                  className="absolute inset-0 z-10"
                  aria-label={feature.title}
                ></Link>
              )}

              {/* Enhanced Animated Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-cyan-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/5 group-hover:to-cyan-600/10 transition-all duration-700"></div>

              {/* Premium Icon Container */}
              <div
                className={`relative w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-purple-500/20`}
              >
                <div className="relative z-10 text-white">{feature.icon}</div>
                <div className="absolute inset-0 bg-white/20 rounded-3xl group-hover:animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl"></div>
              </div>

              {/* Stats Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-xs font-medium text-purple-300">
                  {feature.stats}
                </span>
              </div>

              {/* Enhanced Title */}
              <h3 className="relative text-2xl md:text-3xl font-bold mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
                {feature.title}
              </h3>

              {/* Enhanced Description */}
              <p className="relative text-gray-300 group-hover:text-white transition-all duration-500 leading-relaxed text-lg mb-6">
                {feature.description}
              </p>

              {/* Learn More Button */}
              <div className="relative flex items-center text-purple-400 group-hover:text-pink-400 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                {feature.href ? (
                  <Link to={feature.href} className="flex items-center">
                    <span className="font-medium mr-2">Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300" />
                  </Link>
                ) : (
                  <>
                    <span className="font-medium mr-2">Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300" />
                  </>
                )}
              </div>

              {/* Multiple Sparkle Effects */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Sparkles className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
              <div
                className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{ transitionDelay: "200ms" }}
              >
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 blur-xl transition-all duration-700 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <button className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <span className="relative z-10 flex items-center">
              Explore All Features
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-all duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </button>
        </div>
      </div>
    </section>
  );
}

FeaturesSection.propTypes = {
  setActiveCard: PropTypes.func,
};

FeaturesSection.defaultProps = {
  setActiveCard: () => {},
};
