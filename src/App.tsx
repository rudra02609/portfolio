import React, { useEffect } from 'react';
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
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

export default function App() {
  const { isLoadingGate, isAuthenticated } = useAuth();

  // Lock page scroll while the authentication gate is visible so the portfolio
  // behind it cannot be scrolled or interacted with.
  useEffect(() => {
    const lock = !isLoadingGate && !isAuthenticated;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoadingGate, isAuthenticated]);

  return (
    <main className="relative w-full min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Mouse-scrub controlled background video */}
      <BackgroundVideo />

      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Fixed top Navbar */}
      <Navbar />

      {/* Floating account control (bottom-right) */}
      <AccountPanel />

      {/* Hero */}
      <Hero />

      {/* Sections — NOTE: no authentication section lives in this flow */}
      <About />
      <Skills />
      <Projects />
      <Timeline />
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
