import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../constants/portfolioData";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...portfolioData.skills.map((c) => c.category)];

  // Flatten skills if "All", else filter by active category
  const filteredSkills =
    activeCategory === "All"
      ? portfolioData.skills.flatMap((c) => c.items)
      : portfolioData.skills.find((c) => c.category === activeCategory)?.items || [];

  return (
    <section id="skills" className="py-24 px-6 relative bg-bg-black overflow-hidden border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-purple/5 blur-[120px] bottom-0 right-[-100px] pointer-events-none" />

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
            My <span className="text-gradient text-gradient-blue-purple">Skills</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] bg-gradient-to-r from-brand-blue to-brand-purple mx-auto rounded-full"
          />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-purple/20"
                    : "glass border border-white/5 text-slate-400 hover:text-slate-100"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  key={skill.name}
                  className="glass glow-card rounded-2xl p-6 border border-white/5 flex items-center gap-5"
                >
                  {/* Skill Icon */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-350 shadow-inner flex-shrink-0 text-3xl">
                    <IconComponent className="text-slate-200" />
                  </div>

                  {/* Skill Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="font-bold text-slate-200 truncate text-sm sm:text-base">
                        {skill.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 tracking-wider font-mono">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress Slider */}
                    <div className="w-full h-[6px] bg-slate-950 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
