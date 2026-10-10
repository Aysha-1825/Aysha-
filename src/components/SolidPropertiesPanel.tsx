import React from 'react';
import { SolidDefinition } from '../types/geometry';
import { Sliders, Calculator, Sparkles, Check, Bookmark, Layers, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SolidPropertiesPanelProps {
  solid: SolidDefinition;
  dimensions: Record<string, number>;
  onDimensionChange: (dimId: string, value: number) => void;
  onResetDimensions: () => void;
}

export const SolidPropertiesPanel: React.FC<SolidPropertiesPanelProps> = ({
  solid,
  dimensions,
  onDimensionChange,
  onResetDimensions,
}) => {
  const calc = solid.calculateProperties(dimensions);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Dimension Sliders Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sliders className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-800">
              التحكم في قياسات أضلاع {solid.nameArabic}
            </h3>
          </div>
          <button
            onClick={() => {
              onResetDimensions();
              sounds.playPop();
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            إعادة تعيين القياسات الافتراضية
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {solid.dimensions.map((dim) => {
            const val = dimensions[dim.id] ?? dim.defaultValue;
            return (
              <div key={dim.id} className="flex flex-col gap-1.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span>{dim.name}</span>
                    <span className="text-xs text-slate-400 font-normal">({dim.symbol})</span>
                  </label>
                  <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                    {val} {dim.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={dim.min}
                  max={dim.max}
                  step={dim.step}
                  value={val}
                  onChange={(e) => {
                    onDimensionChange(dim.id, parseFloat(e.target.value));
                    sounds.playFoldStep();
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-1"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span>الأدنى: {dim.min} {dim.unit}</span>
                  <span>الأقصى: {dim.max} {dim.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Live Calculations & Math Formulas */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Calculator className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-black text-slate-800">
            الحسابات الرياضية اللحظية (المساحات والحجم)
          </h3>
        </div>

        {/* 3 Result Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {/* Lateral Area */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-xl border border-indigo-200/80">
            <span className="text-xs font-bold text-indigo-600">المساحة الجانبية</span>
            <div className="text-2xl font-black text-slate-800 my-1">
              {calc.lateralArea} <span className="text-xs font-normal text-slate-500">سم²</span>
            </div>
            <p className="text-[11px] text-indigo-800/80 font-mono font-medium truncate" title={calc.lateralFormula}>
              {calc.lateralFormula}
            </p>
          </div>

          {/* Total Surface Area */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 p-4 rounded-xl border border-sky-200/80">
            <span className="text-xs font-bold text-sky-600">المساحة الكلية</span>
            <div className="text-2xl font-black text-slate-800 my-1">
              {calc.totalArea} <span className="text-xs font-normal text-slate-500">سم²</span>
            </div>
            <p className="text-[11px] text-sky-800/80 font-mono font-medium truncate" title={calc.totalFormula}>
              {calc.totalFormula}
            </p>
          </div>

          {/* Volume */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-200/80">
            <span className="text-xs font-bold text-emerald-600">الحجم الكلي</span>
            <div className="text-2xl font-black text-slate-800 my-1">
              {calc.volume} <span className="text-xs font-normal text-slate-500">سم³</span>
            </div>
            <p className="text-[11px] text-emerald-800/80 font-mono font-medium truncate" title={calc.volumeFormula}>
              {calc.volumeFormula}
            </p>
          </div>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>خطوات التعويض والحل التفصيلي:</span>
          </h4>
          {calc.calculationSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 gap-1"
            >
              <span className="font-semibold text-slate-700">{step.label}:</span>
              <span className="font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                {step.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Faces, Edges, Vertices & Euler's Formula */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Layers className="w-5 h-5" />
          </span>
          <h3 className="text-lg font-black text-slate-800">
            العناصر الهندسية للمجسم (الأوجه والأحرف والرؤوس)
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-xs text-amber-700 font-bold">الأوجه (F)</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{solid.facesCount}</div>
            <span className="text-[11px] text-slate-500">أوجه مستوية</span>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
            <span className="text-xs text-indigo-700 font-bold">الأحرف (E)</span>
            <div className="text-2xl font-black text-indigo-900 mt-1">{solid.edgesCount}</div>
            <span className="text-[11px] text-slate-500">أضلاع متصلة</span>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
            <span className="text-xs text-purple-700 font-bold">الرؤوس (V)</span>
            <div className="text-2xl font-black text-purple-900 mt-1">{solid.verticesCount}</div>
            <span className="text-[11px] text-slate-500">نقاط التقاء</span>
          </div>
        </div>

        {/* Euler's Relation verification */}
        {solid.eulerApplies ? (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">تحقق علاقة أويلر للمجسمات (F + V - E = 2):</span>
              <p className="mt-1 font-mono text-[13px] font-extrabold text-emerald-800">
                {solid.facesCount} + {solid.verticesCount} - {solid.edgesCount} = 2 ✓
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                تؤكد هذه المعادلة أن المجسم محدب ومتعدد الوجوه مغلق في الفضاء الثلاثي الأبعاد.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-bold">ملاحظة هندسية:</span>
              <p className="mt-0.5">
                هذا المجسم دوراني منحنٍ (يحتوي أسطحاً منحنية ولا يتكون حصراً من مضلعات مستوية متعددة السطوح)، لذلك لا تنطبق عليه صيغة أويلر الكلاسيكية الخاصة بالمجسمات متعددة السطوح.
              </p>
            </div>
          </div>
        )}

        {/* Fun Fact */}
        <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-950 font-medium leading-relaxed">
            <strong className="text-indigo-800">هل تعلم؟ </strong>
            {solid.funFact}
          </p>
        </div>
      </div>
    </div>
  );
};
