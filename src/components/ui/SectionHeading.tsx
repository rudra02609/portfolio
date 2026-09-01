import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}) => {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start';
  return (
    <div className={`flex flex-col gap-3 mb-10 sm:mb-14 ${alignCls}`}>
      {eyebrow && (
        <span className="inline-flex text-[12px] sm:text-[13px] uppercase tracking-[0.25em] text-white/40">
          {eyebrow}
        </span>
      )}
      <h2
        className="text-[26px] sm:text-[34px] md:text-[40px] leading-tight text-white"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-[15px] sm:text-[16px] text-white/60 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
