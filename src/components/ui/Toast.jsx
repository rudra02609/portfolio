import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export default function Toast({ show, message, type = "success", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4 px-5 py-4 rounded-xl glass border border-white/10 shadow-2xl max-w-md"
        >
          {/* Status Icon */}
          {type === "success" ? (
            <FaCheckCircle className="text-emerald-400 text-xl flex-shrink-0 animate-bounce" />
          ) : (
            <FaTimesCircle className="text-rose-400 text-xl flex-shrink-0 animate-bounce" />
          )}

          {/* Text Message */}
          <div className="text-sm font-medium text-slate-100 pr-2">
            {message}
          </div>

          {/* Close trigger */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
            aria-label="Close notification"
          >
            <FaTimes size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
