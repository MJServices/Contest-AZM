import { useState, useEffect } from "react";
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Bath,
  Briefcase,
  TreePine,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function CategoriesSection({ setActiveCard }) {
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

    const section = document.getElementById("categories-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      icon: <Sofa className="w-12 h-12" />,
      title: "Living Rooms",
      count: "2.5K+ items",
      trend: "Modern & Minimalist",
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      delay: "0ms",
    },
    {
      icon: <Bed className="w-12 h-12" />,
      title: "Bedrooms",
      count: "1.8K+ items",
      trend: "Cozy & Luxurious",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      delay: "200ms",
    },
    {
      icon: <UtensilsCrossed className="w-12 h-12" />,
      title: "Kitchens",
      count: "3.2K+ items",
      trend: "Smart & Functional",
      color: "from-green-500 to-teal-500",
      bgGradient: "from-green-500/20 to-teal-500/20",
      delay: "400ms",
    },
    {
      icon: <Bath className="w-12 h-12" />,
      title: "Bathrooms",
      count: "950+ items",
      trend: "Spa-like Serenity",
      color: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/20 to-blue-500/20",
      delay: "600ms",
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Office Spaces",
      count: "1.2K+ items",
      trend: "Productive & Stylish",
      color: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/20 to-purple-500/20",
      delay: "800ms",
    },
    {
      icon: <TreePine className="w-12 h-12" />,
      title: "Outdoor",
      count: "800+ items",
      trend: "Natural & Relaxing",
      color: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      delay: "1000ms",
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
      id="categories-section"
      className="relative z-10 py-32 px-6 overflow-hidden"
    >
      {/* Section Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "3s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border border-white/20">
            <Sparkles className="w-5 h-5 text-cyan-400 mr-2 animate-pulse" />
            <span className="text-lg font-medium text-cyan-300">
              Design Categories
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 transition-all duration-1000">
            Explore Spaces
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover inspiration across every room and space with our
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold mx-2">
              curated collections
            </span>
            of premium designs
          </p>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-cyan-400/50 transform hover:scale-105 hover:-translate-y-6 transition-all duration-700 text-center cursor-pointer overflow-hidden ${
                hoveredCard === index
                  ? "scale-105 -translate-y-6 border-cyan-400/50 shadow-2xl shadow-cyan-500/20"
                  : ""
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
              style={{
                animationDelay: category.delay,
                transitionDelay: isVisible ? category.delay : "0ms",
              }}
            >
              {/* Click overlay to navigate to gallery filtered by category */}
              <Link
                to={`/gallery?category=${encodeURIComponent(category.title.toLowerCase().replace(/\s+/g, "_"))}`}
                className="absolute inset-0 z-10"
                aria-label={`Explore ${category.title}`}
              ></Link>
              {/* Enhanced Animated Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/0 via-blue-600/0 to-purple-600/0 group-hover:from-cyan-600/10 group-hover:via-blue-600/5 group-hover:to-purple-600/10 transition-all duration-700"></div>

              {/* Premium Icon Container */}
              <div className="mb-8">
                <div
                  className={`inline-flex w-24 h-24 rounded-3xl bg-gradient-to-r ${category.color} items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-purple-500/20 text-white`}
                >
                  {category.icon}
                  <div className="absolute inset-0 bg-white/20 rounded-3xl group-hover:animate-ping"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl"></div>
                </div>
              </div>

              {/* Enhanced Title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-500">
                {category.title}
              </h3>

              {/* Stats and Trend */}
              <div className="space-y-3 mb-6">
                <p className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors duration-500">
                  {category.count}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-full border border-white/20 group-hover:border-cyan-400/30 transition-all duration-500">
                  <span className="text-sm font-medium text-cyan-300 group-hover:text-cyan-200 transition-colors duration-500">
                    {category.trend}
                  </span>
                </div>
              </div>

              {/* Explore Button */}
              <div className="relative flex items-center justify-center text-cyan-400 group-hover:text-blue-400 transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                <span className="font-medium mr-2">Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-all duration-300" />
              </div>

              {/* Multiple Sparkle Effects */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
              <div
                className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{ transitionDelay: "200ms" }}
              >
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 blur-xl transition-all duration-700 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div
          className={`text-center mt-20 transform transition-all duration-1000 delay-1200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
            <button className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                Browse All Categories
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </button>

            <div className="text-gray-400 text-lg">
              or
              <button className="mx-2 text-cyan-400 hover:text-blue-400 font-medium underline decoration-cyan-400/50 hover:decoration-blue-400/50 transition-all duration-300">
                create custom collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

CategoriesSection.propTypes = {
  setActiveCard: PropTypes.func,
};

CategoriesSection.defaultProps = {
  setActiveCard: () => {},
};
