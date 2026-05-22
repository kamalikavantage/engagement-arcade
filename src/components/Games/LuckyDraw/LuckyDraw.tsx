import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../Common/Card';
import { Button } from '../../Common/Button';
import { useGame } from '../../../context/GameContext';
import { CelebrationEffect } from '../../Common/CelebrationEffect';
import mockEmployees from '../../../data/mockEmployees.json';
import { Users } from 'lucide-react';

export const LuckyDraw: React.FC = () => {
  const { userState } = useGame();
  const [drawing, setDrawing] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [showWinner, setShowWinner] = useState(false);

  const employees: any[] = mockEmployees;

  // Simulate participants (would be users with raffle entries)
  const participants = employees.slice(0, 10).map((emp) => ({
    id: emp.id,
    name: emp.name,
    avatar: emp.avatar,
    entries: Math.floor(Math.random() * 20) + 5,
  }));


  const selectWinner = () => {
    setDrawing(true);
    setShowWinner(false);

    // Animate balls/selection
    const balls = participants.map((p) => ({
      ...p,
      order: Math.random(),
    }));
    balls.sort((a, b) => a.order - b.order);

    let current = 0;
    const interval = setInterval(() => {
      setWinner(balls[current]);
      current++;

      if (current >= balls.length) {
        clearInterval(interval);
        setDrawing(false);
        setShowWinner(true);
        setWinner(balls[balls.length - 1]);
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Draw Section */}
      <Card gradient>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Monthly Lucky Draw</h2>
            <p className="text-slate-300">Earn raffle entries and win big prizes!</p>
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl">
            🎁
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Your Entries</p>
            <p className="text-3xl font-bold text-primary-400">{userState?.raffleEntries || 0}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Total Participants</p>
            <p className="text-3xl font-bold text-secondary-400">{participants.length}</p>
          </div>
        </div>

        <Button onClick={selectWinner} disabled={drawing} size="lg" className="w-full">
          {drawing ? 'Drawing...' : 'Start Draw'}
        </Button>
      </Card>

      {/* Winner Display */}
      {showWinner && winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowWinner(false)}
          />
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="relative z-10"
          >
            <Card gradient className="max-w-md w-full">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>

                <h3 className="text-3xl font-bold gradient-text mb-2">We Have a Winner!</h3>

                <div className="my-6">
                  <img
                    src={winner.avatar}
                    alt={winner.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-primary-500 mb-4"
                  />
                  <p className="text-2xl font-bold text-white">{winner.name}</p>
                  <p className="text-accent-300 text-lg mt-2">Prize: $500 Gift Card</p>
                </div>

                <Button onClick={() => setShowWinner(false)} size="lg" className="w-full">
                  Congratulations!
                </Button>
              </div>
            </Card>
          </motion.div>

          <CelebrationEffect trigger={true} intensity="high" />
        </motion.div>
      )}

      {/* Participants List */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Users size={24} className="text-primary-400" />
          <h3 className="text-xl font-bold text-white">Participants</h3>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {participants.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full" />
                <span className="text-white font-semibold">{p.name}</span>
              </div>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-semibold">
                {p.entries} entries
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/50">
          <p className="text-blue-200 text-sm">
            💡 Next draw: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>
      </Card>
    </div>
  );
};
