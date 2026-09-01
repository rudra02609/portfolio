import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profile } from '../constants/portfolioData';

type Mode = 'login' | 'register';

/**
 * Full-screen authentication gate shown before the portfolio is accessible.
 * Rendered as a fixed overlay ON TOP of the (locked) portfolio. It unmounts
 * completely once the visitor signs in, creates an account, or continues as
 * a guest, so no authentication UI remains in the page flow.
 */
export const AuthGate: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login, register, enterGuestMode, error, backendAvailable } = useAuth();
  const { toast } = useToast();

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    }
    if (mode === 'register' && password !== confirm) {
      e.confirm = 'Passwords do not match.';
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
        toast('Signed in successfully.', 'success');
      } else {
        await register({ email: email.trim(), password, name: name.trim() });
        toast('Account created successfully.', 'success');
      }
    } catch {
      /* error surfaced via context */
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (key: string) =>
    `portfolio-input w-full rounded-xl px-4 py-2.5 text-[14px] ${
      fieldErrors[key] ? 'border-red-400/60' : ''
    }`;

  return (
    <div
      id="auth-gate"
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto px-5 py-8"
      style={{
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div className="w-full max-w-md my-auto">
        <div className="text-center mb-6">
          <p
            className="text-white text-[24px] sm:text-[28px] mb-1"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
          >
            {profile.name}
          </p>
          <p className="text-white/45 text-[13px]">Sign in to continue to the portfolio</p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          {error && (
            <div className="text-red-300 text-[13px] border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setFieldErrors({});
                }}
                className={`flex-1 rounded-lg py-2 text-[14px] transition-colors cursor-pointer ${
                  mode === m ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Name (optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputCls('name')}
                />
              </div>
            )}

            <div>
              <label className="block text-[12px] text-white/50 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls('email')}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-[12px] mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] text-white/50 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={inputCls('password')}
              />
              {fieldErrors.password && (
                <p className="text-red-400 text-[12px] mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[12px] text-white/50 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputCls('confirm')}
                />
                {fieldErrors.confirm && (
                  <p className="text-red-400 text-[12px] mt-1">{fieldErrors.confirm}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl px-4 py-3 text-[15px] bg-white text-black font-medium hover:bg-white/85 transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting
                ? 'Please wait…'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 text-white/30 text-[12px] my-5">
            <span className="flex-1 h-px bg-white/10" />
            or
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => {
              enterGuestMode();
              toast('Continuing as guest.', 'info');
            }}
            className="w-full rounded-xl px-4 py-3 text-[14px] border border-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Continue as Guest
          </button>

          {!backendAvailable && (
            <p className="text-white/40 text-[12px] text-center mt-5 leading-relaxed">
              The authentication server is not reachable. You can still continue as a guest.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
