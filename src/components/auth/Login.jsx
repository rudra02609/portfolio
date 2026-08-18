import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { FaGoogle, FaSpinner, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Login({ isOpen, onClose }) {
  const { handleGoogleLogin, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setLocalError(null);
        await handleGoogleLogin(credentialResponse);
        onClose();
      } catch (err) {
        setLocalError(err.message);
      }
    },
    onError: () => {
      setLocalError("Google login failed. Please try again.");
    },
    flow: "implicit",
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl border border-white/10 p-8 max-w-md w-full shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-all"
        >
          <FaTimes className="text-slate-400 text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-sm text-slate-400">
            Sign in with your Google account to access more features
          </p>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold"
          >
            {error || localError}
          </motion.div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-cyan/20 mb-4"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Signing in...
            </>
          ) : (
            <>
              <FaGoogle className="text-lg" /> Sign in with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-[#0a0e27] text-slate-500">or continue as guest</span>
          </div>
        </div>

        {/* Guest Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl glass border border-white/5 text-slate-300 font-bold text-sm uppercase tracking-wider hover:border-white/10 hover:bg-white/5 transition-all"
        >
          Continue as Guest
        </button>

        {/* Info */}
        <p className="mt-6 text-xs text-slate-500 text-center">
          By signing in, you agree to our{" "}
          <a href="#" className="text-brand-cyan hover:text-brand-cyan/80">
            Terms of Service
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
