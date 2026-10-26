import React, { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Tasks', id: 'tasks' },
  { label: 'Contact', id: 'contact' },
];

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  // Live clock — updates every second using the user's local browser time.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 w-full glass-nav px-5 sm:px-8 py-4 flex justify-between items-center select-none"
      >
        {/* Logo (left) */}
        <button
          type="button"
          onClick={() => handleNavigate('hero')}
          aria-label="Go to home"
          className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
        >
          <span
            className="text-[16px] sm:text-[19px] tracking-tight text-white whitespace-nowrap"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            My Portfolio
          </span>
        </button>

        {/* Desktop nav links (center, hidden below lg) */}
        <nav
          id="desktop-nav"
          className="hidden lg:flex items-center text-[14px] sm:text-[15px] text-white/70"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link, index) => (
            <React.Fragment key={link.id}>
              <button
                type="button"
                onClick={() => handleNavigate(link.id)}
                className={`bg-transparent border-0 p-0 text-[14px] sm:text-[15px] transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </button>
              {index < NAV_LINKS.length - 1 && (
                <span className="text-white/25 select-none whitespace-pre mx-2">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Current time (right, hidden below lg) */}
        <div className="hidden lg:block text-[14px] sm:text-[15px] text-white/70 whitespace-nowrap">
          {formatTime(now)}
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
            <button
              type="button"
              onClick={() => handleNavigate(link.id)}
              className={`bg-transparent border-0 p-0 text-[28px] font-medium transition-colors cursor-pointer ${
                activeSection === link.id
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          </div>
        ))}
        <div className="text-white/40 text-[16px] mt-2">{formatTime(now)}</div>
      </div>
    </>
  );
};