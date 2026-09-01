import React from 'react';
import { profile, socialLinks } from '../../constants/portfolioData';
import { SocialIcon } from '../ui/SocialIcon';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      id="footer"
      className="relative z-[1] w-full section-border px-5 sm:px-8 md:px-10 py-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p
            className="text-white text-[17px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {profile.name}
          </p>
          <p className="text-white/40 text-[12px] mt-1">
            © {year} {profile.name}. Built with React, Vite & Tailwind CSS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
              aria-label={link.label}
            >
              <SocialIcon name={link.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
