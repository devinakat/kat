import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Navigation,
  Utensils,
  Image as ImageIcon,
  Type,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Share2,
  Upload,
  Mail,
  Lock,
  Inbox,
  User,
  LogOut,
  Calendar,
  Phone,
  MessageCircle,
} from 'lucide-react';
import {
  DateAppConfig,
  DEFAULT_DATE_CONFIG,
  ROMANTIC_DATE_EXAMPLE_STOPS,
  ItineraryStopItem,
  FoodOptionConfig,
} from '../types/config';

export interface DateSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  whatsapp: string;
  foodChoice: string;
  personalMessage: string;
  tripTitle: string;
}

interface CustomizerModalProps {
  config: DateAppConfig;
  onSave: (newConfig: DateAppConfig) => void;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  config,
  onSave,
  onClose,
}) => {
  // Creator Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('date_creator_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [loginEmail, setLoginEmail] = useState<string>(() => {
    return localStorage.getItem('date_creator_email') || config.creatorEmail || 'devinakaty@gmail.com';
  });
  const [loginName, setLoginName] = useState<string>(() => {
    return localStorage.getItem('date_creator_name') || config.senderName || 'Devina';
  });
  const [loginPin, setLoginPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Submissions Inbox State
  const [submissions, setSubmissions] = useState<DateSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('date_creator_inbox');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'text' | 'drawings' | 'itinerary' | 'food' | 'share'>('text');
  const [formData, setFormData] = useState<DateAppConfig>(JSON.parse(JSON.stringify(config)));
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingStopIndex, setEditingStopIndex] = useState<number | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setLoginError('Tolong masukkan email yang valid untuk menerima hasil jawaban!');
      return;
    }
    // Success login
    setIsLoggedIn(true);
    setLoginError(null);
    try {
      localStorage.setItem('date_creator_logged_in', 'true');
      localStorage.setItem('date_creator_email', loginEmail.trim());
      localStorage.setItem('date_creator_name', loginName.trim() || 'Creator');
    } catch {
      // Ignore
    }
    // Update creatorEmail in config
    setFormData((prev) => ({ ...prev, creatorEmail: loginEmail.trim(), senderName: loginName.trim() || prev.senderName }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('date_creator_logged_in');
    } catch {
      // Ignore
    }
  };

  // Helper to handle image upload into base64 (compressed to max 450px)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'drawing1Url' | 'drawing2Url' | { optIdx: number; mealIdx: number }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 480;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          if (typeof field === 'string') {
            setFormData((prev) => ({ ...prev, [field]: dataUrl }));
          } else {
            setFormData((prev) => {
              const updated = { ...prev };
              if (updated.foodOptions[field.optIdx]?.meals?.[field.mealIdx]) {
                updated.foodOptions[field.optIdx].meals![field.mealIdx].photo = dataUrl;
              }
              return updated;
            });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndApply = () => {
    onSave(formData);
    onClose();
  };

  const handleLoadRomanticDateExample = () => {
    if (confirm('Ganti itinerary dengan contoh kencan romantis (Taman Bunga, Sunset, Candlelit Dinner, Stargazing)?')) {
      setFormData({
        ...formData,
        tripTitle: 'Our Romantic Date Itinerary',
        tripSubtitle: 'Jalan santai di taman, golden hour sunset, candlelit dinner romantis, dan stargazing!',
        itinerary: JSON.parse(JSON.stringify(ROMANTIC_DATE_EXAMPLE_STOPS)),
      });
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan ke settingan asli (Malang-Surabaya date & Princess/Knight theme)?')) {
      setFormData(JSON.parse(JSON.stringify(DEFAULT_DATE_CONFIG)));
      onSave(DEFAULT_DATE_CONFIG);
    }
  };

  // Generate shareable link
  const generateShareUrl = () => {
    try {
      const json = JSON.stringify(formData);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      const base = window.location.origin + window.location.pathname;
      return `${base}#invite=${encoded}`;
    } catch {
      return window.location.href;
    }
  };

  const copyShareUrl = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white leading-tight flex items-center gap-2">
                <span>Date Invitation Creator Studio</span>
                {isLoggedIn && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Logged in
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-zinc-400">
                {isLoggedIn
                  ? `Hasil jawaban akan masuk ke email ${formData.creatorEmail || loginEmail}`
                  : 'Silakan login terlebih dahulu untuk mengkustomisasi & melihat inbox jawaban'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If not logged in, show Creator Login view */}
        {!isLoggedIn ? (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Creator Studio Login</h3>
              <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed">
                Masukkan email kamu agar setiap kali pasanganmu mengisi &amp; menyetujui ajakan date ini, jawabannya langsung masuk ke email &amp; inbox studio kamu! 💌
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-sm space-y-3 pt-2 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nama Kamu (Creator / Pengundang)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="Contoh: Devina"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Alamat Email Kamu (Untuk Notifikasi Jawaban) *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="emailkamu@gmail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  PIN / Password Pribadi (Bebas / Opsional)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="Minimal 4 angka (contoh: 1234)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2 rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-transform active:scale-95"
              >
                Login &amp; Masuk ke Studio ✨
              </button>
            </form>
          </div>
        ) : (
          /* Logged In: Full Customizer with Inbox */
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 px-4 py-2 bg-zinc-900/30 border-b border-zinc-800/60 overflow-x-auto scrollbar-none text-xs">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Nickname &amp; Copy</span>
              </button>
              <button
                onClick={() => setActiveTab('drawings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'drawings'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Princess &amp; Knight Photos</span>
              </button>
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'itinerary'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Itinerary Stops</span>
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'food'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Food Choices</span>
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'share'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>

              <button
                onClick={handleLogout}
                title="Logout dari Creator Studio"
                className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 text-[11px]"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs text-zinc-300 font-sans space-y-4 scrollbar-thin">
              {/* TAB 1: Nickname & Copy */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                    <span className="font-semibold text-rose-300 block mb-1">
                      💖 Ganti Panggilan &amp; Teks
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Panggilan default sekarang &quot;my love&quot;, dan kamu bisa ganti dengan nama pasanganmu (contoh: sayang, baby, my knight, dsb.)!
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">
                        Panggilan Pasangan (Recipient Nickname) *
                      </label>
                      <input
                        type="text"
                        value={formData.recipientNickname}
                        onChange={(e) =>
                          setFormData({ ...formData, recipientNickname: e.target.value })
                        }
                        placeholder="e.g. my love, sayang, baby"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-1">
                        Email Kamu (Tujuan Hasil Jawaban) *
                      </label>
                      <input
                        type="email"
                        value={formData.creatorEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, creatorEmail: e.target.value })
                        }
                        placeholder="emailkamu@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <h4 className="font-semibold text-white">Halaman 1: Judul Ajakan Date</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Judul Baris 1</label>
                        <input
                          type="text"
                          value={formData.questionTitleLine1}
                          onChange={(e) =>
                            setFormData({ ...formData, questionTitleLine1: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Judul Baris 2</label>
                        <input
                          type="text"
                          value={formData.questionTitleLine2}
                          onChange={(e) =>
                            setFormData({ ...formData, questionTitleLine2: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <h4 className="font-semibold text-white">Halaman 2: Selebrasi Saat Klik YES</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Judul Merah Selebrasi</label>
                        <input
                          type="text"
                          value={formData.screen2HighlightLine2}
                          onChange={(e) =>
                            setFormData({ ...formData, screen2HighlightLine2: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Teks Tombol Lanjut</label>
                        <input
                          type="text"
                          value={formData.screen2ButtonText}
                          onChange={(e) =>
                            setFormData({ ...formData, screen2ButtonText: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <h4 className="font-semibold text-white">Halaman Terakhir (Finale)</h4>
                    <div>
                      <label className="block text-zinc-400 text-[11px] mb-1">Judul Penutup</label>
                      <input
                        type="text"
                        value={formData.thankYouTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, thankYouTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-1.5">
                      <span>🎵 Lagu Latar Romantis (YouTube BGM)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">YouTube URL Lagu</label>
                        <input
                          type="text"
                          value={formData.bgmYoutubeUrl || 'https://youtu.be/9hIi-VPoYbs?si=8QUM3IL375c1bAW2'}
                          onChange={(e) =>
                            setFormData({ ...formData, bgmYoutubeUrl: e.target.value })
                          }
                          placeholder="https://youtu.be/..."
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[11px] mb-1">Judul Lagu di Player</label>
                        <input
                          type="text"
                          value={formData.bgmTrackTitle || 'Congratulations (Piano Version) - goated.'}
                          onChange={(e) =>
                            setFormData({ ...formData, bgmTrackTitle: e.target.value })
                          }
                          placeholder="Judul Lagu..."
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Princess & Knight Photos */}
              {activeTab === 'drawings' && (
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="font-semibold text-amber-300 block mb-1">
                      🏰 Gambar Princess &amp; Knight
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Tema default menggunakan Princess &amp; Knight berlatar transparan. Kamu juga bisa mengupload foto couple pribadimu!
                    </span>
                  </div>

                  {/* Kneeling Knight & Princess */}
                  <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-28 bg-black/80 rounded-xl border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={formData.drawing1Url}
                        alt="Drawing 1 Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <h4 className="font-bold text-white text-sm">
                        Halaman 1: Kneeling Knight &amp; Princess (Rose)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Tampil saat pertanyaan &quot;wil you date with me&quot; dengan kesatria berlutut memberi mawar.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Gambar Baru</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'drawing1Url')}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              drawing1Url: '/assets/fantasy/knight_princess_kneel.png',
                            })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                        >
                          Reset Knight/Princess
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hugging Princess & Knight */}
                  <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-28 bg-black/80 rounded-xl border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                      <img
                        src={formData.drawing2Url}
                        alt="Drawing 2 Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <h4 className="font-bold text-white text-sm">
                        Halaman 2 &amp; 6: Hugging Princess &amp; Knight
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Tampil saat YESSS dirayakan dan di halaman terakhir penutup!
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Gambar Baru</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'drawing2Url')}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              drawing2Url: '/assets/fantasy/knight_princess_hug.png',
                            })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                        >
                          Reset Knight/Princess
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Itinerary Stops */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-white">Contoh Rute &amp; Kustomisasi</span>
                      <button
                        type="button"
                        onClick={handleLoadRomanticDateExample}
                        className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                      >
                        🌹 Pakai Contoh Date Romantis
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-zinc-400 text-[10px] mb-0.5">Judul Perjalanan</label>
                        <input
                          type="text"
                          value={formData.tripTitle}
                          onChange={(e) =>
                            setFormData({ ...formData, tripTitle: e.target.value })
                          }
                          placeholder="e.g. Our Romantic Date"
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-[10px] mb-0.5">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={formData.tripSubtitle}
                          onChange={(e) =>
                            setFormData({ ...formData, tripSubtitle: e.target.value })
                          }
                          placeholder="Deskripsi kencan..."
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stop Cards List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        Daftar Pemberhentian ({formData.itinerary.length} Stops)
                      </h4>
                      <button
                        onClick={() => {
                          const newId = (formData.itinerary[formData.itinerary.length - 1]?.id || 0) + 1;
                          const newStop: ItineraryStopItem = {
                            id: newId,
                            time: '18:00',
                            title: 'Kegiatan Baru',
                            location: 'Lokasi Spesial',
                            description: 'Aktivitas romantis berdua.',
                            badge: 'Date Spot ✨',
                            icon: 'car',
                            x: 50,
                            y: 50,
                            tip: 'Tips seru di spot ini!',
                          };
                          setFormData({
                            ...formData,
                            itinerary: [...formData.itinerary, newStop],
                          });
                          setEditingStopIndex(formData.itinerary.length);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Stop</span>
                      </button>
                    </div>

                    {formData.itinerary.map((stop, sIdx) => {
                      const isEditing = editingStopIndex === sIdx;

                      return (
                        <div
                          key={stop.id || sIdx}
                          className="p-3 bg-zinc-900/80 rounded-2xl border border-zinc-800 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center text-[10px]">
                                {sIdx + 1}
                              </span>
                              <span className="font-bold text-rose-400">{stop.time}</span>
                              <span className="font-semibold text-white">{stop.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingStopIndex(isEditing ? null : sIdx)}
                                className="text-xs text-sky-400 hover:underline px-1.5 py-0.5 cursor-pointer"
                              >
                                {isEditing ? 'Tutup' : 'Edit'}
                              </button>
                              {formData.itinerary.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = formData.itinerary.filter((_, i) => i !== sIdx);
                                    setFormData({ ...formData, itinerary: filtered });
                                  }}
                                  className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2 animate-fadeIn">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-zinc-400 mb-0.5">Jam / Waktu</label>
                                  <input
                                    type="text"
                                    value={stop.time}
                                    onChange={(e) => {
                                      const updated = [...formData.itinerary];
                                      updated[sIdx].time = e.target.value;
                                      setFormData({ ...formData, itinerary: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-zinc-400 mb-0.5">Judul Kegiatan</label>
                                  <input
                                    type="text"
                                    value={stop.title}
                                    onChange={(e) => {
                                      const updated = [...formData.itinerary];
                                      updated[sIdx].title = e.target.value;
                                      setFormData({ ...formData, itinerary: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-zinc-400 mb-0.5">Lokasi</label>
                                  <input
                                    type="text"
                                    value={stop.location}
                                    onChange={(e) => {
                                      const updated = [...formData.itinerary];
                                      updated[sIdx].location = e.target.value;
                                      setFormData({ ...formData, itinerary: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-zinc-400 mb-0.5">Tipe Icon</label>
                                  <select
                                    value={stop.icon}
                                    onChange={(e) => {
                                      const updated = [...formData.itinerary];
                                      updated[sIdx].icon = e.target.value as any;
                                      setFormData({ ...formData, itinerary: updated });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white"
                                  >
                                    <option value="car">Mobil / Roadtrip 🚗</option>
                                    <option value="food">Makanan / Cafe 🍛</option>
                                    <option value="hotel">Penginapan / Hotel 🏨</option>
                                    <option value="art">Pameran Seni / Galeri 🎨</option>
                                    <option value="shop">Mall / Belanja 🛍️</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] text-zinc-400 mb-0.5">Deskripsi Lengkap</label>
                                <textarea
                                  rows={2}
                                  value={stop.description}
                                  onChange={(e) => {
                                    const updated = [...formData.itinerary];
                                    updated[sIdx].description = e.target.value;
                                    setFormData({ ...formData, itinerary: updated });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white resize-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: Food Choices */}
              {activeTab === 'food' && (
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <span className="font-semibold text-rose-300 block mb-1">
                      🍽️ Kustomisasi Menu Makanan
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Menu makanan asli tetap tersedia (Cumi Hitam, Salomon Pizzaria, Fork, Bebek Palupi, Bakmi Aling, Depot Gentong Mas) dan dapat disesuaikan!
                    </span>
                  </div>

                  {formData.foodOptions.map((opt, oIdx) => (
                    <div
                      key={opt.id}
                      className="p-4 bg-zinc-900/70 rounded-2xl border border-zinc-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                          Option {opt.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                          {opt.tag}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-0.5">Judul Opsi</label>
                        <input
                          type="text"
                          value={opt.title}
                          onChange={(e) => {
                            const updated = [...formData.foodOptions];
                            updated[oIdx].title = e.target.value;
                            setFormData({ ...formData, foodOptions: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
                        />
                      </div>

                      {opt.meals && opt.meals.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {opt.meals.map((meal, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-2.5 bg-black/60 rounded-xl border border-zinc-800 space-y-2"
                            >
                              <div className="relative h-28 w-full rounded-lg overflow-hidden bg-zinc-900">
                                <img
                                  src={meal.photo}
                                  alt={meal.name}
                                  className="w-full h-full object-cover"
                                />
                                <label className="absolute bottom-1 right-1 px-2 py-1 rounded bg-black/80 hover:bg-black text-[10px] text-white flex items-center gap-1 cursor-pointer">
                                  <Upload className="w-3 h-3" />
                                  <span>Ganti Foto</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, { optIdx: oIdx, mealIdx: mIdx })
                                    }
                                  />
                                </label>
                              </div>

                              <div>
                                <label className="block text-[9px] text-zinc-500 mb-0.5">Waktu</label>
                                <input
                                  type="text"
                                  value={meal.timing}
                                  onChange={(e) => {
                                    const updated = [...formData.foodOptions];
                                    updated[oIdx].meals![mIdx].timing = e.target.value;
                                    setFormData({ ...formData, foodOptions: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-[11px]"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] text-zinc-500 mb-0.5">Nama Menu</label>
                                <input
                                  type="text"
                                  value={meal.name}
                                  onChange={(e) => {
                                    const updated = [...formData.foodOptions];
                                    updated[oIdx].meals![mIdx].name = e.target.value;
                                    setFormData({ ...formData, foodOptions: updated });
                                  }}
                                  className="w-full px-2 py-1 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-[11px]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: Share Link */}
              {activeTab === 'share' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-950 border border-rose-500/30 rounded-2xl text-center space-y-3">
                    <div className="text-3xl">💌✨</div>
                    <h3 className="text-base font-bold text-white">
                      Bagikan Undangan Date Kustom Kamu!
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                      Link ini berisi seluruh settingan kamu (panggilan {formData.recipientNickname}, rute itinerary, menu makanan pilihan, dan fotomu). Siapapun yang membuka link ini akan langsung melihat date invitation khusus untuk mereka!
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={copyShareUrl}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 transition-all cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? 'Link Tersalin!' : 'Copy Shareable Invite Link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={handleResetToDefault}
                      className="text-xs text-zinc-500 hover:text-zinc-300 underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Kembalikan ke settingan awal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs cursor-pointer"
          >
            Tutup
          </button>
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAndApply}
                className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Simpan &amp; Terapkan Perubahan ✨
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
