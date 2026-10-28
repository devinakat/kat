import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Sparkles, Heart, Users } from 'lucide-react';
import { FantasyBackground } from './components/FantasyBackground';
import { DateAskScreen } from './components/DateAskScreen';
import { ItineraryMap } from './components/ItineraryMap';
import { FoodOptionsPicker, FoodSelection } from './components/FoodOptionsPicker';
import { ContactForm, RespondentInfo } from './components/ContactForm';
import { ThankYouCelebration } from './components/ThankYouCelebration';
import { CustomizerModal, DateSubmission } from './components/CustomizerModal';
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import { DateAppConfig, DEFAULT_DATE_CONFIG } from './types/config';

export type AppStep =
  | 'ask' // Screen 1: Will you date me
  | 'accepted' // Screen 2: YESSS YOU CHOOSE THE DATE ❤️
  | 'itinerary' // Screen 3: Roadtrip with animated car & map
  | 'food' // Screen 4: What we will eat (photo cards & custom option)
  | 'contact' // Screen 5: Almost there! Just need a way to reach you
  | 'thankyou'; // Screen 6: sweets lets make it come true.

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('ask');
  const [evasionCount, setEvasionCount] = useState(0);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCustomInviteUrl, setIsCustomInviteUrl] = useState(false);

  // Real Visitor Count (Top Right of All Pages)
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('date_real_visitor_count');
      const count = stored ? parseInt(stored, 10) : 1;
      return isNaN(count) || count < 1 ? 1 : count;
    } catch {
      return 1;
    }
  });

  // Track & Fetch Real Visitor Hit from backend
  useEffect(() => {
    let visitorToken = '';
    try {
      visitorToken = localStorage.getItem('date_visitor_token') || '';
      if (!visitorToken) {
        visitorToken = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('date_visitor_token', visitorToken);
      }
    } catch {
      visitorToken = 'v_user';
    }

    // Call real visitor endpoint
    fetch('/api/visitors/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorToken }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (typeof data.totalVisitors === 'number') {
          setVisitorCount(data.totalVisitors);
          localStorage.setItem('date_real_visitor_count', data.totalVisitors.toString());
        }
      })
      .catch(() => {
        // Fallback: try GET /api/visitors or local increment once per browser session
        fetch('/api/visitors')
          .then((res) => res.json())
          .then((data) => {
            if (typeof data.totalVisitors === 'number') {
              setVisitorCount(data.totalVisitors);
              localStorage.setItem('date_real_visitor_count', data.totalVisitors.toString());
            }
          })
          .catch(() => {
            try {
              const sessionRecorded = sessionStorage.getItem('date_counted_session');
              if (!sessionRecorded) {
                sessionStorage.setItem('date_counted_session', 'true');
                setVisitorCount((prev) => {
                  const updated = prev + 1;
                  localStorage.setItem('date_real_visitor_count', updated.toString());
                  return updated;
                });
              }
            } catch {
              // Ignore
            }
          });
      });
  }, []);

  // Date App Configuration
  const [config, setConfig] = useState<DateAppConfig>(() => {
    // 1. Try decoding from URL hash (#invite=...)
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#invite=')) {
      try {
        const encoded = window.location.hash.replace('#invite=', '');
        const json = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(json);
        return { ...DEFAULT_DATE_CONFIG, ...parsed };
      } catch (err) {
        console.error('Failed to parse URL config:', err);
      }
    }

    // 2. Try loading from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('custom_date_config_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.drawing1Url === '/assets/fantasy/standing_princess.png' || !parsed.drawing1Url) {
            parsed.drawing1Url = '/assets/fantasy/knight_princess_kneel.png';
          }
          if (!parsed.questionTitleLine2 || parsed.questionTitleLine2.toLowerCase() === 'date me') {
            parsed.questionTitleLine2 = 'DATE ME?';
          }
          if (!parsed.bgmYoutubeUrl) {
            parsed.bgmYoutubeUrl = 'https://youtu.be/9hIi-VPoYbs?si=8QUM3IL375c1bAW2';
            parsed.bgmTrackTitle = 'Congratulations (Piano Version) - goated.';
          }
          return { ...DEFAULT_DATE_CONFIG, ...parsed };
        }
      } catch {
        // Fallback
      }
    }

    return DEFAULT_DATE_CONFIG;
  });

  // Check if loaded from a shared URL invite
  useEffect(() => {
    if (window.location.hash.startsWith('#invite=')) {
      setIsCustomInviteUrl(true);
    }
  }, []);

  // Stored respondent selections
  const [foodSelection, setFoodSelection] = useState<FoodSelection>({
    selectedOptionId: 1,
    customLunch: '',
    customDinner: '',
    customSnack: '',
    note: '',
  });

  const [respondentInfo, setRespondentInfo] = useState<RespondentInfo>({
    name: config.recipientNickname || 'my love',
    email: '',
    whatsapp: '',
    personalMessage: '',
  });

  const handleSaveConfig = (newConfig: DateAppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('custom_date_config_v2', JSON.stringify(newConfig));
    } catch {
      // localStorage may fail if image is large
    }
    setRespondentInfo((prev) => ({
      ...prev,
      name: prev.name === 'Hansome' || prev.name === 'my love' ? newConfig.recipientNickname : prev.name,
    }));
  };

  // Called when respondent submits on Screen 5
  const handleRespondentSubmit = () => {
    // 1. Determine food label
    const selectedFoodObj = config.foodOptions.find((o) => o.id === foodSelection.selectedOptionId);
    let foodText = selectedFoodObj ? selectedFoodObj.title : 'Option 1';
    if (foodSelection.selectedOptionId === 4) {
      foodText = `Custom: Siang (${foodSelection.customLunch || 'Request'}) & Malam (${foodSelection.customDinner || 'Request'})`;
    }

    // 2. Save submission to Creator Inbox
    try {
      const existingInbox: DateSubmission[] = JSON.parse(
        localStorage.getItem('date_creator_inbox') || '[]'
      );
      const newSubmission: DateSubmission = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        name: respondentInfo.name || config.recipientNickname || 'My Love',
        email: respondentInfo.email,
        whatsapp: respondentInfo.whatsapp,
        foodChoice: foodText,
        personalMessage: respondentInfo.personalMessage,
        tripTitle: config.tripTitle,
      };
      localStorage.setItem('date_creator_inbox', JSON.stringify([newSubmission, ...existingInbox]));
    } catch {
      // Ignore
    }

    // 3. Move to finale celebration
    setCurrentStep('thankyou');
  };

  const resetAll = () => {
    setCurrentStep('ask');
    setEvasionCount(0);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Fantasy Castle Background with Moving Trees & Flying Dragon */}
      <FantasyBackground />

      {/* Visitor Count (People Icon & Number on Right Side Up / Top Right of All Pages) */}
      <div
        className="fixed top-3 right-3 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md text-zinc-300 text-xs shadow-lg select-none transition-all"
        title="Visitor Count"
      >
        <Users className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-medium text-[11px] tracking-wide">{visitorCount.toLocaleString()}</span>
      </div>

      {/* Shared Invitation Notice (if accessed via shared link) */}
      {isCustomInviteUrl && currentStep === 'ask' && (
        <div className="relative z-30 w-full bg-gradient-to-r from-amber-950/80 via-zinc-900/90 to-amber-950/80 border-b border-amber-500/30 px-3 py-1.5 text-center text-[11px] text-amber-300 flex items-center justify-center gap-1.5 backdrop-blur-md animate-fadeIn">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
          <span>A special royal date invitation created just for you! 🌹✨</span>
        </div>
      )}

      {/* Floating Discreet "Customize Invite" Button */}
      <div className="fixed bottom-3 right-3 z-40">
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-900/85 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-amber-500/40 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Customize itinerary, food, drawings, and partner name"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden sm:inline">Customize This Invite</span>
          <Sparkles className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* Floating Romantic Background Music Player (Congratulations Piano Version) */}
      <BackgroundMusicPlayer
        youtubeUrl={config.bgmYoutubeUrl || 'https://youtu.be/9hIi-VPoYbs?si=8QUM3IL375c1bAW2'}
        trackTitle={config.bgmTrackTitle || 'Congratulations (Piano Version) - goated.'}
      />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-2 py-4 sm:px-4 sm:py-6">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
          {renderActiveScreen()}
        </div>
      </main>

      {/* Customizer Modal */}
      {isCustomizerOpen && (
        <CustomizerModal
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}
    </div>
  );

  function renderActiveScreen() {
    switch (currentStep) {
      case 'ask':
        return (
          <DateAskScreen
            config={config}
            onYesConfirmed={() => setCurrentStep('accepted')}
            evasionCount={evasionCount}
            setEvasionCount={setEvasionCount}
          />
        );

      case 'accepted':
        return (
          <DateAskScreen
            config={config}
            onYesConfirmed={() => setCurrentStep('itinerary')}
            evasionCount={evasionCount}
            setEvasionCount={setEvasionCount}
          />
        );

      case 'itinerary':
        return (
          <ItineraryMap
            config={config}
            onProceed={() => setCurrentStep('food')}
          />
        );

      case 'food':
        return (
          <FoodOptionsPicker
            config={config}
            value={foodSelection}
            onChange={setFoodSelection}
            onProceed={() => setCurrentStep('contact')}
            onBack={() => setCurrentStep('itinerary')}
          />
        );

      case 'contact':
        return (
          <ContactForm
            config={config}
            value={respondentInfo}
            onChange={setRespondentInfo}
            onSubmit={handleRespondentSubmit}
            onBack={() => setCurrentStep('food')}
          />
        );

      case 'thankyou':
        return (
          <ThankYouCelebration
            config={config}
            foodSelection={foodSelection}
            respondentInfo={respondentInfo}
            onViewItinerary={() => setCurrentStep('itinerary')}
            onReset={resetAll}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />
        );

      default:
        return null;
    }
  }
}
