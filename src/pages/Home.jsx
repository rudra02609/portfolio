import React from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Skills from "../sections/Skills";
import Projects from "../sections/Projects";
import TaskManager from "../sections/TaskManager";
import Education from "../sections/Education";
import Contact from "../sections/Contact";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg-black text-slate-100 overflow-x-hidden antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <TaskManager />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
