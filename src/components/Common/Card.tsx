import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false,
  glass = true,
  onClick,
}) => {
  const baseClass = glass ? 'glass' : '';
  const hoverClass = hover ? 'hover:shadow-glow-lg hover:border-primary-400/60 cursor-pointer' : '';
  const gradientClass = gradient ? 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20' : '';

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={`rounded-2xl p-6 transition-all duration-300 ${baseClass} ${hoverClass} ${gradientClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
