import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { certificateDomains } from '../../constants/portfolioData';
import { FiExternalLink } from 'react-icons/fi';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function isImageFile(file: string): boolean {
  const lower = file.toLowerCase();
  return IMAGE_EXTS.some((ext) => lower.endsWith(ext));
}

export const Certificates: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<string>('all');

  const allDomains = certificateDomains.map((d) => d.domain);

  const filteredDomains =
    activeDomain === 'all'
      ? certificateDomains
      : certificateDomains.filter((d) => d.domain === activeDomain);

  const totalCertificates = certificateDomains.reduce(
    (sum, d) => sum + d.certificates.length,
    0,
  );

  return (
    <section
      id="certificates"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Credentials"
          title="Certificates & Credentials"
          subtitle={`Professional certifications, hackathon participation, and completed courses — ${totalCertificates} certificates across ${certificateDomains.length} domains.`}
        />

        {/* Domain filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            type="button"
            onClick={() => setActiveDomain('all')}
            className={`rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] border transition-colors duration-200 cursor-pointer ${
              activeDomain === 'all'
                ? 'bg-white text-black border-white'
                : 'text-white/70 border-white/20 hover:border-white/60 hover:text-white'
            }`}
          >
            All ({totalCertificates})
          </button>
          {allDomains.map((domain) => {
            const count = certificateDomains.find((d) => d.domain === domain)?.certificates.length ?? 0;
            return (
              <button
                key={domain}
                type="button"
                onClick={() => setActiveDomain(domain)}
                className={`rounded-full px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] border transition-colors duration-200 cursor-pointer ${
                  activeDomain === domain
                    ? 'bg-white text-black border-white'
                    : 'text-white/70 border-white/20 hover:border-white/60 hover:text-white'
                }`}
              >
                {domain} ({count})
              </button>
            );
          })}
        </div>

        {/* Domain sections */}
        <AnimatePresence mode="wait">
          {filteredDomains.map((domainGroup) => (
            <motion.div
              key={domainGroup.domain}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mb-12 last:mb-0"
            >
              {/* Domain header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[22px] leading-none">{domainGroup.icon}</span>
                <h3
                  className="text-white text-[18px] sm:text-[20px]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {domainGroup.domain}
                </h3>
                <span className="text-[12px] text-white/40 whitespace-nowrap shrink-0">
                  {domainGroup.certificates.length} certificate{domainGroup.certificates.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Certificate grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {domainGroup.certificates.map((cert, i) => {
                  const isImage = isImageFile(cert.file);
                  return (
                    <motion.div
                      key={cert.file}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="glass rounded-2xl overflow-hidden glow-card flex flex-col"
                    >
                      {/* Preview area */}
                      <a
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group"
                      >
                        {isImage ? (
                          <div className="w-full aspect-[16/10] bg-white/[0.02] flex items-center justify-center overflow-hidden">
                            <img
                              src={cert.file}
                              alt={cert.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-[16/10] bg-white/[0.02] overflow-hidden border-b border-white/5">
                            <iframe
                              src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0`}
                              title={cert.name}
                              className="w-full h-full border-0 pointer-events-none"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="flex items-center gap-2 text-[13px] text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <FiExternalLink size={14} />
                            View Certificate
                          </span>
                        </div>
                      </a>

                      {/* Card content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <h4
                          className="text-white text-[15px] sm:text-[16px] mb-1.5"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {cert.name}
                        </h4>
                        {cert.issuer && (
                          <p className="text-[13px] text-cyan-300/90 mb-2">{cert.issuer}</p>
                        )}
                        {cert.date && (
                          <p className="text-[12px] text-white/40 mb-2">{cert.date}</p>
                        )}
                        {cert.skills && cert.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                            {cert.skills.map((skill) => (
                              <span
                                key={skill}
                                className="text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-full px-2 py-0.5"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
