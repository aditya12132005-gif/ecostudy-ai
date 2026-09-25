import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Calculator,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calculateCurrentAttendance,
  projectIfMissClasses,
  projectIfAttendClasses,
  classesNeededForTarget,
  classesCanAffordToMiss,
  getAttendanceInsight,
} from '../services/attendance/attendanceService';
import { Subject } from '../types';

export const AttendancePage: React.FC = () => {
  const { subjects, updateSubjectAttendance, addSubjectToPlan, navigate } = useApp();

  // Selected subject for dynamic calculator (defaults to lowest subject, e.g. Electronics)
  const defaultSelected = subjects.find(s => s.status === 'attention' || s.status === 'urgent') || subjects[1];
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(defaultSelected.id);

  // Calculator hypothetical sliders / steps
  const [hypotheticalMissCount, setHypotheticalMissCount] = useState<number>(1);
  const [hypotheticalAttendCount, setHypotheticalAttendCount] = useState<number>(4);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Dynamic calculations via attendanceService
  const currentPct = calculateCurrentAttendance(activeSubject.classesAttended, activeSubject.totalClasses);
  const projectedAfterMiss = projectIfMissClasses(activeSubject.classesAttended, activeSubject.totalClasses, hypotheticalMissCount);
  const projectedAfterAttend = projectIfAttendClasses(activeSubject.classesAttended, activeSubject.totalClasses, hypotheticalAttendCount);
  const neededForTarget = classesNeededForTarget(activeSubject.classesAttended, activeSubject.totalClasses, 75);
  const canAffordToMiss = classesCanAffordToMiss(activeSubject.classesAttended, activeSubject.totalClasses, 75);
  const insight = getAttendanceInsight(activeSubject, 75);

  const isBelowTarget = currentPct < 75;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4" /> Predictive Hall-Ticket Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Attendance Intelligence
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Know where you stand before it’s too late. Protect your exam eligibility with dynamic projection.
        </p>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(sub => {
          const isSelected = sub.id === selectedSubjectId;
          const isWarning = sub.attendancePercentage < 75;

          return (
            <div
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative bg-white shadow-xs ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                  : isWarning
                  ? 'border-amber-300 hover:border-amber-400'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{sub.code}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isWarning
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isWarning ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                  {isWarning ? 'Attention Required' : 'Eligible'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 truncate">{sub.name}</h3>

              {/* Attendance Big Number */}
              <div className="mt-3 flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {sub.attendancePercentage}%
                </div>
                <div className="text-xs text-slate-500 font-medium">Req: 75%</div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden my-2.5">
                <div
                  className={`h-full rounded-full transition-all ${
                    isWarning ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, sub.attendancePercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>{sub.classesAttended} attended</span>
                <span>{sub.totalClasses} total</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Focus: Dynamic Attendance Calculator & Connected Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Calculator (2 spans) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Interactive Attendance Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Simulating for: <strong>{activeSubject.name}</strong> ({currentPct}%)
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 w-fit">
              Formula: (Attended + x) / (Total + x)
            </span>
          </div>

          {/* Two scenario simulations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scenario 1: What if I miss classes? */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  What if I miss classes?
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHypotheticalMissCount(Math.max(1, hypotheticalMissCount - 1))}
                    className="w-6 h-6 rounded-md bg-white border border-rose-200 text-rose-700 flex items-center justify-center text-xs hover:bg-rose-100 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-rose-900 w-5 text-center">
                    {hypotheticalMissCount}
                  </span>
                  <button
                    onClick={() => setHypotheticalMissCount(hypotheticalMissCount + 1)}
                    className="w-6 h-6 rounded-md bg-white border border-rose-200 text-rose-700 flex items-center justify-center text-xs hover:bg-rose-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-xs text-rose-600 font-medium">Current</div>
                  <div className="text-lg font-bold text-slate-700">{currentPct}%</div>
                </div>
                <div className="text-slate-400 font-bold">→</div>
                <div className="text-right">
                  <div className="text-xs text-rose-600 font-medium">After missing {hypotheticalMissCount}</div>
                  <div className="text-2xl font-black text-rose-700 font-['Plus_Jakarta_Sans',sans-serif]">
                    {projectedAfterMiss}%
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-rose-700/80 leading-snug">
                Missing {hypotheticalMissCount} more will drop your attendance by {(Math.round((currentPct - projectedAfterMiss) * 10) / 10)}%.
              </p>
            </div>

            {/* Scenario 2: What if I attend consecutive classes? */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  What if I attend classes?
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHypotheticalAttendCount(Math.max(1, hypotheticalAttendCount - 1))}
                    className="w-6 h-6 rounded-md bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs hover:bg-emerald-100 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-emerald-900 w-5 text-center">
                    {hypotheticalAttendCount}
                  </span>
                  <button
                    onClick={() => setHypotheticalAttendCount(hypotheticalAttendCount + 1)}
                    className="w-6 h-6 rounded-md bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs hover:bg-emerald-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-xs text-emerald-600 font-medium">Current</div>
                  <div className="text-lg font-bold text-slate-700">{currentPct}%</div>
                </div>
                <div className="text-slate-400 font-bold">→</div>
                <div className="text-right">
                  <div className="text-xs text-emerald-600 font-medium">After attending {hypotheticalAttendCount}</div>
                  <div className="text-2xl font-black text-emerald-700 font-['Plus_Jakarta_Sans',sans-serif]">
                    {projectedAfterAttend}%
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700/80 leading-snug">
                Attending {hypotheticalAttendCount} consecutive classes boosts score to {projectedAfterAttend}%.
              </p>
            </div>
          </div>

          {/* Quick Real-time Edit for Demo Interactivity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 font-medium">
              Want to adjust actual class count for {activeSubject.name}?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateSubjectAttendance(activeSubject.id, Math.max(0, activeSubject.classesAttended - 1), activeSubject.totalClasses)}
                className="px-2.5 py-1 bg-white border rounded-lg hover:bg-slate-100 font-semibold"
              >
                Mark 1 Missed
              </button>
              <button
                onClick={() => updateSubjectAttendance(activeSubject.id, activeSubject.classesAttended + 1, activeSubject.totalClasses + 1)}
                className="px-2.5 py-1 bg-white border rounded-lg hover:bg-slate-100 font-semibold text-emerald-700"
              >
                Mark 1 Attended
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Attendance Insight & Connection to Study Plan */}
        <div className="space-y-6">
          {/* AI Attendance Insight Box */}
          <div className="bg-gradient-to-br from-[#0B291E] via-[#0E3527] to-[#124433] rounded-3xl p-6 text-white shadow-md border border-emerald-800/40 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                AI Attendance Insight
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              {insight.message}
            </p>

            {isBelowTarget && (
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-emerald-200">
                ⚠️ Low attendance triggers exam hall-ticket debarment if uncorrected before the exam in {activeSubject.examDaysLeft} days.
              </div>
            )}
          </div>

          {/* Crucial Interconnected Card: Attendance + Academic Priority */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Cross-Feature Synchronization
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>{activeSubject.name}</strong> is flagged by the priority algorithm because your attendance is currently <strong>{currentPct}%</strong> and your exam is in <strong>{activeSubject.examDaysLeft} days</strong>.
            </p>

            <button
              onClick={() => addSubjectToPlan(activeSubject)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B291E] hover:bg-[#071D15] text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              Add to Today's Plan
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Synchronizes study scheduler to allocate targeted revision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
