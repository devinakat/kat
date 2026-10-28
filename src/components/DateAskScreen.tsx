import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { KnightSlashingNoButton } from './KnightSlashingNoButton';
import { sound } from '../utils/audio';
import { DateAppConfig } from '../types/config';

interface DateAskScreenProps {
  config: DateAppConfig;
  onYesConfirmed: () => void;
  evasionCount: number;
  setEvasionCount: React.Dispatch<React.SetStateAction<number>>;
}

export const DateAskScreen: React.FC<DateAskScreenProps> = ({
  config,
  onYesConfirmed,
}) => {
  const [yesCelebrationMode, setYesCelebrationMode] = useState(false);
  const [isButtonTouched, setIsButtonTouched] = useState(false);
  const [isSlashingAction, setIsSlashingAction] = useState(false);
  const slashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);


  const handleYesClick = () => {
    sound.playYesChime();
    setYesCelebrationMode(true);

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#ffd166', '#ffffff', '#38bdf8'],
    });
  };

  const triggerKnightJumpingSlash = () => {
    if (slashTimerRef.current) {
      clearTimeout(slashTimerRef.current);
    }
    // Switch to second picture (slashing action)
    setIsSlashingAction(true);

    // Keep the slashing action alive for the jump, strike, and heroic landing
    slashTimerRef.current = setTimeout(() => {
      setIsSlashingAction(false);
    }, 1800);
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full max-w-md mx-auto px-4 py-5 flex flex-col justify-between items-center text-center text-white min-h-[92vh] overflow-hidden select-none"
    >
      {!yesCelebrationMode ? (
        /* SCREEN 1: "Will you date me" with First Picture (Kneeling Proposal) -> Second Picture on Slashing Action */
        <>
          {/* Top Heading: "Will you" / "DATE ME?" */}
          <div className="pt-2">
            <h1 className="font-satisfy text-4xl sm:text-5xl text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight">
              {config.questionTitleLine1 || 'Will you'}
            </h1>
            <h2 className="font-satisfy font-extrabold text-4xl sm:text-5xl text-rose-300 tracking-wide drop-shadow-[0_4px_16px_rgba(244,63,94,0.7)] mt-1">
              {config.questionTitleLine2 || 'DATE ME?'}
            </h2>

            {/* Subtitle */}
            <div className="mt-3 px-4">
              <p className="font-marker text-xs sm:text-sm text-amber-200 tracking-wider leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                {config.questionSubtitle || 'Take your time. Choose carefully. There is definitely a right answer.'}
              </p>
            </div>
          </div>

          {/* Action Buttons: YES and Knight Slashing NO Button */}
          <div className="w-full flex items-center justify-center gap-4 px-4 my-auto py-4 z-20 relative">
            {/* Big YES Button */}
            <button
              onClick={handleYesClick}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-script font-bold text-2xl sm:text-3xl shadow-[0_10px_30px_rgba(244,63,94,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 border border-rose-300/40"
            >
              <span>YES!!!!</span>
              <span className="text-white animate-pulse">❤️</span>
            </button>

            {/* Knight Slashing NO Button (stays in place, swaps picture to slashing knight when touched/hovered) */}
            <div className="relative">
              <KnightSlashingNoButton
                onYesAlternative={handleYesClick}
                onSlashTriggered={triggerKnightJumpingSlash}
                onTouchChange={setIsButtonTouched}
              />
            </div>
          </div>

          {/* Bottom Illustration Stage:
              Picture 1: Kneeling Knight offering rose to Princess (Default)
              Picture 2: Knight with raised sword seen from behind (Swapped when cursor touches NO button!)
          */}
          <div className="w-full relative mt-auto pt-2 flex flex-col items-center justify-end min-h-[270px] sm:min-h-[300px]">
            {/* Floating decorative elements */}
            <div className="absolute top-0 left-6 text-xl text-red-500 animate-bounce pointer-events-none">🌹</div>
            <div className="absolute top-2 right-8 text-lg text-rose-400 animate-pulse pointer-events-none">✨</div>
            <div className="absolute bottom-10 left-4 text-sm text-red-500 animate-pulse pointer-events-none">❤️</div>
            <div className="absolute bottom-6 right-6 text-base text-amber-400 animate-bounce pointer-events-none">🗡️</div>

            {/* The Illustration Swap Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[390px] h-64 sm:h-72 flex items-end justify-center">
              
              {/* PICTURE 1: Kneeling Proposal (Knight + Princess with Rose)
                  Visible when NOT touching NO button
              */}
              <div
                className={`absolute inset-0 flex items-end justify-center transition-all duration-150 drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] ${
                  isButtonTouched || isSlashingAction
                    ? 'opacity-0 scale-95 pointer-events-none'
                    : 'opacity-100 scale-100 pointer-events-auto'
                }`}
              >
                <img
                  src={
                    config.drawing1Url && config.drawing1Url !== '/assets/fantasy/standing_princess.png'
                      ? config.drawing1Url
                      : '/assets/fantasy/knight_princess_kneel.png'
                  }
                  alt="Knight kneeling with a rose for the Princess"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Floating romantic rose glow */}
                <div className="absolute bottom-16 right-1/2 translate-x-4 w-14 h-14 bg-rose-500/30 rounded-full blur-md animate-pulse pointer-events-none" />
              </div>

              {/* PICTURE 2: Slashing Knight with Sword Raised Overhead
                  Visible when cursor touches / hovers NO button!
              */}
              <div
                className={`absolute inset-0 flex items-end justify-center transition-all duration-150 drop-shadow-[0_20px_35px_rgba(0,0,0,0.98)] ${
                  isButtonTouched || isSlashingAction
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                } ${isSlashingAction ? 'animate-knight-jump-slash z-30' : ''}`}
              >
                <img
                  src="/assets/fantasy/slashing_knight_action.png"
                  alt="Knight defending with sword raised"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Cyan glowing blade energy and spark aura when touching NO button */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 bg-cyan-400/25 rounded-full blur-lg animate-pulse pointer-events-none" />

                {/* Flash impact when actually slashing */}
                {isSlashingAction && (
                  <div className="absolute -top-3 right-8 w-16 h-16 bg-rose-500/40 rounded-full blur-md animate-ping pointer-events-none" />
                )}
              </div>

            </div>
          </div>
        </>
      ) : (
        /* SCREEN 2: "YESSS YOU CHOOSE THE DATE ❤️" (Puji Syukur removed as requested!) */
        <>
          {/* Middle: YESSS YOU CHOOSE THE DATE ❤️ */}
          <div className="my-auto py-8 flex flex-col items-center justify-center animate-fadeIn">
            <div className="font-marker italic text-4xl sm:text-5xl text-[#ff0033] tracking-wider leading-tight drop-shadow-[0_0_24px_rgba(255,0,51,0.8)]">
              <div>{config.screen2HighlightLine1 || 'YESSS'}</div>
              <div className="my-2 flex items-center justify-center gap-1.5">
                <span>{config.screen2HighlightLine2 || 'YOU CHOOSE THE DATE ❤️'}</span>
              </div>
            </div>

            {/* Button: "Lets make it" */}
            <div className="mt-8 w-full max-w-xs">
              <button
                onClick={onYesConfirmed}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white font-script font-bold text-2xl sm:text-3xl shadow-[0_10px_30px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-200/50"
              >
                <span>{config.screen2ButtonText || 'Lets make it ✨'}</span>
              </button>
              <p className="text-[11px] text-zinc-300 font-sans mt-2 drop-shadow-md">
                Klik untuk melihat rencana petualangan kita!
              </p>
            </div>
          </div>

          {/* Bottom Illustration: Transparent Hugging Princess & Knight */}
          <div className="w-full relative mt-auto pt-2 flex flex-col items-center">
            {/* Floating decorative hearts */}
            <div className="absolute top-2 left-6 text-2xl text-red-500 animate-pulse">❤️</div>
            <div className="absolute top-0 right-10 text-2xl text-red-500 animate-bounce">🌹</div>
            <div className="absolute bottom-10 left-4 text-xl text-amber-400 animate-bounce">✨</div>
            <div className="absolute bottom-8 right-6 text-xl text-rose-500 animate-pulse">❤️</div>

            {/* Transparent Hugging Knight & Princess */}
            <div className="relative max-w-[260px] sm:max-w-[290px] drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)]">
              <img
                src={config.drawing2Url || '/assets/fantasy/knight_princess_hug.png'}
                alt="Princess and Knight hugging"
                className="w-full h-auto object-contain pointer-events-none max-h-64"
              />
            </div>
          </div>
        </>
      )}

      {/* Knight Jumping Slash Animation into the NO Button Keyframes */}
      <style>{`
        @keyframes knightJumpSlash {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(-30px, -80px) scale(1.18) rotate(-12deg);
          }
          50% {
            transform: translate(-55px, -145px) scale(1.28) rotate(-22deg);
            filter: drop-shadow(0 0 20px #38bdf8);
          }
          70% {
            transform: translate(-50px, -135px) scale(1.22) rotate(-15deg);
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
        }

        .animate-knight-jump-slash {
          animation: knightJumpSlash 0.85s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards;
        }

        @keyframes knightReadyPulse {
          0%, 100% {
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 16px 32px rgba(0,0,0,0.95)) drop-shadow(0 0 8px rgba(56,189,248,0.35));
          }
          50% {
            transform: scale(1.04) translateY(-4px);
            filter: drop-shadow(0 20px 36px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(56,189,248,0.75));
          }
        }

        .animate-knight-ready-pulse {
          animation: knightReadyPulse 1.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
