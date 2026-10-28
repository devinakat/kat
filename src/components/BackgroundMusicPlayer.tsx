import React, { useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Disc, ExternalLink } from 'lucide-react';

interface BackgroundMusicPlayerProps {
  youtubeUrl?: string;
  trackTitle?: string;
}

// Extract YouTube 11-char video ID from various URL formats
export function extractYouTubeId(url?: string): string {
  if (!url) return '9hIi-VPoYbs';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '9hIi-VPoYbs';
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  destroy: () => void;
  getPlayerState: () => number;
}

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  youtubeUrl = 'https://youtu.be/9hIi-VPoYbs?si=8QUM3IL375c1bAW2',
  trackTitle = 'Congratulations (Piano Version) - goated.',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef<YTPlayerInstance | null>(null);
  const containerIdRef = useRef(`yt-bgm-container-${Math.random().toString(36).substring(2, 9)}`);
  const videoId = extractYouTubeId(youtubeUrl);

  // Initialize YouTube API & Player
  useEffect(() => {
    let isMounted = true;

    const loadPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch {
            // Ignore
          }
        }

        playerRef.current = new window.YT.Player(containerIdRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              setPlayerReady(true);
              event.target.setVolume(volume);
              // Attempt unmuted play if user already clicked
              if (hasInteracted) {
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              if (event.data === 1) {
                // PLAYING
                setIsPlaying(true);
              } else if (event.data === 2) {
                // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) {
                // ENDED -> loop
                event.target.playVideo();
              }
            },
            onError: () => {
              // Graceful error fallback
            },
          },
        });
      } catch (e) {
        console.error('Error creating YouTube player:', e);
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      // Load YouTube IFrame API script
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) loadPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
      }
    };
  }, [videoId]);

  // Autoplay on first user interaction anywhere on the page
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      setHasInteracted(true);
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, [volume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Toggle play error:', err);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      // Ignore
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
      if (newVol > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      {/* Hidden container for YouTube IFrame */}
      <div className="fixed -bottom-96 -left-96 w-10 h-10 opacity-0 overflow-hidden pointer-events-none z-0">
        <div id={containerIdRef.current} />
      </div>

      {/* Floating Romantic Music Player Widget */}
      <div className="fixed bottom-4 left-3 z-40 select-none font-sans">
        <div
          className={`relative flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-zinc-950/85 backdrop-blur-md border border-rose-500/30 text-white shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-all duration-300 ${
            isPlaying ? 'ring-1 ring-rose-400/40 shadow-rose-950/50' : 'opacity-85 hover:opacity-100'
          }`}
        >
          {/* Animated Vinyl Record / Music Disc Icon */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isPlaying ? 'Music playing: click to expand options' : 'Click to play romantic background music'}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-zinc-700/80 flex items-center justify-center text-rose-300 hover:text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 overflow-hidden"
          >
            <Disc
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isPlaying ? 'animate-spin text-rose-400' : 'text-zinc-400'
              }`}
              style={{ animationDuration: '4s' }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Track Info & Quick Play Toggle */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-col cursor-pointer max-w-[140px] sm:max-w-[190px] pr-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1">
                <Music className="w-2.5 h-2.5 animate-pulse" />
                <span>Romantic BGM</span>
              </span>
              {isPlaying && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  LIVE
                </span>
              )}
            </div>
            <div className="truncate text-xs font-medium text-zinc-200">
              {trackTitle}
            </div>
          </div>

          {/* Quick Play/Pause Button */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause music' : 'Play Congratulations (Piano Version)'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 flex items-center justify-center cursor-pointer transition-all active:scale-90 shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Quick Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer transition-colors shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-rose-300" />
            )}
          </button>

          {/* Expanded Drawer: Volume Slider & YouTube Link */}
          {isExpanded && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 text-white shadow-2xl animate-fadeIn space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Now Playing</span>
                </span>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="text-xs text-zinc-200 bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/80">
                <p className="font-semibold text-rose-200 truncate">{trackTitle}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Mac Miller - Congratulations (Piano Cover by goated.)
                </p>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>Volume</span>
                  </span>
                  <span>{isMuted ? '0%' : `${volume}%`}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Close / Hide Controls button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full py-1 text-center text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Hide controls
              </button>
            </div>
          )}

          {/* Floating musical notes when playing */}
          {isPlaying && (
            <div className="absolute -top-5 left-3 flex gap-2 pointer-events-none text-xs text-rose-400">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>♪</span>
              <span className="animate-pulse" style={{ animationDelay: '300ms' }}>♫</span>
              <span className="animate-bounce" style={{ animationDelay: '600ms' }}>♩</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
