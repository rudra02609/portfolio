import React from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaAward, FaCertificate } from "react-icons/fa";
import { portfolioData } from "../constants/portfolioData";

export default function Education() {
  
  // Choose icon based on event type
  const getTimelineIcon = (type) => {
    switch (type) {
      case "education":
        return <FaGraduationCap className="text-brand-cyan" />;
      case "achievement":
        return <FaAward className="text-brand-purple" />;
      default:
        return <FaCertificate className="text-brand-magenta" />;
    }
  };

  // Choose icon border/shadow color classes based on event type
  const getTimelineColorClass = (type) => {
    switch (type) {
      case "education":
        return "border-brand-cyan shadow-brand-cyan/20";
      case "achievement":
        return "border-brand-purple shadow-brand-purple/20";
      default:
        return "border-brand-magenta shadow-brand-magenta/20";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="education" className="py-24 px-6 relative bg-bg-black overflow-hidden border-t border-white/5">
      {/* Ambient backgrounds */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-brand-cyan/5 blur-[120px] top-[15%] left-[-150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            Education & <span className="text-gradient text-gradient-cyan-blue">Timeline</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] bg-gradient-to-r from-brand-cyan to-brand-blue mx-auto rounded-full"
          />
        </div>

        {/* Timeline container */}
        <div className="relative border-l-2 border-slate-900/80 ml-4 sm:ml-6 md:ml-12 pl-8 sm:pl-10 space-y-12">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {portfolioData.timeline.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative mb-12 last:mb-0"
              >
                {/* Glowing Node Dot on Timeline Line */}
                <span className={`absolute -left-[53px] sm:-left-[57px] md:-left-[65px] top-1.5 w-10 h-10 rounded-full bg-[#0a0a10] border-2 ${getTimelineColorClass(item.type)} shadow-md flex items-center justify-center text-sm sm:text-base z-10 transition-transform duration-300 hover:scale-110`}>
                  {getTimelineIcon(item.type)}
                </span>

                {/* Event Card */}
                <div className="glass glow-card rounded-2xl p-6 md:p-8 border border-white/5 relative">
                  {/* Floating Date Badge */}
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-slate-900/60 border border-white/5 text-slate-400 mb-4">
                    {item.date}
                  </span>

                  {/* Title and Organization */}
                  <h3 className="text-xl font-bold text-slate-205 mb-1 tracking-wide">
                    {item.title}
                  </h3>
                  <h4 className="text-sm font-semibold text-brand-cyan mb-4">
                    {item.subtitle}
                  </h4>

                  {/* Description Paragraph */}
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Tech Tags / Badges */}
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-slate-450 bg-slate-950/40 border border-white/5 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
