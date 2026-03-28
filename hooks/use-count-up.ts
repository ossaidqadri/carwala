"use client"

import { useRef, useEffect, useState } from 'react';

interface UseCountUpOptions {
  start?: number;
  duration?: number;
  delay?: number;
  easing?: 'ease-out' | 'ease-in-out' | 'linear';
}

export function useCountUp(
  target: number,
  options: UseCountUpOptions = {}
) {
  const {
    start = 0,
    duration = 2000,
    delay = 0,
    easing = 'ease-in-out'
  } = options;

  const [count, setCount] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | null>(null);

  const easeFunctions = {
    'ease-out': (t: number) => t * (2 - t),
    'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'linear': (t: number) => t
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeFunctions[easing](progress);

        const currentCount = start + (target - start) * easedProgress;
        setCount(currentCount);

        if (progress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
          setIsComplete(true);
        }
      };

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [target, start, duration, delay, easing]);

  return { count, isComplete };
}
