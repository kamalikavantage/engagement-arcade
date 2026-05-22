import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  type = 'button',
}) => {
  const baseClass = 'premium-button font-semibold inline-flex items-center gap-2';

  const variantClasses: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg',
    secondary:
      'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10',
    ghost: 'text-primary-300 hover:bg-white/10 hover:text-primary-200',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className}`}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {icon}
      {children}
    </motion.button>
  );
};
