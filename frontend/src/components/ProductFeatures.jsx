import { useState, useEffect, useRef } from 'react';
import { Palette, Home, Sparkles, Shield, Truck, HeartHandshake } from 'lucide-react';

const ProductFeatures = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const featuresRef = useRef(null);

  const features = [
    {
      icon: Palette,
      title: 'Custom Design',
      description: 'Tailored designs that reflect your unique style and personality',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Home,
      title: 'Modern Spaces',
      description: 'Contemporary layouts optimized for modern living',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Premium Materials',
      description: 'High-quality materials sourced from trusted suppliers worldwide',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '5-year warranty on all our interior design projects',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Truck,
      title: 'Fast Installation',
      description: 'Professional installation within 2-3 weeks',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: HeartHandshake,
      title: '24/7 Support',
      description: 'Dedicated support team available round the clock',
      color: 'from-red-500 to-pink-500'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures(prev => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const featureElements = featuresRef.current?.querySelectorAll('.feature-card');
    featureElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Why Choose
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              DecorVista?
            </span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Experience the perfect blend of innovation, quality, and style with our premium interior design solutions
          </p>
        </div>

        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleFeatures[index];
            
            return (
              <div
                key={index}
                data-index={index}
                className={`feature-card group relative p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-105 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                }}
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;