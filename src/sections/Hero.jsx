import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowDown, FaGithub, FaLinkedinIn, FaEnvelope, FaFileDownload } from "react-icons/fa";
import { portfolioData } from "../constants/portfolioData";
import Magnetic from "../components/effects/Magnetic";

const words = ["AI/ML Solutions", "Deep Learning Models", "Python Applications", "Full Stack Frontends"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 35 : 75;

    if (!isDeleting && currentText === currentWord) {
      // Wait at the end of word
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? currentWord.substring(0, prev.length - 1)
            : currentWord.substring(0, prev.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-bg-black"
    >
      {/* Aurora Ambient Lighting Glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[130px] -top-20 -left-10 animate-pulse pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-cyan/800 blur-[160px] top-[20%] right-[-100px] opacity-15 pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-blue/10 blur-[120px] bottom-10 left-[30%] pointer-events-none" />

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Area */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Open for Placement Opportunities
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl font-bold tracking-widest text-slate-400 mb-2 uppercase"
          >
            Hello, I am
          </motion.h3>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-100"
          >
            {portfolioData.profile.name}
          </motion.h1>

          {/* Typing Sub-Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-10 md:h-12 flex items-center mb-6 text-xl sm:text-2xl md:text-3xl font-extrabold"
          >
            <span className="text-slate-400 mr-2.5">I engineer</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple border-r-2 border-brand-purple pr-1 animate-pulse">
              {currentText}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mb-8"
          >
            {portfolioData.profile.tagline}
          </motion.p>

          {/* Buttons & socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-5 w-full"
          >
            {/* View Projects CTA */}
            <Magnetic strength={0.2}>
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-white shadow-lg hover:shadow-brand-blue/30 transition-all duration-300 transform active:scale-95"
              >
                View Projects
              </a>
            </Magnetic>

            {/* Resume CTA */}
            <Magnetic strength={0.2}>
              <a
                href={portfolioData.profile.resumeUrl}
                className="px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider border border-white/10 glass text-slate-300 hover:text-white hover:border-slate-400 transition-all duration-300 flex items-center gap-2"
              >
                <FaFileDownload />
                Get Resume
              </a>
            </Magnetic>
            
            {/* Social Panel */}
            <div className="flex items-center gap-3.5 ml-0 sm:ml-4 mt-2 sm:mt-0">
              <a
                href={`https://github.com/${portfolioData.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-white/5 glass text-slate-400 hover:text-brand-cyan hover:border-brand-cyan/30 transition-colors"
                aria-label="GitHub Profile"
              >
                <FaGithub size={18} />
              </a>
              <a
                href={portfolioData.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-white/5 glass text-slate-400 hover:text-brand-blue hover:border-brand-blue/30 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="p-3 rounded-xl border border-white/5 glass text-slate-400 hover:text-brand-purple hover:border-brand-purple/30 transition-colors"
                aria-label="Email Address"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Abstract Graphic Illustration Area (NO PHOTOS) */}
        <div className="lg:col-span-5 flex justify-center w-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="w-full max-w-[420px] aspect-square relative"
          >
            {/* Background revolving ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-slate-800/40"
            />
            
            {/* SVG Vector graphic */}
            <svg
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full relative z-10"
            >
              {/* Central Code Cube with Glow */}
              <defs>
                <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="cubeGlow">
                  <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Floating Orbiting Nodes (AI Nodes) */}
              {/* Node 1 */}
              <motion.circle
                cx="110" cy="130" r="12"
                fill="#06b6d4"
                filter="url(#cubeGlow)"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <line x1="110" y1="130" x2="250" y2="250" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1.5" />

              {/* Node 2 */}
              <motion.circle
                cx="380" cy="110" r="10"
                fill="#a855f7"
                filter="url(#cubeGlow)"
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <line x1="380" y1="110" x2="250" y2="250" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" />

              {/* Node 3 */}
              <motion.circle
                cx="80" cy="340" r="14"
                fill="#3b82f6"
                filter="url(#cubeGlow)"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <line x1="80" y1="340" x2="250" y2="250" stroke="rgba(59, 130, 246, 0.25)" strokeWidth="1.5" />

              {/* Node 4 */}
              <motion.circle
                cx="400" cy="320" r="9"
                fill="#ec4899"
                filter="url(#cubeGlow)"
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
              <line x1="400" y1="320" x2="250" y2="250" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />

              {/* Central Shield Graphic */}
              <motion.polygon
                points="250,110 370,180 370,320 250,390 130,320 130,180"
                stroke="url(#cubeGradient)"
                strokeWidth="2.5"
                fill="rgba(15, 23, 42, 0.6)"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Inner Brackets logic symbol */}
              <motion.path
                d="M 210,210 L 190,250 L 210,290"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 290,210 L 310,250 L 290,290"
                stroke="#a855f7"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 265,210 L 235,290"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>

            {/* Coding float panels */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-0 glass border border-white/10 px-4 py-2.5 rounded-xl z-20 flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="font-mono text-[11px] font-bold text-slate-300">python.py</span>
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 right-4 glass border border-white/10 px-4 py-2.5 rounded-xl z-20 flex items-center gap-3"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="font-mono text-[11px] font-bold text-slate-300">model.train()</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mouse scroll-down indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-60">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-slate-400">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-9 rounded-full border-2 border-slate-500/50 flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-brand-cyan animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
