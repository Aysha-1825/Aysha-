import React from 'react';
import { Volume2, VolumeX, Sparkles, Box, Compass, Gamepad2, GraduationCap, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeSection: 'explorer' | 'games' | 'quiz' | 'encyclopedia';
  onNavigate: (section: 'explorer' | 'games' | 'quiz' | 'encyclopedia') => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Teacher Credit */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Box className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  عالم المجسمات وشبكاتها
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  <span>تفاعلي 3D</span>
                </span>
              </div>
              <p className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 mt-0.5">
                <span>تنفيذ:</span>
                <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                  أ. عائشة ناصر السنيدية
                </span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                onNavigate('explorer');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSection === 'explorer'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>استكشاف وطي المجسمات</span>
            </button>

            <button
              onClick={() => {
                onNavigate('games');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSection === 'games'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-500" />
              <span>الألعاب والألغاز</span>
            </button>

            <button
              onClick={() => {
                onNavigate('quiz');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSection === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>الاختبار والشهادة</span>
            </button>

            <button
              onClick={() => {
                onNavigate('encyclopedia');
                sounds.playPop();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSection === 'encyclopedia'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>الموسوعة والقوانين</span>
            </button>
          </nav>

          {/* Sound Mute/Unmute */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 gap-1 overflow-x-auto text-[11px] font-bold">
          <button
            onClick={() => onNavigate('explorer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeSection === 'explorer' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            المجسمات
          </button>
          <button
            onClick={() => onNavigate('games')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeSection === 'games' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            الألعاب والألغاز
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeSection === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            الاختبار
          </button>
          <button
            onClick={() => onNavigate('encyclopedia')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${activeSection === 'encyclopedia' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            الموسوعة
          </button>
        </div>
      </div>
    </header>
  );
};
