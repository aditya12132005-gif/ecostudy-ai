import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FocusPage: React.FC = () => {
  const { activeFocusTopic, completeFocusSession, navigate } = useApp();

  const totalSeconds = (activeFocusTopic.durationMinutes || 45) * 60;
  // Initialize timer with 32 min 45 sec left (13 min completed) as demo default, or active time
  const [secondsRemaining, setSecondsRemaining] = useState<number>(32 * 60 + 45);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'cheatSheet'>('summary');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
      setShowCompletionModal(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const elapsedSeconds = totalSeconds - secondsRemaining;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    setIsActive(false);
    setShowCompletionModal(true);
  };

  const handleRatingSubmit = () => {
    if (!selectedRating) return;
    completeFocusSession(selectedRating);
  };

  // Progress percentage
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Bar with Distraction-Free Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Exit to Dashboard
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Deep Work Session
        </span>
      </div>

      {/* Main Focus Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6 relative overflow-hidden">
        {/* Topic Banner */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {activeFocusTopic.subject} • High Priority
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {activeFocusTopic.topic}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Progress: <strong className="text-slate-800">{elapsedMinutes} / {activeFocusTopic.durationMinutes} min</strong> completed
          </p>
        </div>

        {/* Large Prominent Timer Display */}
        <div className="relative py-4">
          <div className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 font-mono tracking-tight select-none">
            {formatTime(secondsRemaining)}
          </div>

          {/* Progress bar */}
          <div className="max-w-md mx-auto w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-6">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsActive(prev => !prev)}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-[#0B291E] hover:bg-[#071D15] text-white'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isActive ? 'Pause Timer' : 'Resume Timer'}
          </button>

          <button
            onClick={() => setSecondsRemaining(totalSeconds)}
            className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleFinishEarly}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Session
          </button>
        </div>
      </div>

      {/* Quick In-Session Reference Shortcuts */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'summary' ? 'bg-[#0B291E] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Quick Summary
          </button>
          <button
            onClick={() => setActiveTab('cheatSheet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cheatSheet' ? 'bg-[#0B291E] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Key Formulas & Invariants
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'notes' ? 'bg-[#0B291E] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Study Notes
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'summary' && (
          <div className="text-xs text-slate-700 space-y-2.5 leading-relaxed">
            <p>
              <strong>Trees & Traversals:</strong> Inorder (L-Root-R) on BST produces strictly ascending elements. Preorder (Root-L-R) is ideal for serializing/cloning trees. Postorder (L-R-Root) is utilized for bottom-up deletions and space calculations.
            </p>
            <p>
              <strong>Level Order Traversal:</strong> Implemented iteratively via a FIFO Queue. Enqueue root, dequeue front, visit, and enqueue valid left and right children. Time Complexity: O(n), Space Complexity: O(w) where w is max width.
            </p>
          </div>
        )}

        {activeTab === 'cheatSheet' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              Balance Factor: BF(N) = Height(L) - Height(R)
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              Valid AVL Condition: BF ∈ {'{-1, 0, +1}'}
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              BST Max Depth Worst-Case: O(n) skewed
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              Max nodes at level L = 2^L
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <textarea
            placeholder="Type quick scratch notes during your study session..."
            rows={4}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        )}
      </div>

      {/* Session Completion Modal (How well did you understand this?) */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Session Completed! 🎉
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You logged {elapsedMinutes} minutes of focused study on <strong>{activeFocusTopic.topic}</strong>.
              </p>
            </div>

            {/* Understanding Reflection Rating */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                How well did you understand this?
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'difficult', label: 'Difficult', icon: '😕' },
                  { id: 'okay', label: 'Okay', icon: '😐' },
                  { id: 'good', label: 'Good', icon: '🙂' },
                  { id: 'mastered', label: 'Mastered', icon: '🔥' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRating(r.id)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      selectedRating === r.id
                        ? 'border-emerald-600 bg-emerald-50/70 scale-105 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl">{r.icon}</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRatingSubmit}
                disabled={!selectedRating}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B291E] hover:bg-[#071D15] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Proceed to Adaptive Quiz
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                EcoStudy tests active recall immediately after study sessions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
