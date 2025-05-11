"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Create a context for toast management
const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, message, type, duration };
    
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Auto dismiss
    if (duration !== Infinity) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    
    return id;
  };

  const dismissToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      <AnimatePresence>
        {toasts.length > 0 && (
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {toasts.map(toast => (
              <Toast 
                key={toast.id} 
                {...toast} 
                onDismiss={() => dismissToast(toast.id)} 
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

// Hook for consuming the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ id, message, type, onDismiss }) => {
  const variants = {
    initial: { opacity: 0, x: 50, scale: 0.8 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`rounded-md shadow-md p-4 flex items-start gap-3 bg-white border-l-4 ${
        type === 'success' ? 'border-l-green-500' :
        type === 'error' ? 'border-l-red-500' :
        'border-l-blue-500'
      }`}
      layout
    >
      <div className="flex-shrink-0 pt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 text-sm">
        {message}
      </div>
      <button 
        onClick={onDismiss} 
        className="flex-shrink-0 text-gray-400 hover:text-gray-500"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};