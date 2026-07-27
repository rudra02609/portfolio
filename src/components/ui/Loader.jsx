import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1300; // Total duration in ms
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 bg-[#020204] z-[9999] flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Decorative Aurora background inside Loader */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] -top-10 -left-10" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-600/10 blur-[100px] -bottom-10 -right-10" />

      <div className="flex flex-col items-center select-none z-10">
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple mb-8 font-sans"
        >
          &lt; RUDRA.AI /&gt;
        </motion.div>
        
        {/* Loading Progress Bar Container */}
        <div className="w-56 h-[3px] bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-900/30">
          <div
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage Counter */}
        <motion.span 
          key={Math.floor(progress)}
          initial={{ opacity: 0.7, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold text-slate-400 tracking-[0.2em] font-mono"
        >
          {Math.floor(progress)}%
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-slate-500 mt-12 tracking-wide font-sans"
        >
          ENGINEERING INTELLIGENCE
        </motion.p>
      </div>
    </motion.div>
  );
}
