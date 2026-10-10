import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RIDDLES_DATA, IMPOSSIBLE_NET_PUZZLES, MATCH_NET_CHALLENGES } from '../data/gamesData';
import { RiddleQuestion, NetDetectiveQuestion, MatchNetQuestion, SolidId } from '../types/geometry';
import { sounds } from '../utils/audio';
import {
  Gamepad2,
  HelpCircle,
  Search,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Zap,
  Award,
} from 'lucide-react';

export const GamesSection: React.FC = () => {
  const [activeGameTab, setActiveGameTab] = useState<'riddles' | 'detective' | 'match'>('riddles');

  // Shared Game Stats
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // 1. Riddles State
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [revealedClues, setRevealedClues] = useState<number>(0);
  const [selectedRiddleOption, setSelectedRiddleOption] = useState<SolidId | null>(null);
  const [isRiddleAnswered, setIsRiddleAnswered] = useState<boolean>(false);
  const [isRiddleCorrect, setIsRiddleCorrect] = useState<boolean>(false);

  // 2. Impossible Net Detective State
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [selectedNetId, setSelectedNetId] = useState<string | null>(null);
  const [isDetectiveAnswered, setIsDetectiveAnswered] = useState<boolean>(false);
  const [isDetectiveCorrect, setIsDetectiveCorrect] = useState<boolean>(false);

  // 3. Match Net State
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [selectedMatchOption, setSelectedMatchOption] = useState<number | null>(null);
  const [isMatchAnswered, setIsMatchAnswered] = useState<boolean>(false);
  const [isMatchCorrect, setIsMatchCorrect] = useState<boolean>(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

  // Riddle Handlers
  const currentRiddle = RIDDLES_DATA[currentRiddleIndex];

  const handleSelectRiddleAnswer = (id: SolidId) => {
    if (isRiddleAnswered) return;
    setSelectedRiddleOption(id);
    setIsRiddleAnswered(true);

    if (id === currentRiddle.correctId) {
      setIsRiddleCorrect(true);
      setScore((s) => s + 50 + (3 - revealedClues) * 10);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      fireConfetti();
    } else {
      setIsRiddleCorrect(false);
      setStreak(0);
      sounds.playWrong();
    }
  };

  const handleNextRiddle = () => {
    sounds.playPop();
    if (currentRiddleIndex < RIDDLES_DATA.length - 1) {
      setCurrentRiddleIndex((prev) => prev + 1);
      setSelectedRiddleOption(null);
      setIsRiddleAnswered(false);
      setRevealedClues(0);
    } else {
      // Completed all riddles!
      sounds.playFanfare();
      fireConfetti();
      setCurrentRiddleIndex(0);
      setSelectedRiddleOption(null);
      setIsRiddleAnswered(false);
      setRevealedClues(0);
    }
  };

  // Detective Handlers
  const currentPuzzle = IMPOSSIBLE_NET_PUZZLES[currentPuzzleIndex];

  const handleSelectDetectiveNet = (net: { id: string; isValid: boolean }) => {
    if (isDetectiveAnswered) return;
    setSelectedNetId(net.id);
    setIsDetectiveAnswered(true);

    // Goal: Find the INVALID net!
    if (!net.isValid) {
      setIsDetectiveCorrect(true);
      setScore((s) => s + 60);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      fireConfetti();
    } else {
      setIsDetectiveCorrect(false);
      setStreak(0);
      sounds.playWrong();
    }
  };

  const handleNextDetective = () => {
    sounds.playPop();
    if (currentPuzzleIndex < IMPOSSIBLE_NET_PUZZLES.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setSelectedNetId(null);
      setIsDetectiveAnswered(false);
    } else {
      sounds.playFanfare();
      fireConfetti();
      setCurrentPuzzleIndex(0);
      setSelectedNetId(null);
      setIsDetectiveAnswered(false);
    }
  };

  // Match Handlers
  const currentMatch = MATCH_NET_CHALLENGES[currentMatchIndex];

  const handleSelectMatchOption = (index: number) => {
    if (isMatchAnswered) return;
    setSelectedMatchOption(index);
    setIsMatchAnswered(true);

    if (index === currentMatch.correctIndex) {
      setIsMatchCorrect(true);
      setScore((s) => s + 40);
      setStreak((st) => st + 1);
      sounds.playCorrect();
      fireConfetti();
    } else {
      setIsMatchCorrect(false);
      setStreak(0);
      sounds.playWrong();
    }
  };

  const handleNextMatch = () => {
    sounds.playPop();
    if (currentMatchIndex < MATCH_NET_CHALLENGES.length - 1) {
      setCurrentMatchIndex((prev) => prev + 1);
      setSelectedMatchOption(null);
      setIsMatchAnswered(false);
    } else {
      sounds.playFanfare();
      fireConfetti();
      setCurrentMatchIndex(0);
      setSelectedMatchOption(null);
      setIsMatchAnswered(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
      {/* Top Banner & Gamification Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
              <Gamepad2 className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                ألعاب وألغاز هندسية تفاعلية
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تحديات مشوقة في مطابقة الشبكات وحل ألغاز المجسمات واكتشاف الشبكات الخادعة
              </p>
            </div>
          </div>
        </div>

        {/* Score & Streak Badges */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/80 px-4 py-2 rounded-xl border border-amber-200">
            <Trophy className="w-5 h-5 text-amber-600" />
            <div>
              <span className="text-[10px] text-amber-700 font-bold block">مجموع النقاط</span>
              <span className="text-lg font-black text-amber-900 leading-none">{score}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/80 px-4 py-2 rounded-xl border border-emerald-200">
            <Zap className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="text-[10px] text-emerald-700 font-bold block">سلسلة الإجابات</span>
              <span className="text-lg font-black text-emerald-900 leading-none">{streak} 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
        <button
          onClick={() => {
            setActiveGameTab('riddles');
            sounds.playPop();
          }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeGameTab === 'riddles'
              ? 'bg-white text-indigo-700 shadow-md shadow-slate-200 border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <span>لغز من أكون؟ ({RIDDLES_DATA.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveGameTab('detective');
            sounds.playPop();
          }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeGameTab === 'detective'
              ? 'bg-white text-rose-700 shadow-md shadow-slate-200 border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-4 h-4 text-rose-500" />
          <span>المحقق: الشبكة الخادعة ({IMPOSSIBLE_NET_PUZZLES.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveGameTab('match');
            sounds.playPop();
          }}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeGameTab === 'match'
              ? 'bg-white text-emerald-700 shadow-md shadow-slate-200 border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>تحدي مطابقة الشبكة ({MATCH_NET_CHALLENGES.length})</span>
        </button>
      </div>

      {/* ============================================================
          GAME 1: RIDDLES (لغز من أكون؟)
         ============================================================ */}
      {activeGameTab === 'riddles' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>اللغز {currentRiddleIndex + 1} من {RIDDLES_DATA.length}</span>
            <span className="text-indigo-600 font-bold">{currentRiddle.title}</span>
          </div>

          {/* Riddle Card with Mystery Box Styling */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-indigo-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold w-fit border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>لغز المجسم المجهول</span>
              </div>

              <p className="text-base sm:text-lg font-bold leading-relaxed text-indigo-50">
                {currentRiddle.riddle}
              </p>

              {/* Progressive Clues System */}
              <div className="pt-2 border-t border-indigo-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-semibold">تلميحات مساعدة:</span>
                  {revealedClues < currentRiddle.clues.length && !isRiddleAnswered && (
                    <button
                      onClick={() => {
                        setRevealedClues((c) => c + 1);
                        sounds.playPop();
                      }}
                      className="text-xs flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 transition-all"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>كشف تلميح ({revealedClues + 1}/{currentRiddle.clues.length})</span>
                    </button>
                  )}
                </div>

                {currentRiddle.clues.slice(0, revealedClues).map((clue, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-indigo-900/60 p-2.5 rounded-lg border border-indigo-700/60 text-xs text-indigo-100 animate-fadeIn"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{clue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Riddle Options Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRiddle.options.map((opt) => {
              const isSelected = selectedRiddleOption === opt.id;
              const isCorrect = opt.id === currentRiddle.correctId;

              let btnStyle = 'bg-slate-50 hover:bg-indigo-50/60 text-slate-800 border-slate-200 hover:border-indigo-300';
              if (isRiddleAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-400 font-black';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 text-rose-800 border-rose-400 font-bold';
                } else {
                  btnStyle = 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isRiddleAnswered}
                  onClick={() => handleSelectRiddleAnswer(opt.id)}
                  className={`p-4 rounded-xl text-right text-sm font-bold border transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt.name}</span>
                  {isRiddleAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isRiddleAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isRiddleAnswered && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
                isRiddleCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {isRiddleCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {isRiddleCorrect ? 'إجابة صحيحة وذكية! 🎉' : 'حاول مرة أخرى في اللغز القادم!'}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{currentRiddle.funExplanation}</p>
                </div>
              </div>

              <button
                onClick={handleNextRiddle}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow transition-all flex items-center justify-center gap-2"
              >
                <span>اللغز التالي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          GAME 2: IMPOSSIBLE NET DETECTIVE (المحقق الذكي)
         ============================================================ */}
      {activeGameTab === 'detective' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>التحدي {currentPuzzleIndex + 1} من {IMPOSSIBLE_NET_PUZZLES.length}</span>
            <span className="text-rose-600 font-bold">{currentPuzzle.title}</span>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 text-rose-900 text-xs sm:text-sm leading-relaxed">
            <span className="font-black block text-rose-950 mb-1">مهمة المحقق الرياضي:</span>
            {currentPuzzle.instruction}
          </div>

          {/* Detective Net Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentPuzzle.nets.map((net, idx) => {
              const isSelected = selectedNetId === net.id;
              const isTargetInvalid = !net.isValid; // This is the correct answer to find!

              let cardStyle = 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300';
              if (isDetectiveAnswered) {
                if (isTargetInvalid) {
                  // This is the fake net we were hunting!
                  cardStyle = 'bg-rose-50 border-rose-400 ring-2 ring-rose-400';
                } else {
                  cardStyle = 'bg-slate-100 opacity-60 border-slate-200';
                }
              }

              return (
                <div
                  key={net.id}
                  onClick={() => handleSelectDetectiveNet(net)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${cardStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      النموذج ({String.fromCharCode(65 + idx)})
                    </span>
                    {isDetectiveAnswered && isTargetInvalid && (
                      <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full">
                        الشبكة الخاطئة المستحيلة!
                      </span>
                    )}
                  </div>

                  {/* Net Visual Schematic Representation */}
                  <div className="w-full h-32 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 relative overflow-hidden">
                    <div className="flex flex-col items-center gap-1">
                      {net.layout.map((row, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1">
                          {row.map((cell, cIdx) => (
                            <div
                              key={cIdx}
                              className={`w-7 h-7 rounded border transition-all ${
                                cell === 0
                                  ? 'opacity-0'
                                  : isDetectiveAnswered && isTargetInvalid
                                  ? 'bg-rose-200 border-rose-400'
                                  : 'bg-indigo-100 border-indigo-400'
                              }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reason explanation after click */}
                  {isDetectiveAnswered && (
                    <p className={`text-[11px] font-medium leading-normal ${net.isValid ? 'text-slate-600' : 'text-rose-800 font-bold'}`}>
                      {net.reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isDetectiveAnswered && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
                isDetectiveCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDetectiveCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {isDetectiveCorrect ? 'كشف مذهل! اكتشفت الشبكة المستحيلة بنجاح 🕵️‍♂️' : 'لاحظ تداخل الأوجه وحاول مجدداً!'}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{currentPuzzle.explanation}</p>
                </div>
              </div>

              <button
                onClick={handleNextDetective}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow transition-all flex items-center justify-center gap-2"
              >
                <span>اللغز التالي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          GAME 3: MATCH SOLID TO NET (تحدي مطابقة الشبكات)
         ============================================================ */}
      {activeGameTab === 'match' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>التحدي {currentMatchIndex + 1} من {MATCH_NET_CHALLENGES.length}</span>
            <span className="text-emerald-600 font-bold">مطابقة شبكة {currentMatch.solidName}</span>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 text-emerald-900 text-xs sm:text-sm">
            <span className="font-bold">السؤال:</span> أي من الأوصاف والشبكات التالية تطابق بدقة شبكة مجسم (
            <span className="font-black text-emerald-950 underline">{currentMatch.solidName}</span>) عند بسط وفرد جميع أوجهه؟
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentMatch.options.map((opt, idx) => {
              const isSelected = selectedMatchOption === idx;
              const isCorrect = idx === currentMatch.correctIndex;

              let cardStyle = 'bg-slate-50 hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-300';
              if (isMatchAnswered) {
                if (isCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 font-black text-emerald-900';
                } else if (isSelected && !isCorrect) {
                  cardStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                } else {
                  cardStyle = 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isMatchAnswered}
                  onClick={() => handleSelectMatchOption(idx)}
                  className={`p-4 rounded-2xl text-right text-xs sm:text-sm font-bold border transition-all flex flex-col justify-between gap-3 min-h-[110px] ${cardStyle}`}
                >
                  <span className="leading-relaxed">{opt.label}</span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 pt-2 w-full">
                    <span>خيار ({idx + 1})</span>
                    {isMatchAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isMatchAnswered && (
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn ${
                isMatchCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {isMatchCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-black text-sm">
                    {isMatchCorrect ? 'إجابة هندسية صحيحة 100%! 🌟' : 'إجابة غير دقيقة!'}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">{currentMatch.explanation}</p>
                </div>
              </div>

              <button
                onClick={handleNextMatch}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow transition-all flex items-center justify-center gap-2"
              >
                <span>التحدي التالي</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
