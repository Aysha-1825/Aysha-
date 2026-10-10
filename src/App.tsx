/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SolidId } from './types/geometry';
import { SOLIDS_DATA, SOLIDS_LIST } from './data/solidsData';
import { sounds } from './utils/audio';
import { Header } from './components/Header';
import { SolidsCatalog } from './components/SolidsCatalog';
import { Solid3DViewer } from './components/Solid3DViewer';
import { Net2DBlueprint } from './components/Net2DBlueprint';
import { SolidPropertiesPanel } from './components/SolidPropertiesPanel';
import { GamesSection } from './components/GamesSection';
import { QuizSection } from './components/QuizSection';
import { EncyclopediaSection } from './components/EncyclopediaSection';
import { Footer } from './components/Footer';
import {
  Sparkles,
  Layers,
  Box,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Compass,
  ArrowDown,
  Ruler,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [selectedSolidId, setSelectedSolidId] = useState<SolidId>('cube');
  const [activeSection, setActiveSection] = useState<'explorer' | 'games' | 'quiz' | 'encyclopedia'>('explorer');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Maintain custom dimensions per solid
  const [customDimensions, setCustomDimensions] = useState<Record<string, Record<string, number>>>(() => {
    const initial: Record<string, Record<string, number>> = {};
    SOLIDS_LIST.forEach((s) => {
      initial[s.id] = {};
      s.dimensions.forEach((d) => {
        initial[s.id][d.id] = d.defaultValue;
      });
    });
    return initial;
  });

  const selectedSolid = SOLIDS_DATA[selectedSolidId];
  const currentDimensions = customDimensions[selectedSolidId] || {};

  const handleDimensionChange = (dimId: string, value: number) => {
    setCustomDimensions((prev) => ({
      ...prev,
      [selectedSolidId]: {
        ...(prev[selectedSolidId] || {}),
        [dimId]: value,
      },
    }));
  };

  const handleResetDimensions = () => {
    setCustomDimensions((prev) => {
      const resetForSolid: Record<string, number> = {};
      selectedSolid.dimensions.forEach((d) => {
        resetForSolid[d.id] = d.defaultValue;
      });
      return {
        ...prev,
        [selectedSolidId]: resetForSolid,
      };
    });
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
    if (nextState) sounds.playPop();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white font-cairo">
      {/* Top Navigation Bar */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-950/80 relative overflow-hidden no-print">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Teacher Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black mb-4 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>إعداد وتصميم وتنفيذ:</span>
            <span className="text-white underline decoration-amber-400 underline-offset-4 font-black">
              أ. عائشة ناصر السنيدية
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            عالم المجسمات الهندسية ورسم شبكاتها وطيّها
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-8 font-medium">
            منصة تفاعلية رائدة تتيح للطلاب والمعلمين استكشاف المجسمات الهندسية ثلاثية الأبعاد، ومحاكاة فرد وطي شبكاتها بسلاسة مع ظهور قياسات دقيقة لكل ضلع، وحساب المساحات الكلية والجانبية والحجوم لحظياً، إضافة لألعاب وألغاز ومسابقات شائقة.
          </p>

          {/* Quick Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>محاكاة طي وبسط 3D</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <Ruler className="w-4 h-4 text-sky-400" />
              <span>قياسات أطوال الأضلاع</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>ألعاب وألغاز المحقق</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>اختبارات وشهادات تقدير</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 flex-1 flex flex-col gap-10">
        {/* SECTION 1: 3D EXPLORER & NET FOLDING */}
        {activeSection === 'explorer' && (
          <div className="flex flex-col gap-8">
            {/* Catalog Grid to Choose Solid */}
            <SolidsCatalog
              selectedSolidId={selectedSolidId}
              onSelectSolid={(id) => {
                setSelectedSolidId(id);
              }}
            />

            {/* Split View: 3D Interactive Folding vs Live Properties */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left/Main Column: 3D Folding Canvas & 2D Blueprint */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                {/* 3D Folding & Unfolding Viewer */}
                <Solid3DViewer solid={selectedSolid} dimensions={currentDimensions} />

                {/* 2D Net Blueprint with exact edge measurements */}
                <Net2DBlueprint solid={selectedSolid} dimensions={currentDimensions} />
              </div>

              {/* Right Column: Dimension Controls & Math Calculations */}
              <div className="lg:col-span-5">
                <SolidPropertiesPanel
                  solid={selectedSolid}
                  dimensions={currentDimensions}
                  onDimensionChange={handleDimensionChange}
                  onResetDimensions={handleResetDimensions}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: INTERACTIVE GAMES & PUZZLES */}
        {activeSection === 'games' && (
          <div>
            <GamesSection />
          </div>
        )}

        {/* SECTION 3: COMPREHENSIVE QUIZ & CERTIFICATE */}
        {activeSection === 'quiz' && (
          <div>
            <QuizSection />
          </div>
        )}

        {/* SECTION 4: ENCYCLOPEDIA & FORMULAS REFERENCE */}
        {activeSection === 'encyclopedia' && (
          <div>
            <EncyclopediaSection
              onSelectSolid={(id) => {
                setSelectedSolidId(id);
                setActiveSection('explorer');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer with Teacher Aisha Nasser Al-Sunaidiya attribution */}
      <Footer />
    </div>
  );
}
