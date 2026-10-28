import React, { useState, useEffect, useRef } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Utensils,
  Hotel,
  Palette,
  ShoppingBag,
  Sparkles,
  Play,
  RotateCcw,
  ChevronRight,
  Heart,
  Navigation,
} from 'lucide-react';
import { DateAppConfig, ItineraryStopItem } from '../types/config';

interface ItineraryMapProps {
  config: DateAppConfig;
  onProceed: () => void;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({ config, onProceed }) => {
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stops = config.itinerary && config.itinerary.length > 0 ? config.itinerary : [];

  // Reset index if out of bounds
  useEffect(() => {
    if (activeStopIndex >= stops.length) {
      setActiveStopIndex(0);
    }
  }, [stops.length, activeStopIndex]);

  const activeStop = stops[activeStopIndex] || {
    id: 1,
    time: '17:00',
    title: 'Berangkat',
    location: 'Titik Awal',
    description: 'Road trip starts!',
    badge: 'Roadtrip 🚗',
    icon: 'car',
    x: 20,
    y: 80,
    tip: 'Ready to go!',
  };

  // Auto-play car movement through the roadtrip
  useEffect(() => {
    if (!isPlaying || stops.length <= 1) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    playTimerRef.current = setInterval(() => {
      setActiveStopIndex((prev) => {
        if (prev >= stops.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, stops.length]);

  const togglePlay = () => {
    if (activeStopIndex >= stops.length - 1) {
      setActiveStopIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const restartTrip = () => {
    setActiveStopIndex(0);
    setIsPlaying(true);
  };

  // Generate SVG path connecting the stops sequentially
  const pathD = stops.reduce((acc, stop, i) => {
    // If x,y not set, evenly distribute
    const x = stop.x ?? 15 + (i * 70) / Math.max(1, stops.length - 1);
    const y = stop.y ?? (i % 2 === 0 ? 30 : 70);

    if (i === 0) return `M ${x} ${y}`;
    const prev = stops[i - 1];
    const prevX = prev.x ?? 15 + ((i - 1) * 70) / Math.max(1, stops.length - 1);
    const prevY = prev.y ?? ((i - 1) % 2 === 0 ? 30 : 70);

    const mx = (prevX + x) / 2 + (i % 2 === 0 ? 4 : -4);
    const my = (prevY + y) / 2 + (i % 2 === 0 ? -4 : 4);
    return `${acc} Q ${mx} ${my}, ${x} ${y}`;
  }, '');

  return (
    <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-3 flex flex-col text-white">
      {/* Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium mb-1">
          <Navigation className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Our Roadtrip Map & Timeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-script font-bold text-white tracking-wide drop-shadow-md">
          {config.tripTitle || 'Malang – Surabaya Itinerary'}
        </h2>
        <p className="text-xs text-zinc-300 font-sans max-w-md mx-auto">
          {config.tripSubtitle || 'Tonton perjalanan mobil kita bersama menikmati momen indah sepanjang rute!'}
        </p>
      </div>

      {/* Road Trip Interactive Map */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-zinc-950/90 via-slate-900/90 to-zinc-950/90 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden p-3 mb-3">
        {/* Subtle grid/map texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Territory tags */}
        <div className="absolute top-2 right-4 text-[11px] font-bold text-sky-400/80 uppercase tracking-widest flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          Destination
        </div>
        <div className="absolute bottom-2 left-4 text-[11px] font-bold text-emerald-400/80 uppercase tracking-widest flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Starting Point
        </div>

        {/* SVG Route Path */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Road highway outline */}
          <path
            d={pathD}
            fill="none"
            stroke="#27272a"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated dashed road markings */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 3"
            strokeDashoffset={-activeStopIndex * 6}
            filter="url(#glow)"
            className="transition-all duration-700"
          />
        </svg>

        {/* Milestone Pins on the Map */}
        {stops.map((stop, index) => {
          const isActive = index === activeStopIndex;
          const isPassed = index <= activeStopIndex;
          const posX = stop.x ?? 15 + (index * 70) / Math.max(1, stops.length - 1);
          const posY = stop.y ?? (index % 2 === 0 ? 30 : 70);

          return (
            <button
              key={stop.id || index}
              onClick={() => {
                setActiveStopIndex(index);
                setIsPlaying(false);
              }}
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              title={`${stop.time} - ${stop.title}`}
              className={`absolute group cursor-pointer transition-all duration-300 z-10 ${
                isActive ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition-colors ${
                  isActive
                    ? 'bg-rose-500 text-white ring-4 ring-rose-400/40 animate-bounce'
                    : isPassed
                    ? 'bg-amber-400 text-zinc-900 ring-2 ring-amber-400/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {index + 1}
              </div>

              {/* Tooltip on pin */}
              <div
                className={`absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-tight transition-opacity pointer-events-none ${
                  isActive
                    ? 'bg-rose-600 text-white opacity-100'
                    : 'bg-black/80 text-zinc-300 opacity-0 group-hover:opacity-100'
                }`}
              >
                {stop.time}
              </div>
            </button>
          );
        })}

        {/* The Animated Road Trip Car Driving Along the Route! */}
        <div
          style={{
            left: `${activeStop.x ?? 50}%`,
            top: `${activeStop.y ?? 50}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.9s cubic-bezier(0.34, 1.25, 0.64, 1)',
          }}
          className="absolute z-30 pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Cute driving speech bubble */}
            <div className="px-2 py-0.5 mb-1 rounded-full bg-white text-zinc-900 text-[10px] font-bold shadow-lg animate-pulse-slow whitespace-nowrap flex items-center gap-1">
              <span>🚗</span>
              <span>{activeStop.time}</span>
            </div>

            {/* Car Icon with glowing headlight beams */}
            <div className="relative bg-gradient-to-tr from-rose-600 to-red-500 text-white p-2 rounded-xl shadow-xl shadow-red-500/50 border border-rose-300">
              <Car className="w-5 h-5 text-white animate-pulse" />
              {/* Headlight beam */}
              <div className="absolute -top-1 -right-3 w-4 h-2 bg-yellow-300/40 blur-xs rounded-full -rotate-12" />
            </div>
          </div>
        </div>

        {/* Map Control Bar Overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700/60 shadow-lg">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1 text-[11px] font-medium text-zinc-200 hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
          >
            <Play className={`w-3 h-3 ${isPlaying ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} />
            <span>{isPlaying ? 'Pause' : 'Drive'}</span>
          </button>
          <button
            onClick={restartTrip}
            title="Restart roadtrip"
            className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-zinc-400 pl-1 border-l border-zinc-700">
            {activeStopIndex + 1}/{stops.length}
          </span>
        </div>
      </div>

      {/* Currently Active Milestone Card */}
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-xl transition-all duration-300 mb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {activeStop.icon === 'food' && <Utensils className="w-5 h-5" />}
              {activeStop.icon === 'hotel' && <Hotel className="w-5 h-5" />}
              {activeStop.icon === 'art' && <Palette className="w-5 h-5" />}
              {activeStop.icon === 'shop' && <ShoppingBag className="w-5 h-5" />}
              {activeStop.icon === 'car' && <Car className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeStop.time}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {activeStop.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {activeStop.title}
              </h3>
            </div>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            {activeStop.location}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-2 font-sans">
          {activeStop.description}
        </p>

        {activeStop.tip && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/30 border border-amber-800/40 rounded-lg px-2.5 py-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>{activeStop.tip}</span>
          </div>
        )}

        {/* Stepper Buttons */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/80">
          <button
            disabled={activeStopIndex === 0}
            onClick={() => {
              setActiveStopIndex((prev) => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            className="text-xs text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 px-2 py-1 rounded cursor-pointer"
          >
            &larr; Prev Stop
          </button>

          <div className="flex gap-1 max-w-[200px] overflow-hidden justify-center">
            {stops.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveStopIndex(i);
                  setIsPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === activeStopIndex ? 'w-5 bg-rose-500' : 'bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <button
            disabled={activeStopIndex === stops.length - 1}
            onClick={() => {
              setActiveStopIndex((prev) => Math.min(stops.length - 1, prev + 1));
              setIsPlaying(false);
            }}
            className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40 px-2 py-1 rounded font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Next Stop</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Itinerary List preview pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
        {stops.map((stop, i) => (
          <button
            key={stop.id || i}
            onClick={() => {
              setActiveStopIndex(i);
              setIsPlaying(false);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-left border transition-all cursor-pointer ${
              i === activeStopIndex
                ? 'bg-rose-500/20 border-rose-500 text-white ring-1 ring-rose-500'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="text-[10px] text-rose-400 font-semibold">{stop.time}</div>
            <div className="text-xs font-medium truncate max-w-[130px]">{stop.title}</div>
          </button>
        ))}
      </div>

      {/* Proceed CTA */}
      <div className="text-center pt-1">
        <button
          onClick={onProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Utensils className="w-4 h-4" />
          <span>Next: What We Will Eat? 🍽️</span>
          <Heart className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
};
