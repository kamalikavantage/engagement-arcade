import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  name: string;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  earned?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  name,
  icon = '🏆',
  color = 'bg-yellow-500',
  size = 'md',
  className = '',
  earned = true,
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const textSizeClasses: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <motion.div
      whileHover={earned ? { scale: 1.1, y: -5 } : {}}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${color} ${
          !earned ? 'opacity-30 grayscale' : ''
        } shadow-lg ring-2 ring-offset-2 ring-white/20`}
      >
        {icon}
      </div>
      <p className={`text-center font-semibold ${textSizeClasses[size]} line-clamp-2`}>{name}</p>
    </motion.div>
  );
};
