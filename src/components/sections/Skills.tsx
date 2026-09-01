import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { skills } from '../../constants/portfolioData';

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(skills[0].category);

  const category = skills.find((c) => c.category === activeCategory) || skills[0];

  return (
    <section
      id="skills"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Skills"
          title="My Toolbox"
          subtitle="Technologies and tools I work with across AI/ML, web development, data, and engineering workflows."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {skills.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setActiveCategory(cat.category)}
              className={`rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] border transition-colors duration-200 cursor-pointer ${
                activeCategory === cat.category
                  ? 'bg-white text-black border-white'
                  : 'text-white/70 border-white/20 hover:border-white/60 hover:text-white'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Selected category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-5 glow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {item.icon && (
                    <span className="text-[18px]" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-white text-[14px] sm:text-[15px]">{item.name}</span>
                </div>
                {typeof item.level === 'number' && (
                  <span className="text-[12px] text-white/50">{item.level}%</span>
                )}
              </div>
              {typeof item.level === 'number' && (
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.level}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.05 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
