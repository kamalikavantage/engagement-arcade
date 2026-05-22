import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, color = 'primary' }) => {
  const colorClasses: Record<string, string> = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    accent: 'text-accent-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <Card gradient>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mt-2"
          >
            {value}
          </motion.p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this week
            </p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl ${colorClasses[color]}`}
        >
          {icon}
        </motion.div>
      </div>
    </Card>
  );
};
