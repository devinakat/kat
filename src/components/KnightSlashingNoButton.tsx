import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface KnightSlashingNoButtonProps {
  onYesAlternative: () => void;
  onSlashTriggered?: () => void;
  onTouchChange?: (isTouched: boolean) => void;
}

const KNIGHT_DEFENSE_QUIPS = [
  '⚔️ SLASH! A Knight defends this date!',
  '⚔️ CLANG! "No" is forbidden by royal decree!',
  '⚔️ TING! Deflected! Only YES may pass!',
  '⚔️ Thou shalt not refuse the Princess! 🌹',
  '⚔️ My sword has sliced your "No" in half!',
  '⚔️ CRITICAL STRIKE! "No" has 0 HP left!',
  '⚔️ Even dragons cannot burn this date!',
  '⚔️ The realm demands: Click YES! ❤️',
];

export const KnightSlashingNoButton: React.FC<KnightSlashingNoButtonProps> = ({
  onYesAlternative,
  onSlashTriggered,
  onTouchChange,
}) => {
  const [slashCount, setSlashCount] = useState(0);
  const [isSlashing, setIsSlashing] = useState(false);
  const [activeQuip, setActiveQuip] = useState<string | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const handleTouchStart = () => {
    if (onTouchChange) onTouchChange(true);
  };

  const handleTouchEnd = () => {
    if (onTouchChange) onTouchChange(false);
  };

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger sword slash sound
    sound.playSwordSlash();

    const newCount = slashCount + 1;
    setSlashCount(newCount);
    setIsSlashing(true);

    if (onTouchChange) {
      onTouchChange(true);
    }

    if (onSlashTriggered) {
      onSlashTriggered();
    }

    const quip = KNIGHT_DEFENSE_QUIPS[(newCount - 1) % KNIGHT_DEFENSE_QUIPS.length];
    setActiveQuip(quip);

    // Screen shake / slash duration
    setTimeout(() => {
      setIsSlashing(false);
    }, 550);

    // If pressed 6 times, the knight playfully demands surrender to love
    if (newCount >= 6 && newCount % 3 === 0) {
      setTimeout(() => {
        setShowOverrideModal(true);
      }, 350);
    }
  };

  return (
    <div className="relative inline-block select-none z-30">
      {/* Knight Speech Bubble when slashing */}
      {activeQuip && (
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-zinc-950/95 border border-amber-500/70 text-amber-300 text-xs font-bold shadow-2xl shadow-amber-500/30 pointer-events-none transition-all z-40 ${
            isSlashing ? 'scale-110 -translate-y-1' : 'scale-100'
          }`}
        >
          {activeQuip}
        </div>
      )}

      {/* The NO Button (Stays in place!) */}
      <button
        type="button"
        onClick={handleNoClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
        onPointerEnter={handleTouchStart}
        onPointerLeave={handleTouchEnd}
        onMouseEnter={handleTouchStart}
        onMouseLeave={handleTouchEnd}
        onFocus={handleTouchStart}
        onBlur={handleTouchEnd}
        className={`relative overflow-hidden px-6 sm:px-8 py-3 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 font-hand font-bold text-lg shadow-xl transition-all active:scale-95 cursor-pointer border border-zinc-600/60 ${
          isSlashing ? 'animate-shake ring-2 ring-red-500/80' : ''
        }`}
      >
        {/* Button Label */}
        <span className={slashCount > 0 ? 'line-through decoration-red-500 decoration-2 text-zinc-400' : ''}>
          {slashCount === 0 ? 'no :(' : `no :( (x${slashCount})`}
        </span>

        {/* Diagonal Sword Slash Mark across the button if slashed */}
        {slashCount > 0 && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Red sword slash scar */}
            <div className="w-[130%] h-[3px] bg-red-500 -rotate-25 shadow-[0_0_10px_#ff0033]" />
          </div>
        )}

        {/* Dynamic Glowing Blade Slash Beam Animation directly over button */}
        {isSlashing && (
          <div
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
            style={{
              animation: 'swordBladeSlash 0.4s ease-out forwards',
            }}
          >
            {/* Brilliant white-cyan laser blade beam */}
            <div className="w-[170%] h-[5px] bg-gradient-to-r from-transparent via-white to-transparent -rotate-25 shadow-[0_0_16px_#ffffff,0_0_24px_#38bdf8]" />
            {/* Sparks Burst */}
            <div className="absolute w-8 h-8 bg-amber-400 rounded-full blur-[2px] animate-ping opacity-90" />
          </div>
        )}
      </button>

      {/* Royal Surrender Modal if stubbornly clicked */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-950 border border-amber-500/40 p-6 rounded-3xl max-w-sm text-center shadow-2xl relative overflow-hidden">
            <div className="text-4xl mb-3">🛡️⚔️🌹</div>
            <h3 className="font-script text-3xl text-amber-300 mb-2">
              Royal Knight Decrees:
            </h3>
            <p className="text-zinc-300 text-xs leading-relaxed mb-4 font-sans">
              &quot;Halt! Thy sword has parried the &lsquo;No&rsquo; {slashCount} times! The Princess has granted a royal pardon. Only <strong className="text-rose-400">YES</strong> shall remain in this kingdom!&quot;
            </p>
            <button
              onClick={() => {
                setShowOverrideModal(false);
                onYesAlternative();
              }}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              As Thou Wisheth, YES! ❤️🌹
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes swordBladeSlash {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-35deg);
          }
          40% {
            opacity: 1;
            transform: scale(1.2) rotate(-25deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.4) rotate(-15deg);
          }
        }
      `}</style>
    </div>
  );
};
