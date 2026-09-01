import React, { createContext, useContext, useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let idCounter = 0;

const STYLES: Record<ToastType, string> = {
  success: 'border-emerald-400/40 text-emerald-300',
  error: 'border-red-400/40 text-red-300',
  info: 'border-cyan-400/40 text-cyan-300',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`glass rounded-xl px-4 py-3 text-[13px] sm:text-[14px] border ${STYLES[t.type]} shadow-lg animate-[toastIn_0.25s_ease]`}
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
