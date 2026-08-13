import React, { useEffect, useRef } from "react";

interface LivingBackgroundShaderProps {
  opacity?: number;
  className?: string;
}

export const LivingBackgroundShader: React.FC<LivingBackgroundShaderProps> = ({
  opacity = 0.95,
  className = "fixed inset-0 w-full h-full pointer-events-none z-0",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    let mouseX = 0;
    let targetMouseX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX - window.innerWidth / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const lineCount = 32; // Number of parallel strand lines in the green ribbon

    const render = (time: number) => {
      const t = time * 0.0009;

      // Smooth mouse spring interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const stepY = 6;
      const totalSteps = Math.ceil((height + 180) / stepY);

      // Render the flowing green line ribbon bundle
      for (let l = 0; l < lineCount; l++) {
        ctx.beginPath();

        const strandNorm = l / (lineCount - 1); // 0 to 1
        const lineOffset = (l - lineCount / 2) * 5.2; // Spacing across the ribbon width

        // Center strands are bright neon green, outer edges fade softly
        const alpha = 0.3 + Math.sin(strandNorm * Math.PI) * 0.6;
        ctx.strokeStyle = `rgba(50, 220, 100, ${alpha})`;
        ctx.lineWidth = 1.8;

        for (let i = -12; i <= totalSteps; i++) {
          const y = i * stepY;
          const yNorm = y / height;

          // Flowing vertical S-curve equation matching the video ribbon
          const primaryWave = Math.sin(yNorm * 3.8 + t * 1.3 + l * 0.018) * 110;
          const secondaryWave = Math.cos(yNorm * 2.2 - t * 0.85 + l * 0.012) * 95;
          const detailWave = Math.sin(yNorm * 6.0 + t * 1.6) * 30;

          // Interactive mouse sway
          const mouseEffect = Math.sin(yNorm * Math.PI) * (mouseX * 0.25);

          const x = centerX + primaryWave + secondaryWave + detailWave + lineOffset + mouseEffect;

          if (i === -12) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={className} style={{ opacity, transition: "opacity 0.4s ease" }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
