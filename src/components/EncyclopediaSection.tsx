import React, { useState } from 'react';
import { SOLIDS_LIST } from '../data/solidsData';
import { SolidDefinition, SolidId } from '../types/geometry';
import { BookOpen, Layers, Check, Minus, Search, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EncyclopediaSectionProps {
  onSelectSolid: (id: SolidId) => void;
}

export const EncyclopediaSection: React.FC<EncyclopediaSectionProps> = ({ onSelectSolid }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('الكل');

  const filteredSolids = SOLIDS_LIST.filter((s) => {
    const matchesSearch =
      s.nameArabic.includes(searchQuery) ||
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.includes(searchQuery);

    const matchesCategory = categoryFilter === 'الكل' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['الكل', 'منشورات ومكعبات', 'أهرامات', 'مجسمات دورانية', 'متعددة الوجوه'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/30">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">
                موسوعة المجسمات الهندسية وقوانينها
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                دليل مرجعي شامل للمقارنة بين جميع المجسمات وقوانين المساحات والحجوم وعلاقة أويلر
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="ابحث عن مجسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategoryFilter(cat);
              sounds.playPop();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === cat
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-3.5 whitespace-nowrap">المجسم</th>
              <th className="p-3.5 whitespace-nowrap">الأوجه (F)</th>
              <th className="p-3.5 whitespace-nowrap">الأحرف (E)</th>
              <th className="p-3.5 whitespace-nowrap">الرؤوس (V)</th>
              <th className="p-3.5 whitespace-nowrap">علاقة أويلر</th>
              <th className="p-3.5 whitespace-nowrap">قانون الحجم</th>
              <th className="p-3.5 whitespace-nowrap">قانون المساحة الكلية</th>
              <th className="p-3.5 whitespace-nowrap">عرض تفاعلي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filteredSolids.map((solid) => {
              const sampleCalc = solid.calculateProperties(
                solid.dimensions.reduce((acc, d) => ({ ...acc, [d.id]: d.defaultValue }), {})
              );

              return (
                <tr key={solid.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: solid.color }} />
                      <span>{solid.nameArabic}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-amber-700">{solid.facesCount}</td>
                  <td className="p-3.5 font-bold text-indigo-700">{solid.edgesCount}</td>
                  <td className="p-3.5 font-bold text-purple-700">{solid.verticesCount}</td>
                  <td className="p-3.5">
                    {solid.eulerApplies ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check className="w-3 h-3" />
                        <span>F+V-E=2</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">مجسم دوراني</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {sampleCalc.volumeFormula}
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                    {sampleCalc.totalFormula}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        onSelectSolid(solid.id);
                        sounds.playPop();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 transition-all text-[11px]"
                    >
                      استكشف وطوِ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
