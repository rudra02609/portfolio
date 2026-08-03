import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import Magnetic from "../effects/Magnetic";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "tasks", label: "Tasks" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const activeSection = useScrollSpy(
    navLinks.map((link) => link.id),
    120
  );

  // Monitor scroll direction to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the top
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
        setIsOpen(false); // Close mobile menu when scrolling down
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 glass-nav h-20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="text-xl md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">
          &lt;RUDRA.AI/&gt;
        </a>

        {/* Desktop navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Magnetic key={link.id} strength={0.25}>
                <a
                  href={`#${link.id}`}
                  className={`px-5 py-2 text-sm font-semibold tracking-wider transition-all duration-300 relative rounded-lg ${
                    isActive ? "text-slate-100" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/5 rounded-lg border-b border-brand-cyan/40"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              </Magnetic>
            );
          })}
        </nav>

        {/* Hamburger Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden w-full absolute top-20 left-0 glass border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col py-6 px-8 gap-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`py-2.5 text-base font-semibold tracking-widest border-b border-white/5 transition-all duration-300 ${
                      isActive ? "text-brand-cyan pl-3" : "text-slate-400 hover:text-slate-100 pl-0"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
