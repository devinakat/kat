import React, { useEffect, useState } from 'react';

export const FantasyBackground: React.FC = () => {
  const [dragonCycle, setDragonCycle] = useState(0);

  useEffect(() => {
    // Reset or loop dragon flight every 16 seconds
    const interval = setInterval(() => {
      setDragonCycle((prev) => prev + 1);
    }, 16000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black">
      {/* 1. Base Castle Fortress Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-105"
        style={{
          backgroundImage: 'url(/assets/fantasy/castle_bg.jpg)',
          filter: 'brightness(0.68) contrast(1.15) saturate(1.1)',
        }}
      />

      {/* 2. Soft Dark Vignette & Atmospheric Fog */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.75)_100%)]" />

      {/* 3. Swaying Trees in the Breeze */}
      {/* Left Swaying Forest Silhouette */}
      <div
        className="absolute -top-10 -left-12 w-64 h-96 pointer-events-none origin-top-left opacity-75"
        style={{
          animation: 'treeSway 6s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 200 300" className="w-full h-full fill-emerald-950/80 drop-shadow-xl">
          <path d="M0,0 Q60,40 100,10 Q140,80 170,120 Q120,160 140,210 Q90,240 70,300 L0,300 Z" />
          <path d="M20,0 Q90,60 130,50 Q160,110 180,160 Q110,210 120,280 L0,280 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Right Swaying Tree Branches */}
      <div
        className="absolute -top-8 -right-10 w-72 h-96 pointer-events-none origin-top-right opacity-70"
        style={{
          animation: 'treeSwayRight 7.5s ease-in-out infinite alternate',
        }}
      >
        <svg viewBox="0 0 200 300" className="w-full h-full fill-emerald-950/80 drop-shadow-xl">
          <path d="M200,0 Q130,50 90,20 Q50,90 20,130 Q80,180 50,230 Q110,260 130,300 L200,300 Z" />
        </svg>
      </div>

      {/* 4. Flying Dragon Soaring Across the Sky */}
      <div
        key={dragonCycle}
        className="absolute top-12 left-0 pointer-events-none z-10"
        style={{
          animation: 'dragonFlight 16s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      >
        <div className="relative w-28 h-20 -rotate-6">
          {/* Dragon Silhouette with Flapping Wings */}
          <svg
            viewBox="0 0 160 100"
            className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            {/* Dragon Body & Long Tail */}
            <path
              d="M30,55 Q50,45 80,48 Q115,50 145,35 Q135,52 110,60 Q80,68 50,65 Q35,70 15,85 Q20,72 30,55 Z"
              fill="#18181b"
            />
            {/* Horns & Head */}
            <path d="M140,35 Q152,30 158,26 Q150,38 142,42 Z" fill="#27272a" />
            <path d="M142,34 Q155,22 160,18 Q148,32 140,38 Z" fill="#27272a" />

            {/* Left Flapping Wing */}
            <path
              d="M75,48 Q85,10 115,2 Q105,25 110,48 Z"
              fill="#27272a"
              style={{
                transformOrigin: '75px 48px',
                animation: 'wingFlap 0.8s ease-in-out infinite alternate',
              }}
            />

            {/* Right Wing (Perspective) */}
            <path
              d="M70,50 Q60,18 90,8 Q85,30 95,50 Z"
              fill="#09090b"
              style={{
                transformOrigin: '70px 50px',
                animation: 'wingFlap 0.8s ease-in-out infinite alternate-reverse',
              }}
            />

            {/* Dragon Eye Glow */}
            <circle cx="147" cy="36" r="1.5" fill="#f59e0b" className="animate-pulse" />
          </svg>

          {/* Golden Sparkles Trail behind dragon */}
          <div className="absolute top-10 left-2 w-2 h-2 bg-amber-400 rounded-full blur-[1px] opacity-75 animate-ping" />
        </div>
      </div>

      {/* 5. Castle Torches Warm Glowing Flicker */}
      {/* Left Stair Torch */}
      <div className="absolute bottom-[28%] left-[12%] w-12 h-12 pointer-events-none">
        <div className="w-4 h-4 bg-amber-500 rounded-full blur-md opacity-85 animate-pulse" />
        <div className="absolute -top-1 left-1 w-2 h-3 bg-yellow-300 rounded-full blur-xs opacity-90 animate-bounce" />
      </div>
      {/* Right Stair Torch */}
      <div className="absolute bottom-[24%] right-[22%] w-12 h-12 pointer-events-none">
        <div className="w-5 h-5 bg-amber-500 rounded-full blur-md opacity-85 animate-pulse" />
        <div className="absolute -top-1 left-1.5 w-2 h-3 bg-yellow-300 rounded-full blur-xs opacity-90 animate-bounce" />
      </div>

      {/* 6. Gentle Drifting Embers / Starlight */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-300/60 blur-[1px]"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 19) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `floatParticle ${4 + (i % 4)}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* CSS Keyframe Styles for tree sway, dragon flight, and particles */}
      <style>{`
        @keyframes treeSway {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(2.5deg) scale(1.02); }
          100% { transform: rotate(-2deg) scale(0.99); }
        }
        @keyframes treeSwayRight {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
          100% { transform: rotate(2deg); }
        }
        @keyframes dragonFlight {
          0% {
            transform: translate(-120px, 40px) scale(0.65);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          50% {
            transform: translate(calc(50vw), 15px) scale(0.85);
          }
          90% {
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(100vw + 120px), 60px) scale(0.6);
            opacity: 0;
          }
        }
        @keyframes wingFlap {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(35deg); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          100% { transform: translateY(-35px) translateX(15px); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};
