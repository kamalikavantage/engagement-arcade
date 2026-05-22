import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationEffectProps {
  trigger: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({ trigger, intensity = 'medium' }) => {
  useEffect(() => {
    if (!trigger) return;

    const configs = {
      low: {
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
      },
      medium: {
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
      },
      high: {
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
      },
    };

    const config = configs[intensity];

    // Center burst
    confetti({
      ...config,
      angle: 90,
      startVelocity: 25,
    });

    // Left side
    setTimeout(() => {
      confetti({
        ...config,
        origin: { x: 0.2, y: 0.6 },
        angle: 60,
        startVelocity: 20,
      });
    }, 100);

    // Right side
    setTimeout(() => {
      confetti({
        ...config,
        origin: { x: 0.8, y: 0.6 },
        angle: 120,
        startVelocity: 20,
      });
    }, 200);
  }, [trigger, intensity]);

  return null;
};
