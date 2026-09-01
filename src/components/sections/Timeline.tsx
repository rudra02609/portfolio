import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { education, experience, certifications, achievements } from '../../constants/portfolioData';

type TabKey = 'education' | 'experience' | 'certifications' | 'achievements';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'achievements', label: 'Achievements' },
];

export const Timeline: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('education');

  const data = tab === 'education' ? education : tab === 'experience' ? experience : tab === 'certifications' ? certifications : achievements;

  return (
    <section
      id="timeline"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Journey"
          title="Education, Experience & More"
          subtitle="My academic and professional milestones."
        />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] border transition-colors duration-200 cursor-pointer ${
                tab === t.key
                  ? 'bg-white text-black border-white'
                  : 'text-white/70 border-white/20 hover:border-white/60 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {data.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center max-w-lg mx-auto">
            <p className="text-white/50 text-[15px] mb-2">Coming soon</p>
            <p className="text-white/35 text-[13px] leading-relaxed">
              I'm working on new achievements to share here. Check back soon.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-white/15 ml-3 sm:ml-5">
            {data.map((item, i) => (
              <motion.div
                key={`${item.type}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="relative pl-6 sm:pl-10 pb-10 last:pb-0"
              >
                {/* Dot */}
                <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

                <div className="glass rounded-2xl p-5 sm:p-6 glow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3
                      className="text-white text-[16px] sm:text-[18px]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[12px] text-white/40 whitespace-nowrap">{item.date}</span>
                  </div>
                  {item.subtitle && (
                    <p className="text-[13px] text-cyan-300/90 mb-2">{item.subtitle}</p>
                  )}
                  <p className="text-white/60 text-[13px] sm:text-[14px] leading-relaxed">
                    {item.description}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
