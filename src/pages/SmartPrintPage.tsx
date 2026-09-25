import React, { useState } from 'react';
import {
  Printer,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  RotateCcw,
  Download,
  Eye,
  Check,
  X,
  Droplet,
  CloudRain,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartPrintPage: React.FC = () => {
  const {
    selectedMaterial,
    materials,
    setSelectedMaterialId,
    selectedPrintPages,
    togglePrintPage,
    selectAllRecommendedPrintPages,
    generatePrintPack,
    isPrintModalOpen,
    setIsPrintModalOpen,
    totalSemesterPagesAvoided,
    navigate,
    addToast,
  } = useApp();

  const mat = selectedMaterial || materials[0];
  const originalPages = mat.originalPageCount;
  const currentSelectedCount = selectedPrintPages.length;
  const currentAvoided = Math.max(0, originalPages - currentSelectedCount);

  // Environmental impact calculations (standard ecological paper metrics: 1 page ~ 5g paper, 10L water per 100 pages, 10g CO2 per page)
  const co2AvoidedGrams = currentAvoided * 10.5;
  const waterAvoidedLiters = Math.round((currentAvoided * 0.1) * 10) / 10;
  const paperAvoidedGrams = currentAvoided * 4.8;

  // Selected page preview modal
  const [inspectPage, setInspectPage] = useState<number | null>(null);

  const inspectedItem = mat.pagesDetail.find(p => p.pageNumber === inspectPage);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Leaf className="w-4 h-4" /> Academic Sustainability Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            SmartPrint
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Print only what you actually need. Keep the rest digital.
          </p>
        </div>

        {/* Material Switcher if multiple materials */}
        {materials.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Document:</span>
            <select
              value={mat.id}
              onChange={e => setSelectedMaterialId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.originalPageCount}p)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Prominent Visual Comparison Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* 1. ORIGINAL */}
          <div className="pt-2 md:pt-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Original Document
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-700 mt-2 font-['Plus_Jakarta_Sans',sans-serif]">
              {originalPages} <span className="text-lg font-normal text-slate-400">pages</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Full textbook chapter & slides</p>
          </div>

          {/* 2. AI RECOMMENDED */}
          <div className="pt-4 md:pt-0 md:px-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommended
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 font-['Plus_Jakarta_Sans',sans-serif]">
              {currentSelectedCount} <span className="text-lg font-normal text-emerald-600">pages</span>
            </div>
            <p className="text-xs text-emerald-700/80 mt-1 font-medium">Selected for physical recall</p>
          </div>

          {/* 3. PAPER AVOIDED (HERO NUMBER) */}
          <div className="pt-4 md:pt-0 md:pl-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Paper Avoided
            </span>
            <div className="text-5xl sm:text-6xl font-black text-emerald-700 mt-1 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight glow-emerald">
              {currentAvoided}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700/90">
              Pages Saved
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Why these pages? + Sustainability Impact Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Why these 11 pages? (2 spans) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0B291E] via-[#0E3527] to-[#124433] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-emerald-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                Why these {mat.recommendedPageCount} pages?
              </h3>
            </div>
            <span className="text-xs text-emerald-300 font-medium">87.3% paper reduction</span>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            EcoStudy’s heuristic model parses non-essential slides (covers, filler agendas, redundant boilerplate source code, unworked references) and extracts only what warrants tactile physical study:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Important Diagrams:</strong> AVL rotations & tree hierarchies</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Key Formulas:</strong> Node limits, height bounds & balance</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Exam-Relevant Concepts:</strong> 3-case BST deletion proof</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Revision Friendly:</strong> High-yield memory triggers</span>
            </div>
          </div>
        </div>

        {/* Right: Sustainability Impact Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Eco-Impact
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Leaf className="w-4 h-4" />
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {totalSemesterPagesAvoided}
              </span>
              <span className="text-xs font-semibold text-slate-500">pages avoided this semester</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Paper savings are estimates based on pages avoided vs standard printing.
            </p>

            {/* Environmental metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-left">
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-emerald-600" />
                  {waterAvoidedLiters} L
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Water conserved</div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100">
                <div className="text-xs text-teal-800 font-bold flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-teal-600" />
                  {Math.round(co2AvoidedGrams)} g
                </div>
                <div className="text-[10px] text-teal-600 font-medium">CO2 reduction</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Tree impact quotient</span>
            <span className="font-bold text-emerald-700">🌱 ~0.08 Tree preserved</span>
          </div>
        </div>
      </div>

      {/* Page Thumbnail Grid (Interactive Selection) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Interactive Page Selection Grid
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any page card to toggle print inclusion. Green highlighted pages are AI recommended.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllRecommendedPrintPages}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to AI Recommendation
            </button>
          </div>
        </div>

        {/* Thumbnail Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {mat.pagesDetail.map(item => {
            const isSelected = selectedPrintPages.includes(item.pageNumber);
            const isAIRecommended = item.isRecommended;

            return (
              <div
                key={item.pageNumber}
                onClick={() => togglePrintPage(item.pageNumber)}
                className={`relative group rounded-2xl p-3 border-2 transition-all cursor-pointer select-none flex flex-col justify-between h-44 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Page Number & Type Badge */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">
                      p. {item.pageNumber}
                    </span>

                    {/* Checkbox indicator */}
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.contentType === 'Diagram'
                        ? 'bg-blue-50 text-blue-700'
                        : item.contentType === 'Formula'
                        ? 'bg-purple-50 text-purple-700'
                        : item.contentType === 'Concept'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.contentType}
                  </span>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-1.5 leading-snug">
                    {item.title}
                  </h4>
                </div>

                {/* Bottom preview trigger & rating */}
                <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">Score: {item.examRelevanceScore}/10</span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setInspectPage(item.pageNumber);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-white"
                    title="Preview page summary"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 font-medium">Selected configuration:</span>
            <div className="text-base sm:text-lg font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              {currentSelectedCount} pages selected{' '}
              <span className="text-emerald-400">• {currentAvoided} pages avoided</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                addToast('Digital Only', 'Decided to keep module 100% digital. No paper consumed!', 'info');
                navigate('/');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              Keep Digital
            </button>

            <button
              onClick={generatePrintPack}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Generate Print Pack
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Page Modal */}
      {inspectPage !== null && inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">
                  Page {inspectedItem.pageNumber} • {inspectedItem.contentType}
                </span>
                <h3 className="text-base font-bold text-slate-900">{inspectedItem.title}</h3>
              </div>
              <button
                onClick={() => setInspectPage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
              {inspectedItem.snippet}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Exam Relevance: <strong>{inspectedItem.examRelevanceScore} / 10</strong></span>
              <span>Recommendation: <strong>{inspectedItem.isRecommended ? 'Print Pack' : 'Keep Digital'}</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInspectPage(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Print Pack Success Modal / View */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Printer className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Print Pack Ready
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                {currentSelectedCount} Pages Selected
              </h3>
              <div className="text-sm font-bold text-emerald-700 mt-1">
                🌱 {currentAvoided} pages avoided from paper waste!
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Your optimized high-yield print pack for <strong>{mat.title}</strong> has been assembled with diagrams, balance factor theorems, and key cheat sheets.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Pages:</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedPrintPages.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Print Cost:</span>
                <span className="font-bold text-slate-800">₹{(currentSelectedCount * 1.5).toFixed(2)} (vs ₹{(originalPages * 1.5).toFixed(2)})</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Total Savings:</span>
                <span>87% paper & ink</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setIsPrintModalOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Download / Print Optimized Pack
              </button>

              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all"
              >
                Back to SmartPrint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
