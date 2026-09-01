import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * Small floating account control fixed to the bottom-right corner.
 * Renders only after authentication (signed-in user OR guest), giving access
 * to the account email / guest indicator and a logout/exit control.
 */
export const AccountPanel: React.FC = () => {
  const { user, guest, handleLogout } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  if (!user && !guest) return null;

  const initial = (user ? user.name || user.email : 'Guest').charAt(0).toUpperCase();

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-2">
      {open && (
        <div className="glass rounded-2xl p-4 w-72 shadow-xl">
          <p className="text-white/50 text-[11px] uppercase tracking-[0.15em] mb-1">
            {guest ? 'Browsing as' : 'Signed in as'}
          </p>
          <p
            className="text-white text-[15px] break-all mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {user ? user.email : 'Guest'}
          </p>
          {guest ? (
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Guest
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Active
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              handleLogout();
              setOpen(false);
              toast(user ? 'Signed out.' : 'Exited guest mode.', 'info');
            }}
            className="w-full rounded-xl px-4 py-2.5 text-[13px] border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            {guest ? 'Exit Guest' : 'Logout'}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={open ? 'Close account panel' : 'Open account panel'}
        className="flex items-center gap-2.5 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-black font-semibold text-[18px] shadow-lg hover:scale-105 transition-transform cursor-pointer"
        aria-expanded={open}
        aria-label="Account"
      >
        <span className="w-full text-center leading-none">{initial}</span>
      </button>
    </div>
  );
};
