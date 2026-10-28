import React, { useState } from 'react';
import { User, Mail, Phone, Heart, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { DateAppConfig } from '../types/config';

export interface RespondentInfo {
  name: string;
  email: string;
  whatsapp: string;
  personalMessage: string;
}

interface ContactFormProps {
  config: DateAppConfig;
  value: RespondentInfo;
  onChange: (value: RespondentInfo) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  config,
  value,
  onChange,
  onSubmit,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaultNickname = config.recipientNickname || 'my love';

  const validate = () => {
    const err: Record<string, string> = {};
    if (!value.name.trim()) {
      err.name = 'Tolong isi namamu ya! 💕';
    }
    if (!value.whatsapp.trim()) {
      err.whatsapp = 'Tolong isi nomor WhatsApp biar bisa saling kabar! 📱';
    }
    if (!value.email.trim()) {
      err.email = 'Tolong isi alamat emailmu juga ya! ✉️';
    } else if (!value.email.includes('@')) {
      err.email = 'Format email belum sesuai';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-5 flex flex-col text-white">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Final Step</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-script font-bold text-white tracking-wide drop-shadow-md mb-1.5">
          Almost there!
        </h2>
        <p className="text-base sm:text-lg font-hand text-rose-300 font-bold tracking-wide">
          Just need a way to reach you ❤️
        </p>
        <p className="text-xs text-zinc-300 font-sans mt-1">
          Biar tiket date kita bisa langsung dikonfirmasi & terkirim ke email kita!
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-950/85 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4"
      >
        {/* Name (Hansome changed to my love / editable) */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" />
              Nama Lengkap / Panggilan ({defaultNickname}) *
            </span>
            {errors.name && <span className="text-[11px] text-rose-400">{errors.name}</span>}
          </label>
          <input
            type="text"
            required
            placeholder={`Siapa nama kamu? (e.g. ${defaultNickname})`}
            value={value.name}
            onChange={(e) => {
              onChange({ ...value, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-sans transition-all"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Nomor WhatsApp *
            </span>
            {errors.whatsapp && <span className="text-[11px] text-rose-400">{errors.whatsapp}</span>}
          </label>
          <input
            type="tel"
            required
            placeholder="Contoh: 08123456789 atau +6281..."
            value={value.whatsapp}
            onChange={(e) => {
              onChange({ ...value, whatsapp: e.target.value });
              if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
            }}
            className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-sans transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              Alamat Email Kamu *
            </span>
            {errors.email && <span className="text-[11px] text-rose-400">{errors.email}</span>}
          </label>
          <input
            type="email"
            required
            placeholder="emailkamu@gmail.com"
            value={value.email}
            onChange={(e) => {
              onChange({ ...value, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            className="w-full px-4 py-3 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-sans transition-all"
          />
        </div>

        {/* Personal Sweet Note */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Pesan manis atau notes untuk date kita (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Ada yang mau kamu sampaikan sebelum kita berangkat? 💕"
            value={value.personalMessage}
            onChange={(e) =>
              onChange({ ...value, personalMessage: e.target.value })
            }
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-sans transition-all resize-none"
          />
        </div>

        {/* Deliver to creator email notice */}
        <div className="flex items-center gap-2 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-200">
          <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-medium">
            Jawaban date ini akan otomatis dikirimkan ke email pengundang ({config.creatorEmail || 'devinakaty@gmail.com'})! 📬
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-base shadow-xl shadow-rose-500/30 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lock In Our Date!</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-zinc-400 hover:text-white cursor-pointer font-sans"
          >
            &larr; Back to Food Selection
          </button>
        </div>
      </form>
    </div>
  );
};
