import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  RotateCw,
  Clock,
  Play,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Brain,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyTask } from '../types';

export const PlannerPage: React.FC = () => {
  const {
    tasks,
    subjects,
    topics,
    plannerReasoning,
    regeneratePlan,
    toggleTaskCompletion,
    startFocusSession,
    navigate,
  } = useApp();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const elecSubject = subjects.find(s => s.name.toLowerCase().includes('electron'));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" /> Multi-Variable Optimization
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Your AI Study Plan
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            A schedule that adapts to how you actually learn, your attendance, and upcoming deadlines.
          </p>
        </div>

        <button
          onClick={regeneratePlan}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B291E] hover:bg-[#071D15] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0 active:scale-95"
        >
          <RotateCw className="w-4 h-4" />
          Regenerate Plan
        </button>
      </div>

      {/* AI Reasoning Panel (Top Alert / Explanation) */}
      <div className="bg-gradient-to-br from-[#0B291E] via-[#0E3527] to-[#124433] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-emerald-800/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Brain className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
              AI Reasoning Engine
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            {plannerReasoning[0]?.timestamp || 'Active schedule'}
          </span>
        </div>

        <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
          "{plannerReasoning[0]?.explanation || 'I moved Electronics earlier because your exam is closer and your attendance is below target (70.8%). DSA Trees was scheduled as primary focus session due to low 62% topic mastery.'}"
        </p>

        {/* Conceptual Prioritization Formula preview */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-emerald-300/80">
          <span className="font-semibold text-emerald-200">Algorithmic Weighting:</span>
          <span className="px-2 py-0.5 rounded-md bg-white/10">Exam Urgency (2.5x)</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded-md bg-white/10">Attendance Risk (6.0x)</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded-md bg-white/10">Learning Weakness (0.75x)</span>
        </div>
      </div>

      {/* Week Navigator Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {daysOfWeek.map((day, idx) => {
          const isSelected = selectedDay === day;
          const isToday = day === 'Monday';

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-[#0B291E] text-white shadow-xs font-bold'
                  : 'hover:bg-slate-100 text-slate-600 font-medium'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-75">
                {isToday ? 'Today' : `Day ${idx + 1}`}
              </div>
              <div className="text-xs sm:text-sm">{day}</div>
            </button>
          );
        })}
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {selectedDay === 'Monday' ? "Today's Adaptive Schedule" : `${selectedDay}'s Projected Schedule`}
            </h3>
            <p className="text-xs text-slate-500">
              Interleaved focus slots formatted with optimal cognitive rest intervals.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            {tasks.length} Sessions Planned
          </span>
        </div>

        {/* Timeline items */}
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const isUrgent = task.priority === 'Weak topic' || task.priority === 'Urgent attendance';
            const isExam = task.priority === 'Exam approaching';

            return (
              <div
                key={task.id}
                className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-60'
                    : isUrgent
                    ? 'bg-white border-rose-200 hover:border-rose-300 shadow-xs'
                    : isExam
                    ? 'bg-white border-amber-200 hover:border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left: Time and task details */}
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-600'
                    }`}
                    aria-label="Complete task"
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {task.scheduledTime || `${4 + index}:00 PM – ${4 + index}:45 PM`}
                      </span>

                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {task.subject}
                      </span>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isExam
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isUrgent ? '🔴' : isExam ? '🟡' : '🟢'} {task.priority}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                      {task.topic}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Duration & Launch Focus Session */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.durationMinutes} min
                    </span>
                  </div>

                  <button
                    onClick={() => startFocusSession(task)}
                    disabled={task.completed}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0B291E] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold shadow-xs transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Session
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
