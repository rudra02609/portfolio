import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { about, stats, profile } from '../../constants/portfolioData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="About"
          title="Who I Am"
          subtitle={profile.aboutShort}
        />

        {/* Bio + highlights */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 sm:p-8 space-y-4"
        >
          {about.bio.map((para, i) => (
            <p key={i} className="text-[15px] sm:text-[16px] text-white/70 leading-relaxed">
              {para}
            </p>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {about.highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center gap-2 text-[13px] sm:text-[14px] text-white/80 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5"
              >
                <span aria-hidden="true">{h.icon}</span>
                <span>{h.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats — genuine portfolio statistics */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={1}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-3xl p-5 sm:p-6 flex flex-col gap-1 text-center glow-card"
            >
              <span
                className="text-[28px] sm:text-[36px] leading-none text-gradient text-gradient-cyan-blue"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.value}
              </span>
              <span className="text-[12px] sm:text-[13px] text-white/50">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
