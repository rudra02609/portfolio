import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GOOGLE_CLIENT_ID } from '../services/authService';

/**
 * Full-screen Google login screen shown before the portfolio is accessible.
 * Rendered as a fixed overlay ON TOP of the (locked) portfolio. It unmounts
 * completely once the visitor signs in with Google, so no login UI remains
 * in the page flow.
 *
 * Uses Google Identity Services. On success the returned ID token credential
 * is sent to the backend (POST /api/auth/google) which verifies it server-side.
 */
export const AuthGate: React.FC = () => {
  const { loginWithGoogle, error, backendAvailable } = useAuth();
  const { toast } = useToast();
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Signal the Google button so it appears clickable.
  useEffect(() => {
    if (submitting) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [submitting]);

  // Load Google Identity Services and render the sign-in button.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (!window) return;

    const existing = document.getElementById('gsi-script');
    const gsiScript =
      (existing as HTMLScriptElement | null) ||
      (() => {
        const s = document.createElement('script');
        s.id = 'gsi-script';
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
        return s;
      })();

    const render = () => {
      const global = window as unknown as {
        google?: {
          accounts: {
            id: {
              initialize: (opts: {
                client_id: string;
                callback: (resp: { credential?: string }) => void;
              }) => void;
              renderButton: (
                el: HTMLElement,
                opts: Record<string, unknown>
              ) => void;
            };
          };
        };
      };
      if (!global.google?.accounts?.id || !buttonRef.current) return;

      global.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) {
            toast('Google sign-in was cancelled.', 'error');
            return;
          }
          try {
            setSubmitting(true);
            await loginWithGoogle(response.credential);
            toast('Signed in successfully.', 'success');
          } catch {
            // Error surfaced via the context and rendered below.
          } finally {
            setSubmitting(false);
          }
        },
      });

      global.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        width: 300,
        text: 'continue_with',
      });
    };

    if (gsiScript.getAttribute('data-loaded')) {
      render();
    } else {
      const onLoad = () => {
        gsiScript.setAttribute('data-loaded', 'true');
        render();
      };
      gsiScript.addEventListener('load', onLoad);
      return () => gsiScript.removeEventListener('load', onLoad);
    }
  }, [loginWithGoogle, toast]);

  return (
    <div
      id="auth-gate"
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto px-5 py-8"
      style={{
        backgroundColor: 'rgba(4, 4, 8, 0.92)',
      }}
    >
      <div className="w-full max-w-md my-auto">
        <div className="text-center mb-6">
          <p
            className="text-white text-[24px] sm:text-[28px] mb-2"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
          >
            My Portfolio
          </p>
          <p className="text-white/45 text-[13px]">Welcome to My Portfolio</p>
          <p className="text-white/45 text-[13px]">Sign in with Google to continue</p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8 text-center">
          {!GOOGLE_CLIENT_ID && (
            <div className="text-red-300 text-[13px] border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-3 mb-5">
              Google Client ID is not configured. Set VITE_GOOGLE_CLIENT_ID in your
              frontend .env file.
            </div>
          )}

          {error && (
            <div className="text-red-300 text-[13px] border border-red-400/30 bg-red-400/10 rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <div ref={buttonRef} className="flex justify-center" />

          {submitting && (
            <p className="text-white/50 text-[13px] mt-4">Signing you in…</p>
          )}

          {!backendAvailable && (
            <p className="text-white/40 text-[12px] mt-6 leading-relaxed">
              The authentication server is not reachable. Please make sure the backend is
              running and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
