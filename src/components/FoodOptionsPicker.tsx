import React, { useState } from 'react';
import { CheckCircle2, Utensils, Heart, Edit3, ZoomIn, X } from 'lucide-react';
import { DateAppConfig, FoodOptionConfig, DEFAULT_DATE_CONFIG } from '../types/config';

export interface FoodSelection {
  selectedOptionId: number;
  customLunch: string;
  customDinner: string;
  customSnack: string;
  note: string;
}

interface FoodOptionsPickerProps {
  config: DateAppConfig;
  value: FoodSelection;
  onChange: (value: FoodSelection) => void;
  onProceed: () => void;
  onBack: () => void;
}

export const FOOD_OPTIONS = DEFAULT_DATE_CONFIG.foodOptions;

export const FoodOptionsPicker: React.FC<FoodOptionsPickerProps> = ({
  config,
  value,
  onChange,
  onProceed,
  onBack,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [zoomedPhoto, setZoomedPhoto] = useState<{ url: string; title: string } | null>(null);

  const optionsList = config.foodOptions && config.foodOptions.length > 0
    ? config.foodOptions
    : DEFAULT_DATE_CONFIG.foodOptions;

  const handleSelect = (id: number) => {
    setErrorMsg(null);
    onChange({ ...value, selectedOptionId: id });
  };

  const handleProceedClick = () => {
    const activeOpt = optionsList.find((o) => o.id === value.selectedOptionId);
    if (activeOpt?.isCustom) {
      if (!value.customLunch.trim() && !value.customDinner.trim()) {
        setErrorMsg('Tolong tulis menu siang atau malam yang kamu mau ya! 😊');
        return;
      }
    }
    onProceed();
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-3 flex flex-col text-white">
      {/* Title */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium mb-1">
          <Utensils className="w-3.5 h-3.5 text-rose-400" />
          <span>Culinary Date Selection</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-script font-bold text-white tracking-wide drop-shadow-md">
          What we will eat
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-md mx-auto">
          Pilih salah satu menu favorit kamu untuk date kita nanti, lengkap dengan foto aslinya! 😋❤️
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-4 mb-5">
        {optionsList.map((opt) => {
          const isSelected = value.selectedOptionId === opt.id;

          if (opt.isCustom) {
            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`relative rounded-2xl border transition-all duration-300 p-4 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-950 border-rose-500 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/40'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-rose-500 text-white' : 'border border-zinc-600 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Option {opt.id}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-rose-400" />
                        {opt.title || 'Please fill this (Respondent fills himself)'}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {opt.tag || 'Custom'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans mb-3 pl-8">
                  Punya makanan tertentu yang lagi kamu pengen banget? Tulis di sini, biar kita wujudin bareng!
                </p>

                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pl-8 pt-2 space-y-3 animate-fadeIn"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-rose-300 mb-1">
                        Siang / Lunch kamu pengen makan apa? *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Sushi, Steak, Dimsum, Bakso..."
                        value={value.customLunch}
                        onChange={(e) =>
                          onChange({ ...value, customLunch: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-rose-300 mb-1">
                        Malam / Dinner kamu pengen makan apa? *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Seafood, Pizza, Sate, Ramen..."
                        value={value.customDinner}
                        onChange={(e) =>
                          onChange({ ...value, customDinner: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Ada snack / minuman favorit? (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Shrimp cocktail, Ice cream matcha, Kopi..."
                        value={value.customSnack}
                        onChange={(e) =>
                          onChange({ ...value, customSnack: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`relative rounded-2xl border transition-all duration-300 p-4 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-950 border-rose-500 ring-2 ring-rose-500/50 shadow-xl shadow-rose-950/40'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              {/* Option header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-rose-500 text-white' : 'border border-zinc-600 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                      Option {opt.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {opt.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                  {opt.tag}
                </span>
              </div>

              {/* Photos & meal descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                {opt.meals?.map((meal, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex flex-col bg-zinc-950/90 rounded-xl border border-zinc-800/90 overflow-hidden shadow-lg group hover:border-zinc-700 transition-colors"
                  >
                    <div className="relative h-44 sm:h-40 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={meal.photo}
                        alt={meal.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-white/10 shadow-sm">
                        {meal.timing}
                      </div>

                      {/* Tap to zoom button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomedPhoto({ url: meal.photo, title: meal.name });
                        }}
                        title="Lihat foto penuh"
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs opacity-80 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 flex flex-col flex-grow">
                      <h4 className="text-sm font-bold text-white mb-1 flex items-center justify-between">
                        <span>{meal.name}</span>
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        {meal.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="mb-4 text-center text-xs text-rose-400 bg-rose-950/40 border border-rose-500/40 rounded-xl py-2 px-4 animate-shake">
          {errorMsg}
        </div>
      )}

      {/* Button: "will you proceed?" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800">
        <button
          onClick={onBack}
          className="text-xs text-zinc-400 hover:text-white px-4 py-2 cursor-pointer font-sans"
        >
          &larr; Back to Roadtrip Map
        </button>

        <button
          onClick={handleProceedClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-500/25 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span>Will you proceed?</span>
          <Heart className="w-4 h-4 fill-white" />
        </button>
      </div>

      {/* Full Resolution Photo Modal */}
      {zoomedPhoto && (
        <div
          onClick={() => setZoomedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-3 border-b border-zinc-800">
              <span className="font-bold text-sm text-white">{zoomedPhoto.title}</span>
              <button
                onClick={() => setZoomedPhoto(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={zoomedPhoto.url}
                alt={zoomedPhoto.title}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
