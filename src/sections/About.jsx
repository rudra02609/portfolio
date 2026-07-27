import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaCode, FaAward } from "react-icons/fa";
import { portfolioData } from "../constants/portfolioData";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-24 px-6 relative bg-bg-black overflow-hidden border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-cyan/5 blur-[100px] top-[20%] left-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            About <span className="text-gradient text-gradient-cyan-blue">Me</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left bio column */}
          <div className="lg:col-span-7 space-y-6">
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-slate-200"
            >
              Who is Rudra Prajapati?
            </motion.h3>
            
            {portfolioData.about.bio.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={itemVariants}
                className="text-slate-450 text-base md:text-lg leading-relaxed text-justify"
              >
                {paragraph}
              </motion.p>
            ))}

            {/* Quick highlights bullets */}
            <motion.div variants={itemVariants} className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl glass border border-white/5">
                <FaGraduationCap className="text-brand-cyan text-xl flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-350">
                  Pursuing B.Tech AIML
                </span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl glass border border-white/5">
                <FaCode className="text-brand-blue text-xl flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-355">
                  Full Stack Python & JS
                </span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl glass border border-white/5">
                <FaAward className="text-brand-purple text-xl flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-355">
                  Stanford ML Certified
                </span>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl glass border border-white/5">
                <span className="text-brand-magenta text-lg font-bold flex-shrink-0">🤖</span>
                <span className="text-sm font-semibold text-slate-355">
                  Deep Learning & Vision
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right stats column */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 w-full pt-4 lg:pt-0">
            {portfolioData.stats.map((stat) => (
              <motion.div
                key={stat.key}
                variants={statCardVariants}
                whileHover={{ scale: 1.05 }}
                className="glass glow-card rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-white/5 aspect-square relative"
              >
                {/* Visual glow backdrop for card */}
                <div className="absolute w-12 h-12 rounded-full bg-brand-cyan/10 blur-xl pointer-events-none" />
                
                <h4 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple mb-2 tracking-tight">
                  {stat.value}
                </h4>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
