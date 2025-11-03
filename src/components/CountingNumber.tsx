import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface CountingNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  animated?: boolean;
}

const CountingNumber: React.FC<CountingNumberProps> = ({
  value,
  duration = 1.5,
  delay = 0,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0,
  animated = true
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => 
    parseFloat(latest.toFixed(decimals))
  );
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated && !hasAnimated) {
      const timer = setTimeout(() => {
        const controls = animate(motionValue, value, {
          duration,
          ease: "easeOut",
          onUpdate: (latest) => {
            setDisplayValue(parseFloat(latest.toFixed(decimals)));
          },
          onComplete: () => {
            setHasAnimated(true);
          }
        });

        return () => controls.stop();
      }, delay * 1000);

      return () => clearTimeout(timer);
    } else if (!animated) {
      setDisplayValue(value);
    }
  }, [value, duration, delay, animated, hasAnimated, motionValue, decimals]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {prefix}
      <motion.span
        key={hasAnimated ? "final" : "counting"}
        animate={animated ? { 
          scale: [1, 1.05, 1],
        } : undefined}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          repeat: hasAnimated ? 0 : 3,
          repeatType: "reverse"
        }}
      >
        {displayValue}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

export default CountingNumber;