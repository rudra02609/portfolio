import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { BackgroundVideo } from './components/BackgroundVideo';
import { CustomCursor } from './components/effects/CustomCursor';
import { AuthGate } from './components/AuthGate';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AccountPanel } from './components/AccountPanel';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Timeline } from './components/sections/Timeline';
import { TaskManager } from './components/sections/TaskManager';
import { Certificates } from './components/sections/Certificates';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

export default function App() {
  const { isLoadingGate, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const onNavigate = (section: string) => {
    setActiveSection(section);
    // Scroll to the section when navigating via navbar
    const el = document.getElementById(section);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.offsetTop - headerOffset;
      const offsetPosition = elementPosition;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Lock page scroll while the authentication gate is visible so the portfolio
  // behind it cannot be scrolled or interacted with.
  useEffect(() => {
    const lock = !isLoadingGate && !isAuthenticated;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoadingGate, isAuthenticated]);

  // New: Scroll-spy to update active navbar section on scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'certificates', 'tasks', 'contact'];
    const navbarHeight = 80;

    // Throttled scroll handler - checks section positions against viewport
    let ticking = false;
    const checkActiveSection = () => {
      if (ticking) return;
      ticking = true;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollBottom = scrollY + window.innerHeight;
      let active = 'hero';

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (!el) continue;
        const sectionTop = el.offsetTop;
        const sectionHeight = el.offsetHeight || 200;
        const sectionBottom = sectionTop + sectionHeight;

        // A section is "active" if the scroll position is within its bounds
        // Account for navbarHeight so the highlight kicks in before the section reaches the very top
        if (scrollY >= sectionTop - navbarHeight && scrollY < sectionBottom) {
          active = sections[i];
          break;
        }
      }

      if (activeSection !== active) {
        setActiveSection(active);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial check
    checkActiveSection();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Mouse-scrub controlled background video */}
      <BackgroundVideo />

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Fixed top Navbar */}
      <Navbar activeSection={activeSection} onNavigate={onNavigate} />

      {/* Floating account control (bottom-right) */}
      <AccountPanel />

      {/* Hero */}
      <Hero />

      {/* Sections — NOTE: no authentication section lives in this flow */}
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Certificates />
      <TaskManager />
      <Contact />
      <Footer />

      {/* Authentication gate overlay — rendered only until the visitor
          signs in, creates an account, or continues as guest. Unmounts
          completely once authenticated. */}
      {!isLoadingGate && !isAuthenticated && <AuthGate />}
    </main>
  );
}
