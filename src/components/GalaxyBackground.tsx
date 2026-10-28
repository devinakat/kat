import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  interactive?: boolean;
  speedMultiplier?: number;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  interactive = true,
  speedMultiplier = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Particle structure matching the vortex rings in Figma
    interface Star {
      arm: number;
      dist: number; // distance from center along major axis
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }

    let stars: Star[] = [];
    const NUM_STARS = 650;
    const NUM_ARMS = 4;
    const ELLIPSE_RATIO = 0.58; // Squish factor to create the 3D tilted elliptical accretion disk look

    let mouseX = width / 2;
    let mouseY = height * 0.42;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const initStars = () => {
      stars = [];
      const maxRadius = Math.max(width, height) * 0.85;

      for (let i = 0; i < NUM_STARS; i++) {
        // Distribute stars with higher density towards the inner spiral arms
        const norm = Math.pow(Math.random(), 0.7);
        const dist = 25 + norm * maxRadius;
        const arm = Math.floor(Math.random() * NUM_ARMS);
        const spiralOffset = (dist / 140) * Math.PI * 0.65;
        const armAngle = (arm * 2 * Math.PI) / NUM_ARMS;
        const scatter = (Math.random() - 0.5) * 0.45;
        const angle = armAngle + spiralOffset + scatter;

        // Orbital speed: Keplerian-like (closer stars rotate faster)
        const speed = (0.0025 + (1 / (dist + 50)) * 0.45) * (0.8 + Math.random() * 0.4);

        // Star colors: glowing white, soft lavender, starry pale blue, faint warm gold
        const colorType = Math.random();
        let color = '255, 255, 255';
        if (colorType > 0.8) color = '220, 235, 255'; // pale blue
        else if (colorType > 0.6) color = '255, 235, 245'; // romantic soft pink/rose
        else if (colorType > 0.45) color = '240, 240, 255'; // soft purple

        stars.push({
          arm,
          dist,
          angle,
          speed,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.6 + 0.4,
          twinkleSpeed: Math.random() * 0.04 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
        });
      }
    };

    initStars();

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetMouseX = clientX - rect.left;
      targetMouseY = clientY - rect.top;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth lag for mouse gravitational center
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // The vortex center aligns roughly around the upper-middle ("us" area)
      const defaultCenterX = width / 2;
      const defaultCenterY = height * 0.42;
      const centerX = defaultCenterX + (mouseX - defaultCenterX) * 0.15;
      const centerY = defaultCenterY + (mouseY - defaultCenterY) * 0.15;

      // Deep space background with subtle trail
      ctx.fillStyle = 'rgba(5, 5, 8, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Core radial glow (like the luminous center of the galaxy in Figma)
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.min(width, height) * 0.45
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      coreGradient.addColorStop(0.12, 'rgba(240, 245, 255, 0.28)');
      coreGradient.addColorStop(0.3, 'rgba(180, 200, 255, 0.12)');
      coreGradient.addColorStop(0.65, 'rgba(120, 100, 200, 0.03)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      // Draw squashed elliptical glow
      ctx.ellipse(centerX, centerY, width * 0.42, width * 0.42 * ELLIPSE_RATIO, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render concentric spiral dots and stars
      const tiltAngle = -0.15; // slight tilt like in the Figma screenshot

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Orbit update
        star.angle += star.speed * speedMultiplier;
        star.twinklePhase += star.twinkleSpeed;

        const currentAlpha = Math.max(
          0.15,
          Math.min(1, star.alpha + Math.sin(star.twinklePhase) * 0.3)
        );

        // Polar to Cartesian with elliptical compression
        const rawX = Math.cos(star.angle) * star.dist;
        const rawY = Math.sin(star.angle) * star.dist * ELLIPSE_RATIO;

        // Apply tilt rotation
        const rotatedX = rawX * Math.cos(tiltAngle) - rawY * Math.sin(tiltAngle);
        const rotatedY = rawX * Math.sin(tiltAngle) + rawY * Math.cos(tiltAngle);

        const screenX = centerX + rotatedX;
        const screenY = centerY + rotatedY;

        // Skip if outside viewport
        if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
          continue;
        }

        // Draw star dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(${star.color}, ${currentAlpha})`;
        ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra glow on larger stars
        if (star.size > 1.6) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${star.color}, ${currentAlpha * 0.3})`;
          ctx.arc(screenX, screenY, star.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Fill initial canvas black
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, width, height);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
    };
  }, [interactive, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
