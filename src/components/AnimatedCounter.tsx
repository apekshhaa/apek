import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  startAnimation?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.5,
  decimals = 1,
  startAnimation = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startAnimation || hasAnimated.current) return;

    hasAnimated.current = true;
    
    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: value,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(counter.value);
      }
    });
  }, [value, duration, startAnimation]);

  return <span ref={counterRef}>{displayValue.toFixed(decimals)}</span>;
};
