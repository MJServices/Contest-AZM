import React from 'react';

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-purple-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
      <div className="absolute top-3/4 right-1/4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-cyan-400/30 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
    </div>
  );
}