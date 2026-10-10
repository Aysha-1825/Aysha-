import React from 'react';
import { SolidDefinition, SolidId } from '../types/geometry';
import { SOLIDS_LIST } from '../data/solidsData';
import { Box, Pyramid, Cylinder as CylIcon, Hexagon, Compass, Layers } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SolidsCatalogProps {
  selectedSolidId: SolidId;
  onSelectSolid: (id: SolidId) => void;
}

export const SolidsCatalog: React.FC<SolidsCatalogProps> = ({ selectedSolidId, onSelectSolid }) => {
  const getIcon = (id: SolidId) => {
    switch (id) {
      case 'cube':
      case 'cuboid':
        return <Box className="w-5 h-5" />;
      case 'square_pyramid':
      case 'tetrahedron':
        return <Pyramid className="w-5 h-5" />;
      case 'cylinder':
      case 'cone':
        return <CylIcon className="w-5 h-5" />;
      case 'triangular_prism':
      case 'hexagonal_prism':
        return <Hexagon className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-800">
              مكتبة المجسمات الهندسية وشبكاتها
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            اختر أي مجسم ثلاثي الأبعاد لاستكشافه وطيّ شبكته ورؤية قياسات أضلاعه وحساباته الرياضية
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
          {SOLIDS_LIST.length} مجسمات مكتملة
        </span>
      </div>

      {/* Grid of Solids */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SOLIDS_LIST.map((solid) => {
          const isSelected = solid.id === selectedSolidId;
          return (
            <button
              key={solid.id}
              onClick={() => {
                onSelectSolid(solid.id);
                sounds.playPop();
              }}
              className={`group relative p-4 rounded-xl text-right transition-all flex flex-col justify-between border ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-indigo-600 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Category pill */}
              <div className="flex items-center justify-between mb-3 w-full">
                <span
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                  }`}
                >
                  {getIcon(solid.id)}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {solid.category}
                </span>
              </div>

              <div>
                <h3 className={`font-black text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {solid.nameArabic}
                </h3>
                <p className={`text-[11px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {solid.nameEnglish}
                </p>
              </div>

              <div
                className={`mt-3 pt-2 text-[11px] font-semibold flex items-center justify-between border-t ${
                  isSelected ? 'border-indigo-400/50 text-indigo-100' : 'border-slate-200 text-slate-500'
                }`}
              >
                <span>{solid.facesCount} أوجه</span>
                <span>{solid.edgesCount} أحرف</span>
                <span>{solid.verticesCount} رؤوس</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
