import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Core UX Components
import SEO from "./components/layout/SEO";
import Loader from "./components/ui/Loader";
import CustomCursor from "./components/effects/CustomCursor";
import MouseGlow from "./components/effects/MouseGlow";
import ParticlesBg from "./components/effects/ParticlesBg";
import ScrollProgress from "./components/effects/ScrollProgress";

// Page Composition
import Home from "./pages/Home";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Search Engine Optimization Metadata */}
      <SEO />

      {/* Entry Loading Screen */}
      <AnimatePresence mode="wait">
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Portfolio Layout (renders after preloader completes) */}
      {!isLoading && (
        <>
          {/* Scroll progress bar */}
          <ScrollProgress />
          
          {/* Custom Cursor interaction */}
          <CustomCursor />
          
          {/* Interactive Mouse Glow Backlight */}
          <MouseGlow />
          
          {/* Canvas Background Particles */}
          <ParticlesBg />
          
          {/* Home Page Composed Layout */}
          <Home />
        </>
      )}
    </>
  );
}