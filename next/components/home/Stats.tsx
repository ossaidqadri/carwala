"use client"

import { useInView } from "@/hooks/use-in-view"
import { useCountUp } from "@/hooks/use-count-up"

interface StatProps {
  target: number;
  suffix: string;
  label: string;
  delay: number;
}

function Stat({ target, suffix, label, delay }: StatProps) {
  const { count, isComplete } = useCountUp(target, {
    duration: 2000,
    delay,
    easing: 'ease-in-out'
  });

  const displayCount = Math.floor(count);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-start leading-none mb-2">
        <span
          className="text-[60px] font-pixel font-medium text-foreground animate-stats-number"
          style={{ animationDelay: `${delay}ms` }}
        >
          {displayCount}
        </span>
        <span
          className={`text-[30px] font-pixel font-semibold mt-1 text-foreground animate-stats-suffix ${isComplete ? '' : 'opacity-0'}`}
          style={{ animationDelay: `${delay + 1800}ms` }}
        >
          {suffix}
        </span>
      </div>
      <p className="text-[15px] tracking-wide text-foreground/90">{label}</p>
    </div>
  );
}

export function Stats() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1 });

  return (
    <div ref={sectionRef} className="bg-footer-bg py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { target: 500, suffix: "+", label: "Detailed Versatility", delay: 100 },
            { target: 5, suffix: "+", label: "Years of Experience", delay: 200 },
            { target: 100, suffix: "+", label: "Ceramic Shield", delay: 300 },
            { target: 150, suffix: "+", label: "PPF Installations", delay: 400 }
          ].map((stat, i) => (
            <Stat
              key={i}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              delay={inView ? stat.delay : 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
