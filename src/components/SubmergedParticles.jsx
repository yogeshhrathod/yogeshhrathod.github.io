import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * SubmergedParticles (Ubisoft Rule: < 0.1px per frame)
 * Provides a persistent low-opacity noise/dust overlay for atmospheric depth.
 * `opacity` is a MotionValue; the loop idles while the layer is invisible.
 */
export const SubmergedParticles = ({ opacity }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 250 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: Math.random() * 0.15 + 0.05, // Downward bias
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (opacity && opacity.get() <= 0.001) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgb(232, 228, 223)';
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [opacity]);

  return (
    <motion.canvas
      ref={canvasRef}
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-[10001]"
    />
  );
};
