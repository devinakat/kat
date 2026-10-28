import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, Copy, Check, Sparkles, ExternalLink, Coffee, Mail } from 'lucide-react';
import { FoodSelection } from './FoodOptionsPicker';
import { RespondentInfo } from './ContactForm';
import { DateAppConfig } from '../types/config';

interface ThankYouCelebrationProps {
  config: DateAppConfig;
  foodSelection: FoodSelection;
  respondentInfo: RespondentInfo;
  onViewItinerary: () => void;
  onReset: () => void;
  onOpenCustomizer?: () => void;
}

export const ThankYouCelebration: React.FC<ThankYouCelebrationProps> = ({
  config,
  foodSelection,
  respondentInfo,
  onViewItinerary,
  onReset,
  onOpenCustomizer,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Trigger romantic celebration confetti on mount
  useEffect(() => {
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff', '#ffd166', '#38bdf8'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffffff', '#ffd166', '#38bdf8'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Determine selected food label
  const foodList = config.foodOptions || [];
  const selectedFoodObj = foodList.find((o) => o.id === foodSelection.selectedOptionId);
  let foodSummaryText = selectedFoodObj ? selectedFoodObj.title : 'Option 1';
  if (foodSelection.selectedOptionId === 4) {
    foodSummaryText = `Custom: Siang (${foodSelection.customLunch || 'Request'}) & Malam (${foodSelection.customDinner || 'Request'})`;
  }

  const nickname = config.recipientNickname || 'my love';

  // WhatsApp message starting with exact user phrase:
  // "hello, i've just set the date check this out and be prepared!"
  const waMessage = encodeURIComponent(
    `Hello, i've just set the date check this out and be prepared! ❤️\n\n` +
      `🌹 From: ${respondentInfo.name || nickname}\n` +
      `🍽️ Food Choice: ${foodSummaryText}\n` +
      `🚗 Itinerary: ${config.tripTitle || 'Roadtrip Itinerary'}\n` +
      (respondentInfo.personalMessage ? `💌 Note: "${respondentInfo.personalMessage}"\n` : '') +
      `\nCan't wait for our date! ✨`
  );

  const waUrl = `https://wa.me/?text=${waMessage}`;

  const copySummary = () => {
    const summaryText =
      `✨ DATE CONFIRMED ✨\n` +
      `With: ${respondentInfo.name || nickname}\n` +
      `Trip: ${config.tripTitle || 'Roadtrip'}\n` +
      `Menu: ${foodSummaryText}\n` +
      `Status: Locked in! ❤️`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center text-center text-white min-h-[92vh] justify-between">
      {/* Top Header: "sweets lets make it come true." */}
      <div className="pt-2">
        <h2 className="font-satisfy text-3xl sm:text-4xl text-[#ff0033] tracking-wide drop-shadow-[0_2px_14px_rgba(255,0,51,0.6)] leading-tight">
          {config.thankYouTitle || 'sweets lets make it come true.'}
        </h2>
      </div>

      {/* Middle: Big Red Glowing Heart from Figma */}
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={() => confetti()}>
          {/* Outer glow */}
          <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full animate-pulse-slow" />
          {/* Big Realistic Heart */}
          <div className="relative transform hover:scale-110 active:scale-95 transition-transform duration-300">
            <svg
              viewBox="0 0 100 100"
              className="w-28 h-28 sm:w-36 sm:h-36 filter drop-shadow-[0_8px_24px_rgba(239,35,60,0.6)] animate-pulse-slow"
            >
              <defs>
                <radialGradient id="heartGradient" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="40%" stopColor="#e60026" />
                  <stop offset="85%" stopColor="#990012" />
                  <stop offset="100%" stopColor="#55000a" />
                </radialGradient>
              </defs>
              <path
                d="M50,88 C50,88 10,60 10,32 C10,18 21,9 35,9 C43,9 48,14 50,18 C52,14 57,9 65,9 C79,9 90,18 90,32 C90,60 50,88 50,88 Z"
                fill="url(#heartGradient)"
              />
              <ellipse cx="32" cy="24" rx="10" ry="5" fill="rgba(255,255,255,0.45)" transform="rotate(-30 32 24)" />
            </svg>
          </div>
        </div>

        {/* Date Ticket Summary Card */}
        <div className="w-full mt-4 bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 text-left text-xs font-sans shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Road Trip Ticket Confirmed
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold">
              Ready! 🎟️
            </span>
          </div>

          <div className="space-y-1.5 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Date with:</span>
              <span className="font-semibold text-white">{respondentInfo.name || nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Contact:</span>
              <span className="text-zinc-300">{respondentInfo.whatsapp || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Food Plan:</span>
              <span className="font-semibold text-amber-300 truncate max-w-[190px]">{foodSummaryText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Trip:</span>
              <span className="text-zinc-300">{config.tripTitle || 'Our Date'}</span>
            </div>
            {respondentInfo.personalMessage && (
              <div className="pt-1 text-[11px] text-pink-300 italic border-t border-zinc-800/60 mt-1">
                &ldquo;{respondentInfo.personalMessage}&rdquo;
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-zinc-800">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send to WhatsApp</span>
            </a>
            <a
              href={`mailto:${config.creatorEmail || 'devinakaty@gmail.com'}?subject=${encodeURIComponent(
                `Date Confirmed: ${respondentInfo.name || nickname} accepted your date!`
              )}&body=${encodeURIComponent(
                `Hai ${config.senderName || 'Devina'}!\n\n` +
                  `Aku udah konfirmasi date kita! ❤️\n\n` +
                  `Nama: ${respondentInfo.name || nickname}\n` +
                  `WhatsApp: ${respondentInfo.whatsapp || '-'}\n` +
                  `Email: ${respondentInfo.email || '-'}\n` +
                  `Pilihan Makanan: ${foodSummaryText}\n` +
                  `Itinerary: ${config.tripTitle || 'Our Date'}\n\n` +
                  (respondentInfo.personalMessage ? `Pesan: "${respondentInfo.personalMessage}"\n\n` : '') +
                  `Can't wait for our date! ✨`
              )}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Creator</span>
            </a>
          </div>

          <div className="mt-2 text-center">
            <button
              onClick={copySummary}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Summary Copied!' : 'Copy Ticket Summary'}</span>
            </button>
          </div>
        </div>

        {/* Support the Dev Link (Below road trip ticket confirmed, above picture) */}
        <div className="my-3 flex flex-col items-center">
          <a
            href={config.supportDevUrl || 'https://saweria.co/katenivore'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/25 to-amber-500/20 hover:from-amber-500/35 hover:to-rose-500/35 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Support the Dev</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Bottom Illustration: Animated Hugging Princess & Knight */}
      <div className="w-full relative mt-auto pt-1 flex flex-col items-center">
        {/* Floating animated hearts & roses drifting upwards */}
        <div className="absolute -top-3 left-6 text-xl animate-bounce">🌹</div>
        <div className="absolute -top-4 right-8 text-2xl animate-pulse">❤️</div>
        <div className="absolute bottom-16 left-10 text-lg text-rose-500 animate-pulse">✨</div>
        <div className="absolute bottom-12 right-12 text-xl text-amber-400 animate-bounce">💖</div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-ping opacity-75">💕</div>

        {/* Animated Hugging Princess & Knight Container */}
        <div className="relative max-w-[250px] sm:max-w-[280px]">
          {/* Loving Heartbeat Glow Behind Them */}
          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/25 via-pink-500/20 to-transparent rounded-full blur-xl animate-pulse-slow pointer-events-none scale-110" />

          {/* Hugging Characters with breathing & gentle swaying animation */}
          <div
            className="relative drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
            style={{
              animation: 'hugBreatheSway 4s ease-in-out infinite alternate',
            }}
          >
            <img
              src={config.drawing2Url || '/assets/fantasy/knight_princess_hug.png'}
              alt="Princess and Knight lovingly hugging"
              className="w-full h-auto object-contain pointer-events-none max-h-64"
            />
          </div>
        </div>

        <style>{`
          @keyframes hugBreatheSway {
            0% {
              transform: scale(1) translateY(0) rotate(-1deg);
            }
            50% {
              transform: scale(1.03) translateY(-4px) rotate(1deg);
            }
            100% {
              transform: scale(1) translateY(0) rotate(-1deg);
            }
          }
        `}</style>

        {/* Footer controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400 mt-2">
          <button
            onClick={onViewItinerary}
            className="hover:text-zinc-200 underline cursor-pointer"
          >
            Review Itinerary 🗺️
          </button>
          <span>&bull;</span>
          <button
            onClick={onReset}
            className="hover:text-zinc-200 underline cursor-pointer"
          >
            Replay Experience 🔄
          </button>
          {onOpenCustomizer && (
            <>
              <span>&bull;</span>
              <button
                onClick={onOpenCustomizer}
                className="text-rose-400 hover:text-rose-300 underline cursor-pointer font-medium"
              >
                Make Your Own Date Invite ✨
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
