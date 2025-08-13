import React, { useState, useEffect } from 'react';

export default function MouseFollower({ activeCard }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-150 ease-out"
      style={{
        left: `${mousePosition.x - 12}px`,
        top: `${mousePosition.y - 12}px`,
        transform: `scale(${activeCard !== null ? 1.5 : 1})`
      }}
    />
  );
}