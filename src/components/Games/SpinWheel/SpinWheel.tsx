import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../Common/Card';
import { Button } from '../../Common/Button';
import { CelebrationEffect } from '../../Common/CelebrationEffect';
import { useGame } from '../../../context/GameContext';
import { useConfig } from '../../../context/ConfigContext';
import type { Reward, SpinAttempt } from '../../../types';
import { Clock } from 'lucide-react';

export const SpinWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { userState, recordSpinAttempt, addPoints, addRaffleEntry } = useGame();
  const { config } = useConfig();
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastResult, setLastResult] = useState<Reward | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [spinsRemaining, setSpinsRemaining] = useState(1);

  // Calculate spins remaining
  useEffect(() => {
    setSpinsRemaining(userState?.dailySpinUsed ? 0 : 1);
  }, [userState?.dailySpinUsed]);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel sections
    const rewards = config.rewards;
    const sliceAngle = (Math.PI * 2) / rewards.length;

    rewards.forEach((reward, index) => {
      const startAngle = sliceAngle * index + (wheelRotation * Math.PI / 180);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternate colors
      ctx.fillStyle = index % 2 === 0 ? 'rgba(93, 124, 255, 0.8)' : 'rgba(168, 85, 247, 0.8)';
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

      ctx.save();
      ctx.translate(labelX, labelY);
      ctx.rotate(labelAngle + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(reward.name, 0, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer (top)
    ctx.fillStyle = 'rgba(250, 204, 21, 0.9)';
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY - radius - 20);
    ctx.lineTo(centerX + 15, centerY - radius - 20);
    ctx.lineTo(centerX, centerY - radius + 10);
    ctx.closePath();
    ctx.fill();
  }, [wheelRotation, config.rewards]);

  const handleSpin = () => {
    if (spinning || spinsRemaining === 0 || !userState) return;

    setSpinning(true);
    setShowResult(false);

    // Random rotation for result
    const rewards = config.rewards;
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const reward = rewards[randomIndex];

    // Calculate final rotation (random spin + target position)
    const targetRotation = (360 / rewards.length) * randomIndex + 360 * 5;

    // Spin animation
    let currentRotation = wheelRotation;
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      currentRotation = wheelRotation + (targetRotation * easeProgress);

      setWheelRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setLastResult(reward);
        setShowResult(true);

        // Record the spin and update user state
        let pointsEarned = 0;
        if (reward.type === 'points') {
          pointsEarned = Number(reward.value);
          addPoints(pointsEarned);
        } else if (reward.type === 'raffle') {
          addRaffleEntry(Number(reward.value));
        }

        const spinAttempt: SpinAttempt = {
          id: `spin_${Date.now()}`,
          userId: userState.userId,
          rewardId: reward.id,
          reward,
          spinAt: new Date().toISOString(),
          pointsEarned,
        };

        recordSpinAttempt(spinAttempt);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      <Card gradient>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Spin Wheel</h2>
            <p className="text-slate-300">Spin once per day for amazing rewards!</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 rounded-lg">
            <Clock size={20} className="text-accent-400" />
            <span className="text-accent-300 font-semibold">{spinsRemaining} spin available</span>
          </div>
        </div>

        {/* Wheel Container */}
        <div className="flex flex-col items-center gap-6 py-8">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={350}
              height={350}
              className="max-w-full h-auto"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(93, 124, 255, 0.4))',
              }}
            />
          </div>

          <Button
            onClick={handleSpin}
            disabled={spinsRemaining === 0 || spinning}
            size="lg"
            className="px-8"
          >
            {spinning ? 'Spinning...' : spinsRemaining > 0 ? 'SPIN NOW!' : 'Come back tomorrow'}
          </Button>
        </div>
      </Card>

      {/* Last Result */}
      {showResult && lastResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowResult(false)}
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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  {lastResult.icon === 'Star' ? '⭐' : lastResult.icon === 'Zap' ? '⚡' : lastResult.icon === 'Heart' ? '❤️' : lastResult.icon === 'Trophy' ? '🏆' : lastResult.icon === 'Coffee' ? '☕' : lastResult.icon === 'Utensils' ? '🍽️' : lastResult.icon === 'Ticket' ? '🎫' : lastResult.icon === 'Gift' ? '🎁' : '🍀'}
                </motion.div>

                <h3 className="text-3xl font-bold text-white mb-2">{lastResult.name}</h3>
                <p className="text-slate-300 mb-4">{lastResult.description}</p>

                {lastResult.type === 'points' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-bold gradient-text mb-4"
                  >
                    +{lastResult.value} Points
                  </motion.div>
                )}

                {lastResult.type === 'raffle' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-accent-300 mb-4"
                  >
                    +{lastResult.value} Entries
                  </motion.div>
                )}

                <Button onClick={() => setShowResult(false)} size="lg" className="w-full">
                  Great! Continue Exploring
                </Button>
              </div>
            </Card>
          </motion.div>

          <CelebrationEffect trigger={showResult} intensity="high" />
        </motion.div>
      )}

      {/* History */}
      {userState && userState.spinHistory.length > 0 && (
        <Card>
          <h3 className="text-xl font-bold text-white mb-4">Recent Spins</h3>
          <div className="space-y-2">
            {userState.spinHistory.slice(-5).reverse().map((spin, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold">{spin.reward.name}</p>
                  <p className="text-slate-400 text-sm">{new Date(spin.spinAt).toLocaleDateString()}</p>
                </div>
                {spin.pointsEarned > 0 && <span className="text-primary-400 font-bold">+{spin.pointsEarned}</span>}
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
