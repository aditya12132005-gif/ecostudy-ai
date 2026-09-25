import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Printer,
  ChevronRight,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UploadZone } from '../components/materials/UploadZone';

export const MaterialsPage: React.FC = () => {
  const { materials, setSelectedMaterialId, navigate } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleOpenAnalysis = (id: string) => {
    setSelectedMaterialId(id);
    navigate(`/materials/${id}`);
  };

  const handleOpenSmartPrint = (id: string) => {
    setSelectedMaterialId(id);
    navigate('/smartprint');
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Your Study Library
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Turn your academic material into focused learning resources.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(prev => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B291E] hover:bg-[#071D15] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Upload Material
        </button>
      </div>

      {/* Upload Zone (collapsible or toggleable) */}
      {showUploadModal && (
        <UploadZone
          onSuccess={newId => {
            setShowUploadModal(false);
            handleOpenAnalysis(newId);
          }}
          onCancel={() => setShowUploadModal(false)}
        />
      )}

      {/* Material Grid */}
      {materials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your study library is empty.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Upload your first PDF and let AI turn it into focused study material.
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold"
          >
            Upload Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {materials.map(mat => {
            return (
              <div
                key={mat.id}
                className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Subject */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      {mat.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {mat.status}
                    </span>
                  </div>

                  {/* Title & Page count */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] group-hover:text-emerald-900 transition-colors">
                    {mat.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-700">{mat.originalPageCount} pages</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {mat.uploadDate}
                    </span>
                  </div>

                  {/* Summary preview */}
                  <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                    {mat.summary}
                  </p>

                  {/* 4 Feature stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 my-3 border-y border-slate-100 text-center">
                    <div className="bg-slate-50/70 p-2 rounded-xl">
                      <div className="text-sm font-bold text-slate-900">{mat.keyTopicsCount}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Key Topics</div>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-xl">
                      <div className="text-sm font-bold text-slate-900">{mat.importantConceptsCount}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Core Concepts</div>
                    </div>
                    <div className="bg-slate-50/70 p-2 rounded-xl">
                      <div className="text-sm font-bold text-slate-900">{mat.practiceQuestionsCount}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Questions</div>
                    </div>
                    <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
                      <div className="text-sm font-bold text-emerald-800">{mat.recommendedPageCount}</div>
                      <div className="text-[10px] text-emerald-700 font-medium">Print Pages</div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleOpenAnalysis(mat.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0B291E] text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    Open Analysis
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenSmartPrint(mat.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    SmartPrint
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
