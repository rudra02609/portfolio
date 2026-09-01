import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';
import { hero, profile } from '../constants/portfolioData';

export const Hero: React.FC = () => {
  const { displayed, done } = useTypewriter(hero.typewriter.join(' · '), {
    speed: 45,
    startDelay: 400,
  });

  const [pillsVisible, setPillsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPillsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative z-[1] w-full min-h-screen flex flex-col justify-end pb-24 pt-28 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
    >
      <div className="max-w-3xl relative z-10">
        {/* Identity headline — single clean intro */}
        <motion.h1
          id="intro-label"
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          className="text-[30px] sm:text-[44px] md:text-[52px] leading-[1.05] text-white mb-5"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
        >
          Hey, I'm <span className="text-gradient text-gradient-cyan-blue">{profile.name}</span>
        </motion.h1>

        {/* Role — typewriter line */}
        <p
          id="typewriter-paragraph"
          className="text-white font-normal mb-5 sm:mb-7"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.45,
            minHeight: '2em',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink"
              aria-hidden="true"
            />
          )}
        </p>

        {/* Tagline */}
        <p className="text-white/60 text-[15px] sm:text-[17px] max-w-xl leading-relaxed mb-8">
          {profile.tagline}
        </p>

        {/* CTA — View Resume only */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-black rounded-full text-[14px] sm:text-[15px] px-6 py-[0.55em] font-medium hover:bg-black hover:text-white border border-white transition-colors duration-200 cursor-pointer"
          >
            View Resume
          </a>
        </div>
      </div>
    </section>
  );
};
