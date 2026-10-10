import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { COMPREHENSIVE_QUIZ_BANK } from '../data/gamesData';
import { QuizQuestion } from '../types/geometry';
import { sounds } from '../utils/audio';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Printer,
  Sparkles,
  BookOpen,
  Calendar,
  UserCheck,
} from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ questionId: number; selected: number; isCorrect: boolean }[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const currentQ = COMPREHENSIVE_QUIZ_BANK[currentQuestionIndex];
  const totalQuestions = COMPREHENSIVE_QUIZ_BANK.length;

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selected: index,
        isCorrect: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizCompleted(true);
      sounds.playFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestartQuiz = () => {
    sounds.playPop();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsQuizCompleted(false);
    setShowCertificate(false);
  };

  const scoreCount = userAnswers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((scoreCount / totalQuestions) * 100);

  const handlePrintCertificate = () => {
    sounds.playPop();
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                اختبار المجسمات وشبكاتها وقياساتها
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                اختبار تفاعلي لقياس استيعاب خواص المجسمات، حسابات المساحة والحجم، ونماذج فرد وطي الشبكات
              </p>
            </div>
          </div>
        </div>

        {!isQuizCompleted && (
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center self-start sm:self-auto">
            <span className="text-[10px] text-indigo-600 font-bold block">التقدم في الاختبار</span>
            <span className="text-sm font-black text-indigo-900">
              السؤال {currentQuestionIndex + 1} من {totalQuestions}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!isQuizCompleted && (
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      )}

      {/* ACTIVE QUIZ VIEW */}
      {!isQuizCompleted ? (
        <div className="flex flex-col gap-6">
          {/* Question Text */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700">
                مستوى: {currentQ.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                السؤال رقم #{currentQ.id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnClass = 'bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 text-emerald-900 font-black';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                } else {
                  btnClass = 'opacity-40 bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl text-right text-sm font-bold border transition-all flex items-center justify-between ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black text-slate-600 border border-slate-200">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box & Next Button */}
          {isAnswered && (
            <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-indigo-900">التوضيح الرياضي للحل:</h4>
                  <p className="text-xs text-indigo-800 mt-0.5 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>{currentQuestionIndex < totalQuestions - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ RESULT & CERTIFICATE VIEW */
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 mb-4 animate-bounce">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">
              {percentage >= 80 ? 'مبارك! أداء هندسي متميز جداً 🌟' : 'أحسنت! تجربة ممتازة في هندسة المجسمات'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              لقد أجبت بشكل صحيح على {scoreCount} من أصل {totalQuestions} أسئلة ({percentage}%)
            </p>
          </div>

          {/* Student Name Input for Certificate */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full max-w-lg flex flex-col gap-3 no-print">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>اكتب اسمك الثلاثي لإصدار شهادة التفوق المعتمدة:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="مثال: محمد بن سالم المعمري"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  if (studentName.trim()) {
                    setShowCertificate(true);
                    sounds.playFanfare();
                    confetti({ particleCount: 100, spread: 70 });
                  }
                }}
                disabled={!studentName.trim()}
                className="px-5 py-2.5 bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow hover:bg-indigo-700 transition-all"
              >
                إصدار الشهادة
              </button>
            </div>
          </div>

          {/* THE OFFICIAL CERTIFICATE */}
          {showCertificate && (
            <div className="w-full max-w-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 p-8 rounded-3xl border-4 border-amber-300 shadow-2xl relative overflow-hidden flex flex-col items-center text-center gap-6 my-4 print-only">
              {/* Decorative Corner Borders */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-500 pointer-events-none" />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-500 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-500 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-500 pointer-events-none" />

              {/* Certificate Header */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-extrabold text-amber-700 tracking-wider mb-1">
                  سلطنة عُمان • وزارة التربية والتعليم
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                  شهادة تميز وتفوق في هندسة المجسمات وشبكاتها
                </h2>
                <div className="w-24 h-1 bg-amber-500 rounded-full mt-2" />
              </div>

              {/* Awarded To */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-500 font-semibold">تُمنح هذه الشهادة بكل فخر واعتزاز إلى الطالب/ـة المتميز/ة:</p>
                <div className="text-xl sm:text-2xl font-black text-indigo-900 border-b-2 border-dotted border-indigo-400 pb-1 px-8">
                  {studentName || 'طالب متميز'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mt-2">
                  تقديراً لاجتيازه بنجاح وتفوق اختبار <strong>عالم المجسمات وشبكاتها الهندسية</strong> وحساب المساحات الكلية والجانبية والحجوم بنسبة إتقان بلغت ({percentage}%).
                </p>
              </div>

              {/* Signatures & Execution Credit Line */}
              <div className="w-full flex items-end justify-between pt-6 border-t border-amber-200 mt-2 text-xs">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-slate-400 font-medium">تاريخ الإنجاز:</span>
                  <span className="font-bold text-slate-700">{new Date().toLocaleDateString('ar-OM')}</span>
                </div>

                {/* Explicit Credit to Teacher Aisha Nasser Al-Sunaidiya */}
                <div className="flex flex-col items-center bg-amber-100/70 border border-amber-300 px-5 py-2.5 rounded-2xl shadow-sm">
                  <span className="text-[11px] font-bold text-amber-900">إشراف وتنفيذ المعلمة:</span>
                  <span className="text-sm font-black text-indigo-950 mt-0.5">
                    أ. عائشة ناصر السنيدية
                  </span>
                  <span className="text-[10px] text-amber-800 font-semibold">معلمة الرياضيات</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-slate-400 font-medium">الختم الرقمي:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    معتمد ✓
                  </span>
                </div>
              </div>

              {/* Print Certificate Button */}
              <button
                onClick={handlePrintCertificate}
                className="no-print mt-2 flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة شهادة التميز</span>
              </button>
            </div>
          )}

          {/* Restart Quiz Button */}
          <button
            onClick={handleRestartQuiz}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all no-print"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة الاختبار من البداية</span>
          </button>
        </div>
      )}
    </div>
  );
};
