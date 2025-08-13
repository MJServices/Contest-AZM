import React from "react";
import { Home, Palette, Shield } from "lucide-react";

export default function UserTypesSection() {
  const userTypes = [
    {
      title: "For Homeowners",
      features: [
        "User Registration & Authentication",
        "Inspiration Gallery Browsing",
        "Product Catalog Shopping",
        "Shopping Cart Management",
        "Professional Consultations",
        "Design Collections",
        "Review & Rating System",
        "Personal Dashboard",
      ],
      icon: <Home className="w-16 h-16" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "For Interior Designers",
      features: [
        "Professional Registration",
        "Portfolio Management",
        "Consultation Scheduling",
        "Client Interaction Tools",
        "Review Management",
        "Business Dashboard",
        "Project Showcasing",
        "Earnings Tracking",
      ],
      icon: <Palette className="w-16 h-16" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "For Administrators",
      features: [
        "User Management System",
        "Content Management",
        "Designer Verification",
        "Analytics & Reporting",
        "System Administration",
        "Quality Control",
        "Platform Monitoring",
        "Data Management",
      ],
      icon: <Shield className="w-16 h-16" />,
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <section className="relative z-10 py-24 px-4 md:py-32 md:px-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent leading-[1.2]">
          Built for Everyone
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {userTypes.map((userType, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 hover:border-purple-400/50 transform hover:scale-105 hover:-translate-y-4 transition-all duration-700"
            >
              <div className="text-center mb-8">
                <div
                  className={`inline-flex w-24 h-24 rounded-2xl bg-gradient-to-r ${userType.color} items-center justify-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
                >
                  {userType.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-500">
                  {userType.title}
                </h3>
              </div>

              <div className="space-y-3">
                {userType.features.map((feature, fIndex) => (
                  <div
                    key={fIndex}
                    className="flex items-center space-x-3 group-hover:translate-x-2 transition-all duration-300"
                    style={{ transitionDelay: `${fIndex * 50}ms` }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full group-hover:scale-150 transition-all duration-300"></div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm md:text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
