import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from '../Common/Button';
import { useGame } from '../../context/GameContext';
import { useUser } from '../../context/UserContext';

interface NavbarProps {
  onAdminClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAdminClick }) => {
  const { userState } = useGame();
  const { currentUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-40 border-b border-primary-500/30"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
            ⚡
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold gradient-text">Arcade</h1>
            <p className="text-xs text-slate-400">Engagement Platform</p>
          </div>
        </motion.div>

        {/* Desktop Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm">Points</p>
            <p className="text-xl font-bold text-primary-400">{userState?.totalPoints || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Level</p>
            <p className="text-xl font-bold text-secondary-400">{userState?.level || 1}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Badges</p>
            <p className="text-xl font-bold text-accent-400">{userState?.badges.length || 0}</p>
          </div>
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full border border-primary-500"
            />
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
              <p className="text-xs text-slate-400">{currentUser?.department}</p>
            </div>
          </div>

          <Button
            icon={<Settings size={18} />}
            variant="outline"
            size="sm"
            onClick={onAdminClick}
            className="hidden sm:flex"
          >
            Admin
          </Button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-primary-500/30 p-4 space-y-2"
        >
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full border border-primary-500"
            />
            <div>
              <p className="font-semibold text-white">{currentUser?.name}</p>
              <p className="text-xs text-slate-400">{currentUser?.department}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 bg-white/5 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-slate-400">Points</p>
              <p className="font-bold text-primary-400">{userState?.totalPoints || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Level</p>
              <p className="font-bold text-secondary-400">{userState?.level || 1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Badges</p>
              <p className="font-bold text-accent-400">{userState?.badges.length || 0}</p>
            </div>
          </div>
          <Button onClick={onAdminClick} variant="outline" size="sm" className="w-full">
            Admin Panel
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
};
