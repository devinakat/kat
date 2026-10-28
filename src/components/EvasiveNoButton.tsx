import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EvasiveNoButtonProps {
  onYesAlternative: () => void;
  evasionCount: number;
  setEvasionCount: React.Dispatch<React.SetStateAction<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const QUIPS = [
  'no :(',
  'eh gabisa! 😜',
  'yakin nih? 🥺',
  'missed me! 💨',
  'pilih YES aja dong! ❤️',
  'tombol rusak! 🚧',
  'salah klik ya? 😉',
  'wleee gabakal dapet 😝',
  'klik yang kiri please! 🥺✨',
  'pikir lagi deh~ 😚',
  'Error 404: No Rejected! 🚫',
];

export const EvasiveNoButton: React.FC<EvasiveNoButtonProps> = ({
  onYesAlternative,
  evasionCount,
  setEvasionCount,
  containerRef,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEscaping, setIsEscaping] = useState(false);
  const [showCheatModal, setShowCheatModal] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Jump to random spot within the container bounds
  const dodge = useCallback(() => {
    setIsEscaping(true);
    setEvasionCount((prev) => prev + 1);

    if (containerRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = buttonRef.current.getBoundingClientRect();

      const padding = 20;
      const minX = -containerRect.width * 0.35;
      const maxX = containerRect.width * 0.35;
      const minY = -120;
      const maxY = 140;

      // Calculate a randomized jump that guarantees movement away
      const randomX = Math.round((Math.random() * (maxX - minX) + minX));
      const randomY = Math.round((Math.random() * (maxY - minY) + minY));

      setPosition({ x: randomX, y: randomY });
    } else {
      // Fallback
      setPosition({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 140,
      });
    }

    setTimeout(() => {
      setIsEscaping(false);
    }, 250);
  }, [containerRef, setEvasionCount]);

  // Proximity dodge: if cursor comes within 45px, dodge proactively!
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
      if (dist < 55) {
        dodge();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [dodge]);

  const currentLabel = QUIPS[Math.min(evasionCount, QUIPS.length - 1)];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={dodge}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
        onClick={(e) => {
          e.preventDefault();
          // If they somehow managed to tap/click, show affectionate override
          setShowCheatModal(true);
        }}
        style={
          position
            ? {
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }
            : undefined
        }
        className={`px-6 py-2.5 rounded-full bg-[#d9d9d9]/90 hover:bg-white text-zinc-800 text-sm md:text-base font-hand font-bold tracking-wide shadow-md transition-all select-none cursor-pointer active:scale-90 ${
          isEscaping ? 'rotate-6' : ''
        }`}
      >
        {currentLabel}
      </button>

      {/* Cheater Modal: If they caught it! */}
      {showCheatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-rose-500/30 p-6 rounded-3xl max-w-sm text-center shadow-2xl">
            <div className="text-4xl mb-3">🤭❤️</div>
            <h3 className="font-script text-3xl text-rose-400 mb-2">
              Wah, jago banget ngekliknya!
            </h3>
            <p className="text-zinc-300 text-sm mb-5 leading-relaxed font-sans">
              Tapi sayangnya pilihan <span className="text-rose-400 font-bold">&quot;NO&quot;</span> dinonaktifkan di semesta ini! Semesta udah nentuin kalau kita bakal pergi date bareng! 🥰✨
            </p>
            <button
              onClick={() => {
                setShowCheatModal(false);
                onYesAlternative();
              }}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base shadow-lg shadow-rose-500/25 transition-transform active:scale-95"
            >
              Oke deh, YES! ❤️🛫
            </button>
          </div>
        </div>
      )}
    </>
  );
};
