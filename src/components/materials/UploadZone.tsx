import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UploadZoneProps {
  onSuccess?: (materialId: string) => void;
  onCancel?: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onSuccess, onCancel }) => {
  const { uploadMaterial, addToast } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Check extension
    const validExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      addToast('Unsupported File', 'Please upload a PDF or presentation document.', 'warning');
      return;
    }

    setSelectedFileName(file.name);
    setUploadStatus('processing');

    try {
      const created = await uploadMaterial(
        { name: file.name, size: file.size },
        progress => {
          setProgressStep(progress.step);
          setProgressPercent(progress.percent);
        }
      );

      setUploadStatus('success');
      setTimeout(() => {
        if (onSuccess) onSuccess(created.id);
      }, 1000);
    } catch {
      setUploadStatus('error');
      addToast('Upload Failed', 'An error occurred while analyzing the document.', 'error');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {uploadStatus === 'idle' && (
        <div
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
            Drag & drop your study material or <span className="text-emerald-700 underline">browse</span>
          </h3>

          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Supports PDF, PPT, and Word documents. EcoStudy AI extracts key topics, exam derivations, and generates SmartPrint recommendations.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              PDF Recommended
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              OCR & Diagram Parsing
            </span>
          </div>
        </div>
      )}

      {uploadStatus === 'processing' && (
        <div className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B291E] text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Analyzing: {selectedFileName}
            </h4>
            <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {progressStep}
            </p>
          </div>

          {/* Stepped progress bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Extracting high-yield concepts</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Analysis Complete ✓</h4>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Important topics identified, SmartPrint pack calculated, and study questions generated.
          </p>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Processing Failed</h4>
          <p className="text-xs text-slate-500">Please try again with a valid PDF file.</p>
          <button
            onClick={() => setUploadStatus('idle')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
