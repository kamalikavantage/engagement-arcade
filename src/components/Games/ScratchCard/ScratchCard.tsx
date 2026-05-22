import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../Common/Card';
import { Button } from '../../Common/Button';
import { CelebrationEffect } from '../../Common/CelebrationEffect';
import { useGame } from '../../../context/GameContext';

const REWARDS = [
  { text: '🎉 50 Points', value: 50 },
  { text: '⭐ 100 Points', value: 100 },
  { text: '🏆 Badge!', value: 0 },
  { text: '🎁 Raffle Entry', value: 0 },
];

export const ScratchCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratched, setScratched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState(REWARDS[0]);
  const { addPoints, addRaffleEntry } = useGame();
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratch card
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '14px Inter';
    ctx.fillText('↓', canvas.width / 2, canvas.height / 2 + 20);

    const handleMouseDown = () => {
      isDrawing.current = true;
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Clear area
      ctx.clearRect(x - 20, y - 20, 40, 40);

      // Check if enough scratched
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparent = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) transparent++;
      }

      if (transparent / (data.length / 4) > 0.3 && !scratched) {
        setScratched(true);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scratched]);

  const resetCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw scratch card
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '14px Inter';
    ctx.fillText('↓', canvas.width / 2, canvas.height / 2 + 20);

    setScratched(false);
    setRevealed(false);
    setReward(REWARDS[Math.floor(Math.random() * REWARDS.length)]);
  };

  const claimReward = () => {
    if (reward.value > 0) {
      addPoints(reward.value);
    } else if (reward.text.includes('Badge')) {
      // Badge awarded
    } else if (reward.text.includes('Raffle')) {
      addRaffleEntry(1);
    }
    setRevealed(true);
  };

  return (
    <div className="space-y-6">
      <Card gradient>
        <h2 className="text-3xl font-bold text-white mb-2">Scratch Card Rewards</h2>
        <p className="text-slate-300 mb-8">Scratch the card to reveal your prize!</p>

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              className="rounded-lg cursor-pointer border-2 border-white/20 shadow-lg"
              style={{
                backgroundImage: !scratched
                  ? 'none'
                  : 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(168, 85, 247, 0.1))',
              }}
            />

            {scratched && !revealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-6xl">{reward.text.split(' ')[0]}</div>
              </motion.div>
            )}
          </div>

          {scratched && !revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">You won!</h3>
              <p className="text-xl text-primary-400 font-semibold mb-4">{reward.text}</p>
              <Button onClick={claimReward} size="lg">
                Claim Reward
              </Button>
            </motion.div>
          )}

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                {reward.text.split(' ')[0]}
              </motion.div>
              <h3 className="text-2xl font-bold gradient-text mb-4">{reward.text}</h3>
              {reward.value > 0 && (
                <p className="text-accent-300 text-lg font-semibold mb-4">+{reward.value} Points added!</p>
              )}
              <Button onClick={resetCard} size="lg" className="w-full">
                Play Again
              </Button>
            </motion.div>
          )}
        </div>
      </Card>

      <CelebrationEffect trigger={revealed} intensity="medium" />
    </div>
  );
};
