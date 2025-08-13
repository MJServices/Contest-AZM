import { useState, useEffect } from 'react';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
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

    const footer = document.getElementById('footer-section');
    if (footer) observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "For Homeowners",
      links: [
        { name: "Browse Gallery", href: "/gallery" },
        { name: "Shop Products", href: "/products" },
        { name: "Find Designers", href: "/designers" },
        { name: "Book Consultations", href: "/consultations" }
      ]
    },
    {
      title: "For Designers",
      links: [
        { name: "Join Network", href: "/join" },
        { name: "Manage Portfolio", href: "/portfolio" },
        { name: "Client Dashboard", href: "/dashboard" },
        { name: "Earn Money", href: "/earnings" }
      ]
    },
    {
      title: "Categories",
      links: [
        { name: "Living Rooms", href: "/category/living-rooms" },
        { name: "Bedrooms", href: "/category/bedrooms" },
        { name: "Kitchens", href: "/category/kitchens" },
        { name: "Bathrooms", href: "/category/bathrooms" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook", color: "from-blue-500 to-blue-600" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter", color: "from-sky-400 to-sky-500" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", name: "Instagram", color: "from-pink-500 to-purple-500" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", name: "LinkedIn", color: "from-blue-600 to-blue-700" },
    { icon: <Youtube className="w-5 h-5" />, href: "#", name: "YouTube", color: "from-red-500 to-red-600" }
  ];

  return (
    <footer id="footer-section" className="relative z-10 border-t border-white/20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 backdrop-blur-xl"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-12 h-12 border-2 border-purple-400/20 backdrop-blur-sm bg-white/5 rotate-45 animate-spin rounded-lg" style={{animationDuration: '25s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-8 h-8 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-full animate-bounce border border-pink-400/20" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Enhanced Header Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Link to="/" className="group inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Home className="w-12 h-12 mr-4 text-purple-400 animate-pulse group-hover:text-pink-400 transition-colors duration-300" />
              <div className="absolute inset-0 w-12 h-12 bg-purple-400/20 rounded-full blur-lg group-hover:bg-pink-400/30 transition-all duration-300"></div>
            </div>
            <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:via-cyan-400 group-hover:to-purple-400 transition-all duration-500">
              DecorVista
            </span>
          </Link>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transforming spaces, connecting homeowners with professional designers, inspiring beautiful interiors across the globe
          </p>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center group">
              <Mail className="w-5 h-5 mr-2 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">hello@decorvista.com</span>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="flex items-center group">
              <Phone className="w-5 h-5 mr-2 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">+1 (555) 123-4567</span>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="flex items-center group">
              <MapPin className="w-5 h-5 mr-2 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
              <span className="group-hover:text-white transition-colors duration-300">San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Links Grid */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="group">
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-cyan-400 transition-all duration-500">
                {section.title}
              </h3>
              <div className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.href}
                    className="block text-gray-400 hover:text-purple-300 transition-all duration-300 hover:translate-x-2 transform hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text hover:text-transparent group-hover:scale-105"
                    style={{ transitionDelay: `${linkIndex * 50}ms` }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Social Links */}
        <div className={`flex justify-center space-x-6 mb-12 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className={`group relative w-14 h-14 bg-gradient-to-r ${social.color} rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-lg hover:shadow-2xl text-white overflow-hidden`}
              title={social.name}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative z-10">
                {social.icon}
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-2xl group-hover:animate-ping"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/20 group-hover:to-pink-400/20 rounded-2xl blur-lg transition-all duration-500"></div>
            </a>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className={`text-center mb-12 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6">Get the latest design trends and inspiration delivered to your inbox</p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none transition-all duration-300"
              />
              <button className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Copyright Section */}
        <div className={`text-center border-t border-white/10 pt-8 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 flex items-center">
              © 2025 DecorVista. All rights reserved. Made with 
              <Heart className="w-4 h-4 mx-2 text-red-400 animate-pulse" />
              for beautiful interior designs
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-purple-400 transition-colors duration-300">Privacy</Link>
              <Link to="/terms" className="hover:text-purple-400 transition-colors duration-300">Terms</Link>
              <Link to="/cookies" className="hover:text-purple-400 transition-colors duration-300">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50 backdrop-blur-lg border border-white/20 flex items-center justify-center hover:scale-110 hover:shadow-purple-500/70 transition-all duration-300 z-40 group"
        >
          <ArrowUp className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
        </button>

        {/* Sparkle Effects */}
        <div className="absolute top-12 right-12 opacity-40 animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
        <div className="absolute bottom-12 left-12 opacity-40 animate-pulse" style={{animationDelay: '1s'}}>
          <Sparkles className="w-5 h-5 text-pink-400" />
        </div>
        <div className="absolute top-1/2 right-1/4 opacity-40 animate-pulse" style={{animationDelay: '2s'}}>
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
    </footer>
  );
}