import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Cpu, Radio, Terminal } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 lg:p-8 space-y-8 lg:space-y-12">
      {/* Background Decor */}
      <div className="crt-overlay" />
      <div className="scanline" />
      
      {/* HUD Header */}
      <header className="w-full max-w-6xl flex justify-between items-end border-b border-cyan-900 pb-2 z-10 animate-in fade-in slide-in-from-top duration-700">
        <div className="flex items-center gap-4">
          <Cpu className="text-magenta-500 animate-pulse" size={32} />
          <div>
            <h1 className="text-2xl md:text-4xl font-mono text-cyan-400 glitch-text tracking-tighter uppercase">
              GLITCH_CORE // ANALOG.v1
            </h1>
            <p className="text-[10px] font-mono text-cyan-700 uppercase tracking-[0.3em]">
              SYSTEM READY // ENCRYPTION: ACTIVE // BUFFER_SIZE: 1024kb
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[10px] text-magenta-500/60 uppercase">
          <div className="flex items-center gap-2">
            <span>SIGNAL_STRENGTH</span>
            <div className="flex gap-0.5 h-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 bg-cyan-400 ${i > 3 ? 'opacity-20' : 'opacity-100'}`} />
              ))}
            </div>
          </div>
          <div>LOC: ASIA_NORTH_GRID_09</div>
        </div>
      </header>

      {/* Main Content Grid */}
      <section className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block animate-in fade-in slide-in-from-left duration-1000">
          <div className="p-4 bg-black/40 border border-cyan-900/50 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-cyan-900/30 pb-2">
              <Terminal size={14} /> LOG_STREAM
            </h2>
            <div className="space-y-1 text-[10px] font-mono text-cyan-700 h-40 overflow-hidden leading-tight">
              <p>{'>'} INITIALIZING KERNEL...</p>
              <p>{'>'} LOADING NEURAL_SHELL...</p>
              <p className="text-magenta-500/50">{'>'} [WARN] MEMORY_LEAK DETECTED</p>
              <p>{'>'} PATCHING SECTOR 0xFF...</p>
              <p>{'>'} SYNCING AUDIO_BUFFER...</p>
              <p>{'>'} SNAKE_CORE: OPERATIONAL</p>
              <p className="text-white/20 italic mt-2 animate-pulse">_WAITING FOR INPUT</p>
            </div>
          </div>

          <div className="p-4 bg-black/40 border border-cyan-900/50 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-cyan-900/30 pb-2">
              <Activity size={14} /> SYSTEM_VITALS
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-cyan-700">
                  <span>CPU_LOAD</span>
                  <span>42%</span>
                </div>
                <div className="h-1 bg-cyan-950 w-full overflow-hidden">
                  <div className="h-full bg-magenta-500 w-[42%] animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] text-cyan-700">
                  <span>NET_LATENCY</span>
                  <span>12ms</span>
                </div>
                <div className="h-1 bg-cyan-950 w-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[12%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Snake Game */}
        <div className="lg:col-span-6 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-full mb-2 flex justify-between items-center px-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              LIVE_FEED_01
            </div>
            <div className="text-[10px] font-mono text-magenta-500 animate-pulse">
              [REC]
            </div>
          </div>
          <SnakeGame />
        </div>

        {/* Right Sidebar: Music Player */}
        <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right duration-1000">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
               <Radio size={16} /> AUDIO_INTERLINK
             </div>
             <MusicPlayer />
          </div>

          {/* Social / Credits Placeholder */}
          <div className="p-4 border border-magenta-900/30 bg-magenta-950/10 text-center animate-pulse">
            <p className="text-[9px] font-mono text-magenta-500 uppercase tracking-[0.2em] mb-1">PROTOTYPE_BUILD_20.04</p>
            <p className="text-[8px] font-mono text-magenta-700">ENJOY_THE_VOICE_IN_THE_MACHINE</p>
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <footer className="w-full max-w-6xl flex justify-center gap-12 border-t border-cyan-900 pt-4 z-10 opacity-30 hover:opacity-100 transition-opacity">
        {['HOME', 'DATA_BANK', 'NETWORK', 'SETTINGS'].map((item) => (
          <button key={item} className="text-[10px] font-mono text-cyan-400 hover:text-magenta-500 transition-colors uppercase tracking-widest cursor-pointer">
            [{item}]
          </button>
        ))}
      </footer>

      {/* Decorative Glitch Artifacts */}
      <div className="fixed top-20 right-10 w-2 h-40 bg-cyan-400/5 blur-xl pointer-events-none" />
      <div className="fixed bottom-40 left-10 w-1 h-32 bg-magenta-500/5 blur-xl pointer-events-none" />
    </main>
  );
}

