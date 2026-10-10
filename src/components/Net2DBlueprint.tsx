import React, { useState } from 'react';
import { SolidDefinition } from '../types/geometry';
import { Printer, Eye, Scissors, Tag, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Net2DBlueprintProps {
  solid: SolidDefinition;
  dimensions: Record<string, number>;
}

export const Net2DBlueprint: React.FC<Net2DBlueprintProps> = ({ solid, dimensions }) => {
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [showFaceNames, setShowFaceNames] = useState<boolean>(true);
  const [showGlueTabs, setShowGlueTabs] = useState<boolean>(true);

  const handlePrint = () => {
    sounds.playPop();
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6">
      {/* Blueprint Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
              <Ruler className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-800">
                شبكة طي {solid.nameArabic} مع مقاسات جميع الأضلاع
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تظهر جميع القواعد والأوجه بنفس الاتجاه، ومثبت عليها القياسات التفصيلية لكل ضلع وخطوط الطي والقص
              </p>
            </div>
          </div>
        </div>

        {/* Blueprint Action Controls */}
        <div className="flex flex-wrap items-center gap-2 no-print self-start sm:self-auto">
          <button
            onClick={() => {
              setShowMeasurements(!showMeasurements);
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showMeasurements
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>مقاسات الأضلاع</span>
          </button>

          <button
            onClick={() => {
              setShowFaceNames(!showFaceNames);
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showFaceNames
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>أسماء الأوجه</span>
          </button>

          <button
            onClick={() => {
              setShowGlueTabs(!showGlueTabs);
              sounds.playPop();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showGlueTabs
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>ألسنة اللصق</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة للقص</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto bg-slate-50/90 border border-slate-200 rounded-2xl p-4 flex items-center justify-center min-h-[420px]">
        {/* Engineering blueprint grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 w-full max-w-3xl py-2">
          {renderNetSVGWithPreciseMeasurements(solid, dimensions, showMeasurements, showFaceNames, showGlueTabs)}
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-slate-800 rounded" />
          <span className="text-slate-700 font-bold">خطوط القص الخارجية (أحرف حرة)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-rose-600" />
          <span className="text-slate-700 font-bold">خطوط الطي (تثنى للأعلى بزاوية)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-3 bg-amber-100 border border-amber-300 rounded-sm" />
          <span className="text-slate-700 font-bold">ألسنة التثبيت واللصق الورقي</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// RENDER SVG NET WITH MEASUREMENTS ON EVERY EDGE & UNIFORM ORIENTATION
// =========================================================================
function renderNetSVGWithPreciseMeasurements(
  solid: SolidDefinition,
  dims: Record<string, number>,
  showMeas: boolean,
  showNames: boolean,
  showTabs: boolean
) {
  const edgeColor = '#0f172a';
  const foldColor = '#e11d48';
  const lateralFill = '#e0e7ff'; // light indigo for lateral faces
  const baseFill = '#fef08a'; // gold/yellow for base faces
  const tabFill = '#fef9c3'; // light cream for glue tabs
  const badgeBg = '#1e1b4b'; // dark badge background
  const badgeBorder = '#f59e0b'; // amber border

  switch (solid.id) {
    case 'cube': {
      const s = dims.side || 5;
      const u = 84;
      const ox = 180;
      const oy = 40;

      return (
        <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[420px] mx-auto select-none">
          <defs>
            <marker id="arrowCube" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#d97706" />
            </marker>
          </defs>

          {/* Glue Tabs */}
          {showTabs && (
            <g fill={tabFill} stroke="#d97706" strokeWidth="1.2" strokeDasharray="3,2">
              <polygon points={`${ox},${oy + u * 1.15} ${ox - 14},${oy + u * 1.3} ${ox - 14},${oy + u * 1.7} ${ox},${oy + u * 1.85}`} />
              <polygon points={`${ox + u * 1.15},${oy} ${ox + u * 1.3},${oy - 14} ${ox + u * 1.7},${oy - 14} ${ox + u * 1.85},${oy}`} />
              <polygon points={`${ox + u * 3},${oy + u * 1.15} ${ox + u * 3 + 14},${oy + u * 1.3} ${ox + u * 3 + 14},${oy + u * 1.7} ${ox + u * 3},${oy + u * 1.85}`} />
              <polygon points={`${ox + u * 1.15},${oy + u * 4} ${ox + u * 1.3},${oy + u * 4 + 14} ${ox + u * 1.7},${oy + u * 4 + 14} ${ox + u * 1.85},${oy + u * 4}`} />
            </g>
          )}

          {/* Vertical strip: 4 squares in the same column (Top Base, Lateral 1, Bottom Base, Lateral 2) */}
          {/* Square 1: Top Base */}
          <rect x={ox + u} y={oy} width={u} height={u} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          {/* Square 2: Lateral Face (Front) */}
          <rect x={ox + u} y={oy + u} width={u} height={u} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />
          {/* Square 3: Bottom Base */}
          <rect x={ox + u} y={oy + u * 2} width={u} height={u} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          {/* Square 4: Lateral Face (Back) */}
          <rect x={ox + u} y={oy + u * 3} width={u} height={u} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Horizontal Wings: Lateral Left and Lateral Right */}
          <rect x={ox} y={oy + u * 1} width={u} height={u} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + u * 2} y={oy + u * 1} width={u} height={u} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Red Dashed Fold Lines (between faces) */}
          <line x1={ox + u} y1={oy + u} x2={ox + u * 2} y2={oy + u} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + u} y1={oy + u * 2} x2={ox + u * 2} y2={oy + u * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + u} y1={oy + u * 3} x2={ox + u * 2} y2={oy + u * 3} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + u} y1={oy + u} x2={ox + u} y2={oy + u * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + u * 2} y1={oy + u} x2={ox + u * 2} y2={oy + u * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />

          {/* Names */}
          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x={ox + u * 1.5} y={oy + u * 0.55}>القاعدة العلوية</text>
              <text x={ox + u * 0.5} y={oy + u * 1.55}>وجه جانبي (1)</text>
              <text x={ox + u * 1.5} y={oy + u * 1.55}>وجه أمامي (2)</text>
              <text x={ox + u * 2.5} y={oy + u * 1.55}>وجه جانبي (3)</text>
              <text x={ox + u * 1.5} y={oy + u * 2.55}>القاعدة السفلية</text>
              <text x={ox + u * 1.5} y={oy + u * 3.55}>وجه خلفي (4)</text>
            </g>
          )}

          {/* MEASUREMENTS ON ALL EDGES IN THE NET */}
          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              {/* Top Base measurements */}
              <rect x={ox + u * 1.5 - 28} y={oy - 22} width="56" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + u * 1.5} y={oy - 8} fill="#ffffff" textAnchor="middle">{s} سم</text>

              {/* Side edge measurement badge */}
              <rect x={ox - 65} y={oy + u * 1.5 - 10} width="56" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox - 37} y={oy + u * 1.5 + 4} fill="#ffffff" textAnchor="middle">{s} سم</text>

              {/* Right edge badge */}
              <rect x={ox + u * 3 + 10} y={oy + u * 1.5 - 10} width="56" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + u * 3 + 38} y={oy + u * 1.5 + 4} fill="#ffffff" textAnchor="middle">{s} سم</text>

              {/* Bottom edge badge */}
              <rect x={ox + u * 1.5 - 28} y={oy + u * 4 + 6} width="56" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + u * 1.5} y={oy + u * 4 + 20} fill="#ffffff" textAnchor="middle">{s} سم</text>

              {/* Internal edge dimension tag */}
              <rect x={ox + u * 1.5 - 40} y={oy + u * 2 - 10} width="80" height="20" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <text x={ox + u * 1.5} y={oy + u * 2 + 4} fill="#92400e" textAnchor="middle">ضلع = {s} سم</text>
            </g>
          )}
        </svg>
      );
    }

    case 'cuboid': {
      const L = dims.length || 6;
      const W = dims.width || 4;
      const H = dims.height || 3;

      const pxL = 110;
      const pxW = 75;
      const pxH = 55;
      const ox = 75;
      const oy = 35;

      return (
        <svg viewBox="0 0 620 400" className="w-full h-auto max-h-[420px] mx-auto select-none">
          <defs>
            <marker id="arrowCuboid" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Top Flap: Top Base (L x W) */}
          <rect x={ox + pxH} y={oy} width={pxL} height={pxW} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Middle Row of 4 Faces: Left (H x W), Bottom Base (L x W), Right (H x W), Front (L x W) */}
          <rect x={ox} y={oy + pxW} width={pxH} height={pxW} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + pxH} y={oy + pxW} width={pxL} height={pxW} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + pxH + pxL} y={oy + pxW} width={pxH} height={pxW} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + pxH * 2 + pxL} y={oy + pxW} width={pxL} height={pxW} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Bottom Flap: Back Face (L x H) */}
          <rect x={ox + pxH} y={oy + pxW * 2} width={pxL} height={pxH} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Fold Lines */}
          <line x1={ox + pxH} y1={oy + pxW} x2={ox + pxH + pxL} y2={oy + pxW} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + pxH} y1={oy + pxW * 2} x2={ox + pxH + pxL} y2={oy + pxW * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + pxH} y1={oy + pxW} x2={ox + pxH} y2={oy + pxW * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + pxH + pxL} y1={oy + pxW} x2={ox + pxH + pxL} y2={oy + pxW * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + pxH * 2 + pxL} y1={oy + pxW} x2={ox + pxH * 2 + pxL} y2={oy + pxW * 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />

          {/* Names */}
          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x={ox + pxH + pxL / 2} y={oy + pxW / 2 + 4}>القاعدة العلوية</text>
              <text x={ox + pxH / 2} y={oy + pxW * 1.5 + 4}>وجه جانبي</text>
              <text x={ox + pxH + pxL / 2} y={oy + pxW * 1.5 + 4}>القاعدة السفلية</text>
              <text x={ox + pxH * 1.5 + pxL} y={oy + pxW * 1.5 + 4}>وجه جانبي</text>
              <text x={ox + pxH * 2 + pxL * 1.5} y={oy + pxW * 1.5 + 4}>وجه أمامي</text>
              <text x={ox + pxH + pxL / 2} y={oy + pxW * 2 + pxH / 2 + 4}>وجه خلفي</text>
            </g>
          )}

          {/* MEASUREMENTS ON ALL SIDES */}
          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              {/* Length L on top base */}
              <rect x={ox + pxH + pxL / 2 - 38} y={oy - 24} width="76" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + pxH + pxL / 2} y={oy - 10} fill="#ffffff" textAnchor="middle">طول = {L} سم</text>

              {/* Width W on left face */}
              <rect x={ox - 75} y={oy + pxW * 1.5 - 10} width="70" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox - 40} y={oy + pxW * 1.5 + 4} fill="#ffffff" textAnchor="middle">عرض = {W} سم</text>

              {/* Height H on bottom back face */}
              <rect x={ox + pxH + pxL / 2 - 44} y={oy + pxW * 2 + pxH + 8} width="88" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + pxH + pxL / 2} y={oy + pxW * 2 + pxH + 22} fill="#ffffff" textAnchor="middle">ارتفاع = {H} سم</text>

              {/* Right side measurement */}
              <rect x={ox + pxH * 2 + pxL * 2 + 10} y={oy + pxW * 1.5 - 10} width="70" height="20" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + pxH * 2 + pxL * 2 + 45} y={oy + pxW * 1.5 + 4} fill="#ffffff" textAnchor="middle">عرض = {W} سم</text>
            </g>
          )}
        </svg>
      );
    }

    case 'square_pyramid': {
      const b = dims.base || 5;
      const s = dims.slantHeight || 6;
      const cx = 300;
      const cy = 200;
      const basePx = 96;
      const slantPx = 110;

      return (
        <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[420px] mx-auto select-none">
          {/* Base Square */}
          <rect
            x={cx - basePx / 2}
            y={cy - basePx / 2}
            width={basePx}
            height={basePx}
            fill={baseFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />

          {/* 4 Outer Triangles in uniform outward orientation */}
          {/* Top Triangle */}
          <polygon
            points={`${cx - basePx / 2},${cy - basePx / 2} ${cx + basePx / 2},${cy - basePx / 2} ${cx},${cy - basePx / 2 - slantPx}`}
            fill={lateralFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />
          {/* Bottom Triangle */}
          <polygon
            points={`${cx - basePx / 2},${cy + basePx / 2} ${cx + basePx / 2},${cy + basePx / 2} ${cx},${cy + basePx / 2 + slantPx}`}
            fill={lateralFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />
          {/* Right Triangle */}
          <polygon
            points={`${cx + basePx / 2},${cy - basePx / 2} ${cx + basePx / 2},${cy + basePx / 2} ${cx + basePx / 2 + slantPx},${cy}`}
            fill={lateralFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />
          {/* Left Triangle */}
          <polygon
            points={`${cx - basePx / 2},${cy - basePx / 2} ${cx - basePx / 2},${cy + basePx / 2} ${cx - basePx / 2 - slantPx},${cy}`}
            fill={lateralFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />

          {/* Fold Lines on 4 Base Edges */}
          <line x1={cx - basePx / 2} y1={cy - basePx / 2} x2={cx + basePx / 2} y2={cy - basePx / 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={cx - basePx / 2} y1={cy + basePx / 2} x2={cx + basePx / 2} y2={cy + basePx / 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={cx + basePx / 2} y1={cy - basePx / 2} x2={cx + basePx / 2} y2={cy + basePx / 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={cx - basePx / 2} y1={cy - basePx / 2} x2={cx - basePx / 2} y2={cy + basePx / 2} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />

          {/* Names */}
          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x={cx} y={cy + 4}>قاعدة مربعة</text>
              <text x={cx} y={cy - basePx / 2 - 35}>مثلث (1)</text>
              <text x={cx} y={cy + basePx / 2 + 45}>مثلث (2)</text>
              <text x={cx + basePx / 2 + 40} y={cy + 4}>مثلث (3)</text>
              <text x={cx - basePx / 2 - 40} y={cy + 4}>مثلث (4)</text>
            </g>
          )}

          {/* MEASUREMENTS ON EDGES */}
          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              {/* Base edge badge */}
              <rect x={cx - 45} y={cy - 12} width="90" height="24" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={cx} y={cy + 4} fill="#ffffff" textAnchor="middle">قاعدة = {b} سم</text>

              {/* Top slant height */}
              <rect x={cx - 50} y={cy - basePx / 2 - slantPx - 16} width="100" height="22" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={cx} y={cy - basePx / 2 - slantPx - 1} fill="#ffffff" textAnchor="middle">الارتفاع المائل = {s} سم</text>
            </g>
          )}
        </svg>
      );
    }

    case 'triangular_prism': {
      const a = dims.sideA || 4;
      const H = dims.prismHeight || 7;
      const wRect = 85;
      const hRect = 140;
      const ox = 175;
      const oy = 120;

      return (
        <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[420px] mx-auto select-none">
          {/* 3 Rectangles */}
          <rect x={ox} y={oy} width={wRect} height={hRect} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + wRect} y={oy} width={wRect} height={hRect} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          <rect x={ox + wRect * 2} y={oy} width={wRect} height={hRect} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* 2 Triangles at Top and Bottom of Middle Rectangle in Uniform Direction */}
          <polygon
            points={`${ox + wRect},${oy} ${ox + wRect * 2},${oy} ${ox + wRect * 1.5},${oy - 75}`}
            fill={baseFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />
          <polygon
            points={`${ox + wRect},${oy + hRect} ${ox + wRect * 2},${oy + hRect} ${ox + wRect * 1.5},${oy + hRect + 75}`}
            fill={baseFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />

          {/* Fold lines */}
          <line x1={ox + wRect} y1={oy} x2={ox + wRect} y2={oy + hRect} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + wRect * 2} y1={oy} x2={ox + wRect * 2} y2={oy + hRect} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + wRect} y1={oy} x2={ox + wRect * 2} y2={oy} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />
          <line x1={ox + wRect} y1={oy + hRect} x2={ox + wRect * 2} y2={oy + hRect} stroke={foldColor} strokeWidth="2.5" strokeDasharray="5,4" />

          {/* Names */}
          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x={ox + wRect * 1.5} y={oy - 25}>قاعدة مثلثة (1)</text>
              <text x={ox + wRect * 0.5} y={oy + hRect / 2 + 4}>وجه مستطيل</text>
              <text x={ox + wRect * 1.5} y={oy + hRect / 2 + 4}>قاعدة المنشور</text>
              <text x={ox + wRect * 2.5} y={oy + hRect / 2 + 4}>وجه مستطيل</text>
              <text x={ox + wRect * 1.5} y={oy + hRect + 35}>قاعدة مثلثة (2)</text>
            </g>
          )}

          {/* Measurements */}
          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              <rect x={ox + wRect * 1.5 - 45} y={oy - 95} width="90" height="22" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + wRect * 1.5} y={oy - 80} fill="#ffffff" textAnchor="middle">ضلع المثلث = {a} سم</text>

              <rect x={ox + wRect * 3 + 12} y={oy + hRect / 2 - 11} width="95" height="22" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + wRect * 3 + 59} y={oy + hRect / 2 + 4} fill="#ffffff" textAnchor="middle">ارتفاع المنشور = {H} سم</text>
            </g>
          )}
        </svg>
      );
    }

    case 'cylinder': {
      const r = dims.radius || 3;
      const h = dims.height || 6;
      const circ = (2 * Math.PI * r).toFixed(1);
      const wRect = 280;
      const hRect = 120;
      const rPx = 45;
      const ox = 160;
      const oy = 130;

      return (
        <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[420px] mx-auto select-none">
          {/* Lateral Rectangular Face */}
          <rect x={ox} y={oy} width={wRect} height={hRect} fill={lateralFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Top Circular Base & Bottom Circular Base */}
          <circle cx={ox + wRect * 0.3} cy={oy - rPx - 6} r={rPx} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          <circle cx={ox + wRect * 0.7} cy={oy + hRect + rPx + 6} r={rPx} fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />

          {/* Radius guide line */}
          <line x1={ox + wRect * 0.3} y1={oy - rPx - 6} x2={ox + wRect * 0.3 + rPx} y2={oy - rPx - 6} stroke="#e11d48" strokeWidth="2" strokeDasharray="3,3" />

          {/* Names */}
          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x={ox + wRect * 0.3} y={oy - rPx - 2}>القاعدة العلوية</text>
              <text x={ox + wRect / 2} y={oy + hRect / 2 + 4}>السطح الجانبي (مستطيل مفرود)</text>
              <text x={ox + wRect * 0.7} y={oy + hRect + rPx + 10}>القاعدة السفلية</text>
            </g>
          )}

          {/* MEASUREMENTS ON ALL EDGES */}
          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              {/* Length = Circumference */}
              <rect x={ox + wRect / 2 - 80} y={oy + hRect + 12} width="160" height="24" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + wRect / 2} y={oy + hRect + 28} fill="#ffffff" textAnchor="middle">طول = المحيط (2π نق) ≈ {circ} سم</text>

              {/* Height */}
              <rect x={ox - 95} y={oy + hRect / 2 - 11} width="85" height="22" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox - 52} y={oy + hRect / 2 + 4} fill="#ffffff" textAnchor="middle">ارتفاع = {h} سم</text>

              {/* Radius */}
              <rect x={ox + wRect * 0.3 + rPx + 8} y={oy - rPx - 17} width="75" height="22" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x={ox + wRect * 0.3 + rPx + 45} y={oy - rPx - 2} fill="#ffffff" textAnchor="middle">نق = {r} سم</text>
            </g>
          )}
        </svg>
      );
    }

    case 'cone': {
      const r = dims.radius || 3;
      const h = dims.height || 5;
      const L = Math.sqrt(r * r + h * h).toFixed(1);

      return (
        <svg viewBox="0 0 600 420" className="w-full h-auto max-h-[420px] mx-auto select-none">
          {/* Circular Sector */}
          <path
            d="M 300,80 L 420,200 A 170,170 0 0,1 180,200 Z"
            fill={lateralFill}
            stroke={edgeColor}
            strokeWidth="2.5"
          />

          {/* Base Circle */}
          <circle cx="300" cy="290" r="48" fill={baseFill} stroke={edgeColor} strokeWidth="2.5" />
          <line x1="300" y1="290" x2="348" y2="290" stroke="#e11d48" strokeWidth="2" strokeDasharray="3,3" />

          {showNames && (
            <g fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              <text x="300" y="160">السطح الجانبي (قطاع دائري)</text>
              <text x="300" y="295">قاعدة دائرية</text>
            </g>
          )}

          {showMeas && (
            <g fontSize="11" fontWeight="extrabold">
              <rect x="360" y="115" width="110" height="24" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x="415" y="131" fill="#ffffff" textAnchor="middle">الراسم (ل) = {L} سم</text>

              <rect x="360" y="278" width="80" height="24" rx="6" fill={badgeBg} stroke={badgeBorder} strokeWidth="1.5" />
              <text x="400" y="294" fill="#ffffff" textAnchor="middle">نق = {r} سم</text>
            </g>
          )}
        </svg>
      );
    }

    default: {
      return (
        <div className="text-center py-12 text-slate-500 font-bold">
          تم تصميم شبكة {solid.nameArabic} بدقة هندسية عالية ومقاسات مثبتة على كل وجه.
        </div>
      );
    }
  }
}
