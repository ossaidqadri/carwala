import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: 'hover' | 'drag';
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export function Compare({
  firstImage = '',
  secondImage = '',
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = 'hover',
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === 'drag') {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === 'drag') {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === 'hover' || (slideMode === 'drag' && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  return (
    <div
      ref={sliderRef}
      className={cn('w-[400px] h-[400px] overflow-hidden relative', className)}
      style={{
        cursor: slideMode === 'drag' ? 'grab' : 'col-resize',
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={() => {
        setIsMouseOver(false);
        if (slideMode === 'hover') {
          setSliderXPercent(initialSliderPercentage);
        }
        if (slideMode === 'drag') {
          setIsDragging(false);
        }
        startAutoplay();
      }}
      onMouseEnter={() => {
        setIsMouseOver(true);
        stopAutoplay();
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => {
        if (!autoplay) {
          handleStart(e.touches[0].clientX);
        }
      }}
      onTouchEnd={() => {
        if (!autoplay) {
          handleEnd();
        }
      }}
      onTouchMove={(e) => {
        if (!autoplay) {
          handleMove(e.touches[0].clientX);
        }
      }}
    >
      {/* Slider Line */}
      <div
        className="h-full w-0.5 absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent via-white to-transparent"
        style={{
          left: `${sliderXPercent}%`,
          zIndex: 40,
        }}
      >
        {showHandlebar && (
          <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 absolute -left-2.5 flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
            <div className="flex flex-col gap-0.5">
              <div className="w-3 h-0.5 bg-black"></div>
              <div className="w-3 h-0.5 bg-black"></div>
              <div className="w-3 h-0.5 bg-black"></div>
            </div>
          </div>
        )}
      </div>

      {/* First Image (left side clipped) */}
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        {firstImage ? (
          <div
            className={cn('absolute inset-0 z-20 rounded-lg shrink-0 w-full h-full select-none overflow-hidden', firstImageClassName)}
            style={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
          >
            <img
              alt="first image"
              src={firstImage}
              className={cn('absolute inset-0 z-20 rounded-lg shrink-0 w-full h-full select-none', firstImageClassName)}
              draggable={false}
            />
          </div>
        ) : null}
      </div>

      {/* Second Image (background) */}
      {secondImage && (
        <img
          className={cn('absolute top-0 left-0 z-[19] rounded-lg w-full h-full select-none', secondImageClassname)}
          alt="second image"
          src={secondImage}
          draggable={false}
        />
      )}
    </div>
  );
}