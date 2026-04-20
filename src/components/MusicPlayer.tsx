import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'NEON_DRIFT_X',
    artist: 'CYBER_UNIT_01',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber1/200/200'
  },
  {
    id: '2',
    title: 'SYNTH_VOID_01',
    artist: 'VOID_WALKER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber2/200/200'
  },
  {
    id: '3',
    title: 'CYBER_PULSE_B',
    artist: 'PULSE_ENGINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/cyber3/200/200'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage);
    };

    const handleEnded = () => skipForward();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-md p-6 glitch-border bg-black/60 backdrop-blur-md">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex items-center gap-6 mb-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-24 h-24 object-cover border border-cyan-400 relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-magenta-500"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-magenta-500"></div>
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-mono text-cyan-400 truncate glitch-text mb-1 uppercase tracking-wider">
            {currentTrack.title}
          </h3>
          <p className="text-sm font-mono text-magenta-500/80 truncate uppercase tracking-widest">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1 bg-cyan-900 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_8px_#00f3ff]" 
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 right-0 h-full w-2 bg-magenta-500 animate-pulse" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={skipBackward}
            className="p-2 text-cyan-400 hover:text-white hover:scale-110 transition-all border border-transparent hover:border-cyan-400/50"
          >
            <SkipBack size={24} />
          </button>

          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-cyan-950 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)]"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="p-2 text-cyan-400 hover:text-white hover:scale-110 transition-all border border-transparent hover:border-cyan-400/50"
          >
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-cyan-700 uppercase">
          <div className="flex items-center gap-1">
            <Volume2 size={12} />
            <span>OUTPUT_STABLE</span>
          </div>
          <div>BPM_SYNC: ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
