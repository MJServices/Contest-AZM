import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Eye, Star, TrendingUp, Award, Sparkles } from 'lucide-react';

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start number animations
          animateNumbers();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const animateNumbers = () => {
    const stats = [
      { key: 'products', target: 25000, suffix: 'K+', duration: 2000 },
      { key: 'designers', target: 500, suffix: '+', duration: 1800 },
      { key: 'inspirations', target: 10000, suffix: 'K+', duration: 2200 },
      { key: 'satisfaction', target: 95, suffix: '%', duration: 1500 }
    ];

    stats.forEach(({ key, target, suffix, duration }) => {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        
        setAnimatedNumbers(prev => ({
          ...prev,
          [key]: key === 'products' || key === 'inspirations' 
            ? Math.floor(start / 1000) + suffix
            : Math.floor(start) + suffix
        }));
      }, 16);
    });
  };

  const stats = [
    { 
      key: 'products',
      number: animatedNumbers.products || '0K+', 
      label: 'Premium Products', 
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      description: 'Curated furniture & decor'
    },
    { 
      key: 'designers',
      number: animatedNumbers.designers || '0+', 
      label: 'Expert Designers', 
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      description: 'Verified professionals'
    },
    { 
      key: 'inspirations',
      number: animatedNumbers.inspirations || '0K+', 
      label: 'Design Inspirations', 
      icon: <Eye className="w-8 h-8" />,
      color: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-500/20 to-teal-500/20',
      description: 'High-quality galleries'
    },
    { 
      key: 'satisfaction',
      number: animatedNumbers.satisfaction || '0%', 
      label: 'Client Satisfaction', 
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      description: 'Happy customers'
    }
  ];

  return (
    <section id="stats-section" className="relative z-10 py-32 px-6 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent"></div>
      
      {/* Animated Glass Morphism Background */}
      <div className="absolute inset-0 backdrop-blur-sm">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-16 h-16 border-2 border-purple-400/30 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-sm rounded-full animate-bounce border border-cyan-400/30" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-2/3 w-20 h-20 border-2 border-pink-400/30 backdrop-blur-sm bg-pink-400/5 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full border border-white/20">
            <TrendingUp className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
            <span className="text-lg font-medium text-purple-300">Our Impact</span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 transition-all duration-1000">
            By The Numbers
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Trusted by thousands of 
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold mx-2">
              homeowners
            </span>
            and
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-semibold mx-2">
              design professionals
            </span>
            worldwide
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative text-center transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              {/* Glass Morphism Container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 group-hover:scale-105 transition-all duration-700 overflow-hidden">
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}></div>
                
                {/* Premium Icon Container */}
                <div className="relative mb-6 flex justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-3xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-2xl text-white`}>
                    {stat.icon}
                    <div className="absolute inset-0 bg-white/20 rounded-3xl group-hover:animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl"></div>
                  </div>
                </div>
                
                {/* Animated Number */}
                <div className="relative text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-all duration-500 mb-4">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="relative text-xl font-semibold text-gray-300 group-hover:text-white transition-colors mb-3">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="relative text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.description}
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-700" style={{transitionDelay: '200ms'}}>
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 to-cyan-500/0 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 blur-xl transition-all duration-700 -z-10"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className={`mt-20 flex flex-wrap justify-center items-center gap-8 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {[
            { icon: <Award className="w-6 h-6" />, text: "Industry Leader" },
            { icon: <Star className="w-6 h-6" />, text: "Top Rated Platform" },
            { icon: <TrendingUp className="w-6 h-6" />, text: "Fastest Growing" }
          ].map((badge, index) => (
            <div 
              key={index}
              className="group flex items-center px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-full border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105"
            >
              <div className="text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 mr-3">
                {badge.icon}
              </div>
              <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}