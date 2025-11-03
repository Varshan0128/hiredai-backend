import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Confetti {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface CelebrationEffectsProps {
  trigger: boolean;
  type?: 'confetti' | 'success' | 'glow';
  duration?: number;
  onComplete?: () => void;
}

const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  trigger,
  type = 'confetti',
  duration = 3000,
  onComplete
}) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [isActive, setIsActive] = useState(false);

  const colors = ['#9B8AFB', '#5FB49C', '#FF6F61', '#60A5FA', '#F59E0B', '#EC4899'];

  const createConfetti = () => {
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: `confetti-${i}`,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 2 + 2
      });
    }
    setConfetti(newConfetti);
  };

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      if (type === 'confetti') {
        createConfetti();
      }

      const timer = setTimeout(() => {
        setIsActive(false);
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, type, duration, onComplete]);

  useEffect(() => {
    if (confetti.length === 0) return;

    const animationFrame = setInterval(() => {
      setConfetti(prev => 
        prev.map(piece => ({
          ...piece,
          x: piece.x + piece.velocityX,
          y: piece.y + piece.velocityY,
          rotation: piece.rotation + 5,
          velocityY: piece.velocityY + 0.1 // gravity effect
        })).filter(piece => piece.y < window.innerHeight + 10)
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, [confetti.length]);

  const renderConfetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg)`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );

  const renderSuccessGlow = () => (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sage/20 via-transparent to-lavender/20" />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [0, 1.5, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="w-32 h-32 bg-gradient-to-br from-sage to-lavender rounded-full opacity-30 blur-xl" />
      </motion.div>
    </motion.div>
  );

  const renderGlowEffect = () => (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 2 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-lavender/10 via-sage/5 to-transparent" />
      
      {/* Floating sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-lavender rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 1,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {type === 'confetti' && renderConfetti()}
      {type === 'success' && renderSuccessGlow()}
      {type === 'glow' && renderGlowEffect()}
    </AnimatePresence>
  );
};

export default CelebrationEffects;