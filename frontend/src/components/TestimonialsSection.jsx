import { useState, useEffect } from "react";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";
import PropTypes from "prop-types";

export default function TestimonialsSection({ setActiveCard }) {
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

    const section = document.getElementById("testimonials-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner & Interior Enthusiast",
      content:
        "DecorVista completely transformed my living space! The designer consultation was incredible, and I found exactly what I was looking for. The platform made everything so easy and enjoyable.",
      rating: 5,
      image: "🏠",
      location: "New York, NY",
      project: "Modern Living Room Makeover",
    },
    {
      name: "Michael Chen",
      role: "Professional Interior Designer",
      content:
        "As a professional designer, DecorVista's platform has revolutionized how I connect with clients. The tools are intuitive, and the community is fantastic. It's become essential to my business.",
      rating: 5,
      image: "🎨",
      location: "Los Angeles, CA",
      project: "Luxury Apartment Design",
    },
    {
      name: "Emma Davis",
      role: "First-time Home Buyer",
      content:
        "I was overwhelmed with decorating my first home until I found DecorVista. The product catalog is amazing, and the inspiration gallery gave me so many ideas. Highly recommend to everyone!",
      rating: 5,
      image: "✨",
      location: "Chicago, IL",
      project: "Complete Home Furnishing",
    },
    {
      name: "David Rodriguez",
      role: "Restaurant Owner",
      content:
        "DecorVista helped me design the perfect ambiance for my restaurant. The commercial design consultations were top-notch, and the results exceeded my expectations. Business is booming!",
      rating: 5,
      image: "🍽️",
      location: "Miami, FL",
      project: "Restaurant Interior Design",
    },
    {
      name: "Lisa Thompson",
      role: "Real Estate Agent",
      content:
        "I use DecorVista for staging properties, and it's been a game-changer. The quick consultations and product recommendations help me sell homes faster. My clients love the results!",
      rating: 5,
      image: "🏡",
      location: "Seattle, WA",
      project: "Home Staging Solutions",
    },
    {
      name: "James Wilson",
      role: "Tech Startup Founder",
      content:
        "Creating a productive and inspiring office space was crucial for our startup. DecorVista's office design specialists delivered beyond our expectations. Our team productivity has increased significantly!",
      rating: 5,
      image: "💼",
      location: "Austin, TX",
      project: "Modern Office Design",
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
      id="testimonials-section"
      className="relative z-10 py-24 px-4 md:py-32 md:px-6 overflow-hidden"
    >
      {/* Section Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-transparent"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-white/20">
            <Quote className="w-5 h-5 text-pink-400 mr-2 animate-pulse" />
            <span className="text-lg font-medium text-pink-300">
              Client Stories
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-400 hover:via-cyan-400 hover:to-pink-400 transition-all duration-1000">
            What People Say
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Real stories from
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-semibold mx-2">
              homeowners
            </span>
            and
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold mx-2">
              designers
            </span>
            who&apos;ve transformed their spaces
          </p>
        </div>

        {/* Enhanced Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transform hover:scale-105 hover:-translate-y-6 transition-all duration-700 cursor-pointer overflow-hidden ${
                hoveredCard === index
                  ? "scale-105 -translate-y-6 border-pink-400/50 shadow-2xl shadow-pink-500/20"
                  : ""
              } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
              style={{
                animationDelay: `${index * 200}ms`,
                transitionDelay: isVisible ? `${index * 200}ms` : "0ms",
              }}
            >
              {/* Enhanced Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-pink-500/20 group-hover:via-purple-500/10 group-hover:to-cyan-500/20 transition-all duration-700"></div>

              {/* Premium Quote Mark */}
              <div className="absolute top-6 right-6 text-6xl text-pink-400/20 group-hover:text-pink-400/40 transition-all duration-500">
                <Quote className="w-12 h-12" />
              </div>

              {/* Enhanced Star Rating */}
              <div className="flex mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
                <div className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-full border border-yellow-400/30">
                  <span className="text-xs font-medium text-yellow-300">
                    5.0
                  </span>
                </div>
              </div>

              {/* Enhanced Content */}
              <p className="text-gray-300 group-hover:text-white transition-colors duration-500 text-lg leading-relaxed mb-8 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Enhanced Profile Section */}
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 text-2xl shadow-lg">
                  {testimonial.image}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl group-hover:animate-ping"></div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-pink-400 text-xs font-medium mt-1">
                    {testimonial.location}
                  </div>
                </div>
              </div>

              {/* Project Badge */}
              <div className="relative z-10 inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-full border border-white/20 group-hover:border-pink-400/30 transition-all duration-500">
                <Sparkles className="w-4 h-4 text-pink-400 mr-2" />
                <span className="text-sm font-medium text-pink-300 group-hover:text-pink-200 transition-colors duration-500">
                  {testimonial.project}
                </span>
              </div>

              {/* Multiple Sparkle Effects */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
              </div>
              <div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700"
                style={{ transitionDelay: "200ms" }}
              >
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/20 group-hover:to-purple-500/20 blur-xl transition-all duration-700 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div
          className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
            <button className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10 flex items-center">
                Share Your Story
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-all duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </button>

            <div className="text-gray-400 text-lg">
              or
              <button className="mx-2 text-pink-400 hover:text-purple-400 font-medium underline decoration-pink-400/50 hover:decoration-purple-400/50 transition-all duration-300">
                read more reviews
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
              <span className="font-medium">4.9/5 Average Rating</span>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="font-medium">1000+ Happy Clients</div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="font-medium">Verified Reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
}

TestimonialsSection.propTypes = {
  setActiveCard: PropTypes.func,
};

TestimonialsSection.defaultProps = {
  setActiveCard: () => {},
};
