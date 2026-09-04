import React, { useEffect, useRef } from 'react';

interface ParticleSphereProps {
  score?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  color: string;
}

export const ParticleSphere: React.FC<ParticleSphereProps> = ({
  score = "26.4",
  label = "Aura Age",
  sublabel = "5.1 years younger",
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 320 * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 320 * window.devicePixelRatio);

    const numParticles = 750;
    const radius = Math.min(width, height) * 0.38;
    const particles: Particle[] = [];

    // Colors matching Aura Design System (Neuform Gold)
    const colors = ['#E2C854', '#ebd775', '#C7AC3B', '#A3A3A3', '#FAF5D8'];

    for (let i = 0; i < numParticles; i++) {
      // Fibonacci sphere distribution for uniform spherical cloud
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numParticles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Slight radial scatter for atmospheric organic nebula feel
      const r = radius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        size: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let angleX = 0;
    let angleY = 0;
    let targetSpeedY = 0.003;
    let targetSpeedX = 0.0015;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const normX = (clientX - rect.left) / rect.width - 0.5;
      const normY = (clientY - rect.top) / rect.height - 0.5;
      mouseX = normX * 0.008;
      mouseY = normY * 0.008;
    };

    window.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });

    let breathTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      breathTimer += 0.02;
      const breathScale = 1 + Math.sin(breathTimer) * 0.025;

      angleY += targetSpeedY + mouseX;
      angleX += targetSpeedX + mouseY;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle ambient glow in center
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.1,
        centerX,
        centerY,
        radius * 1.1
      );
      gradient.addColorStop(0, 'rgba(226, 200, 84, 0.08)');
      gradient.addColorStop(0.5, 'rgba(226, 200, 84, 0.03)');
      gradient.addColorStop(1, 'rgba(12, 12, 14, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Project and sort particles by Z for depth
      const projected = particles.map((p) => {
        // Rotate Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Apply breathing
        const xFinal = x1 * breathScale;
        const yFinal = y2 * breathScale;
        const zFinal = z2 * breathScale;

        // Perspective projection
        const fov = 450 * window.devicePixelRatio;
        const distance = fov + zFinal;
        const scale = fov / Math.max(distance, 100);

        const projX = centerX + xFinal * scale;
        const projY = centerY + yFinal * scale;

        // Depth alpha calculation: closer particles are brighter and bigger
        const depthFactor = (zFinal + radius) / (2 * radius);
        const alpha = Math.max(0.1, Math.min(1, p.baseAlpha * (0.3 + 0.7 * depthFactor)));
        const renderSize = Math.max(0.6, p.size * scale * (0.6 + 0.5 * depthFactor));

        return {
          projX,
          projY,
          zFinal,
          alpha,
          renderSize,
          color: p.color,
        };
      });

      projected.sort((a, b) => a.zFinal - b.zFinal);

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.renderSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 320 * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 320 * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[340px] max-h-[340px] aspect-square block pointer-events-auto cursor-grab active:cursor-grabbing"
      />

      {/* Central Typography Hub */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-4">
        <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {score}
        </span>
        <span className="text-xs md:text-sm font-semibold tracking-wider text-[#E2C854] mt-1 uppercase">
          {label}
        </span>
        <span className="text-[11px] font-normal text-[#8E927C] tracking-tight mt-0.5">
          {sublabel}
        </span>
      </div>
    </div>
  );
};
export default ParticleSphere;
