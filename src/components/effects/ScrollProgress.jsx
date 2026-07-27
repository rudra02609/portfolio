import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Create a spring animation for the scale to make scroll progress extra fluid
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple origin-left z-[9999] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
