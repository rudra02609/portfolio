import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { SocialIcon } from '../ui/SocialIcon';
import { useToast } from '../../context/ToastContext';
import { sendContactMessage } from '../../services/contactService';
import { contactInfo } from '../../constants/portfolioData';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = { name: '', email: '', subject: '', message: '' };

export const Contact: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) {
      e.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) e.message = 'Please enter a message.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const result = await sendContactMessage(form);
      toast(result.message, result.success ? 'success' : 'error');
      if (result.success && !result.fallback) setForm(INITIAL);
    } catch {
      toast('Failed to send your message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const inputErr = (key: keyof FormState) =>
    errors[key] ? 'border-red-400/60' : '';

  return (
    <section
      id="contact"
      className="relative z-[1] w-full py-20 sm:py-28 px-5 sm:px-8 md:px-10 section-border"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          subtitle="Have a question, a project, or just want to say hi? Reach out — I'd love to hear from you."
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="glass rounded-3xl p-6">
              <h4
                className="text-white text-[16px] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Contact Details
              </h4>
              <ul className="space-y-3 text-[14px] text-white/70">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <SocialIcon name="mail" />
                  </span>
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[14px]">
                    ☎
                  </span>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <SocialIcon name="github" />
                  </span>
                  <a
                    href={contactInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    @{contactInfo.github}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                    <SocialIcon name="linkedin" />
                  </span>
                  <a
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {contactInfo.linkedin}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[14px]">
                    📍
                  </span>
                  <span>{contactInfo.location}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8 space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={`portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px] ${inputErr('name')}`}
                />
                {errors.name && <p className="text-red-400 text-[12px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px] ${inputErr('email')}`}
                />
                {errors.email && <p className="text-red-400 text-[12px] mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[12px] text-white/50 mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this about?"
                className="portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[12px] text-white/50 mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message…"
                rows={5}
                className={`portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px] resize-none ${inputErr('message')}`}
              />
              {errors.message && <p className="text-red-400 text-[12px] mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl px-5 py-3 text-[15px] bg-white text-black font-medium hover:bg-white/85 transition-colors cursor-pointer disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
