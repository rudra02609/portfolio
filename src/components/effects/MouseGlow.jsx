import React, { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(0.18);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-5 transition-opacity duration-700"
      style={{
        opacity,
        background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 40%, transparent 85%)`,
      }}
    />
  );
}
