import React from "react";
import { FaGithub, FaLinkedinIn, FaEnvelope, FaChevronUp } from "react-icons/fa";
import { portfolioData } from "../../constants/portfolioData";
import Magnetic from "../effects/Magnetic";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="py-12 px-6 bg-[#040408] border-t border-white/5 relative">
      
      {/* Back to top widget */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <Magnetic strength={0.4}>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-slate-300 hover:text-white shadow-2xl transition-colors cursor-pointer"
            aria-label="Scroll back to top"
          >
            <FaChevronUp />
          </button>
        </Magnetic>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        
        {/* Left branding */}
        <div className="text-center md:text-left">
          <a href="#home" className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
            &lt;RUDRA.AI/&gt;
          </a>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            AI & ML Engineer / Full Stack Developer
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-4">
          <a
            href={`https://github.com/${portfolioData.contact.github}`}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-brand-cyan transition-colors"
            aria-label="GitHub Link"
          >
            <FaGithub size={16} />
          </a>
          <a
            href={portfolioData.contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-brand-blue transition-colors"
            aria-label="LinkedIn Link"
          >
            <FaLinkedinIn size={16} />
          </a>
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className="p-3 rounded-full bg-slate-900 border border-white/5 text-slate-400 hover:text-brand-purple transition-colors"
            aria-label="Email Link"
          >
            <FaEnvelope size={16} />
          </a>
        </div>

        {/* Right Copyright details */}
        <div className="text-center md:text-right text-xs text-slate-600 font-sans">
          <p>© {new Date().getFullYear()} {portfolioData.profile.name}. All Rights Reserved.</p>
          <p className="mt-0.5 opacity-60">Designed with passion & premium aesthetics.</p>
        </div>

      </div>
    </footer>
  );
}
