import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Search, ShoppingBag, User, LogIn, UserPlus, LayoutDashboard, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isAuthenticated
    ? [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Gallery", href: "/gallery", icon: Search },
        { name: "Consultations", href: "/consultations", icon: Calendar },
      ]
    : [
        { name: "Home", href: "/", icon: Home },
        { name: "Products", href: "/products", icon: Search },
        { name: "Gallery", href: "/gallery", icon: ShoppingBag },
      ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Enhanced Glass Morphism Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-2xl shadow-purple-500/10' 
          : 'backdrop-blur-lg bg-black/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/"
              className={`group flex items-center space-x-3 transform transition-all duration-1000 hover:scale-110 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="relative">
                <Home className="w-8 h-8 text-purple-400 animate-pulse group-hover:text-pink-400 transition-colors duration-300" />
                <div className="absolute inset-0 w-8 h-8 bg-purple-400/20 rounded-full blur-lg group-hover:bg-pink-400/30 transition-all duration-300"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:via-cyan-400 group-hover:to-purple-400 transition-all duration-500">
                DecorVista
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || 
                  (item.href.startsWith('#') && location.hash === item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 backdrop-blur-lg border border-purple-400/30' 
                        : 'hover:text-purple-300 hover:bg-white/10'
                    } ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Hover effect */}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 group-hover:w-full rounded-full"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 rounded-xl transition-all duration-300 -z-10"></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30">
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">
                      {user?.firstName || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-red-400/30 text-red-300 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="group flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-purple-300 transition-all duration-300 hover:scale-105"
                  >
                    <LogIn className="w-4 h-4 group-hover:scale-125 transition-all duration-300" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="group flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <UserPlus className="w-4 h-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 relative z-10" />
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-110 hover:rotate-180"
            >
              <div className="relative z-10">
                {menuOpen ? (
                  <X className="w-6 h-6 text-purple-300 animate-spin" />
                ) : (
                  <Menu className="w-6 h-6 text-purple-300 animate-pulse" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-lg"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/20">
            <div className="px-6 py-8 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30' 
                          : 'hover:bg-white/10 text-gray-300 hover:text-purple-300'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-125 transition-all duration-300" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="pt-6 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-purple-400/30">
                      <User className="w-5 h-5 text-purple-400" />
                      <span className="font-medium text-gray-300">
                        {user?.firstName || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl border border-red-400/30 text-red-300 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 text-gray-300 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

