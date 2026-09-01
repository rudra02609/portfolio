import React, { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { profile } from '../constants/portfolioData';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Tasks', id: 'tasks' },
  { label: 'Contact', id: 'contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS, 160);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 w-full glass-nav px-5 sm:px-8 py-4 flex justify-between items-center select-none"
      >
        {/* Logo (left) */}
        <a href="#hero" className="flex items-center gap-2 cursor-pointer">
          <span
            className="text-[16px] sm:text-[19px] tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {profile.name}
          </span>
          <span
            className="text-[18px] text-white select-none inline-block leading-none"
            aria-hidden="true"
          >
            ✳︎
          </span>
        </a>

        {/* Desktop nav links (center, hidden below lg) */}
        <nav
          id="desktop-nav"
          className="hidden lg:flex items-center text-[14px] sm:text-[15px] text-white/70"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link, index) => (
            <React.Fragment key={link.id}>
              <a
                href={`#${link.id}`}
                className={`transition-colors cursor-pointer ${
                  activeId === link.id ? 'text-white' : 'hover:text-white'
                }`.trim()}
              >
                {link.label}
              </a>
              {index < NAV_LINKS.length - 1 && (
                <span className="text-white/25 select-none whitespace-pre mx-2">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Desktop CTA (right, hidden below lg) */}
        <div className="hidden lg:block">
          <a
            id="desktop-cta"
            href="#contact"
            className="text-[15px] text-white underline underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger button (visible below lg) */}
        <button
          id="mobile-menu-btn"
          type="button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] relative z-[60] focus:outline-none cursor-pointer"
        >
          <span
            className={`w-6 h-[2px] bg-white block transition-all duration-300 transform origin-center ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white block transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white block transition-all duration-300 transform origin-center ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-nav-overlay"
        className={`fixed inset-0 bg-black/95 backdrop-blur-md z-[55] flex flex-col justify-center px-8 gap-5 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {NAV_LINKS.map((link) => (
          <div key={link.id} className="flex items-center gap-3">
            <a
              href={`#${link.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[28px] font-medium transition-colors ${
                activeId === link.id ? 'text-white' : 'text-white/60'
              }`}
            >
              {link.label}
            </a>
          </div>
        ))}
        <a
          href="#contact"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[28px] font-medium text-white underline underline-offset-4 transition-opacity"
        >
          Get in touch
        </a>
      </div>
    </>
  );
};
