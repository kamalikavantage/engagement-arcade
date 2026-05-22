import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-primary-500/30 border-t-primary-500 rounded-full"
      />
    </div>
  );
};

export const LoadingPulse: React.FC = () => (
  <motion.div
    animate={{ opacity: [0.3, 1, 0.3] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="w-full h-full bg-gradient-to-r from-primary-500/20 to-transparent rounded-lg"
  />
);
