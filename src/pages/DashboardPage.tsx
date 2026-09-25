import React from 'react';
import {
  Clock,
  Target,
  UserCheck,
  Leaf,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Printer,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { AIInsightCard } from '../components/common/AIInsightCard';

export const DashboardPage: React.FC = () => {
  const {
    student,
    subjects,
    tasks,
    totalSemesterPagesAvoided,
    toggleTaskCompletion,
    startFocusSession,
    navigate,
    addToast,
    emailAccount,
    parsedEmailAlerts,
    timetableSlots,
    syllabusDocs,
    examEntries,
  } = useApp();

  // Average attendance calculation
  const totalClasses = subjects.reduce((acc, s) => acc + s.totalClasses, 0);
  const totalAttended = subjects.reduce((acc, s) => acc + s.classesAttended, 0);
  const avgAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 78.4;

  // Planned study time
  const totalMinutesPlanned = tasks.reduce((acc, t) => (t.completed ? acc : acc + t.durationMinutes), 0);
  const hours = Math.floor(totalMinutesPlanned / 60);
  const mins = totalMinutesPlanned % 60;
  const studyTimeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const elecSubject = subjects.find(s => s.name.toLowerCase().includes('electron'));
  const mondayClasses = timetableSlots.filter(s => s.day === 'Monday');
  const latestAlert = parsedEmailAlerts[0];

  return (
    <div className="space-y-7 pb-28 sm:pb-24">
      {/* Personalized Header with Live Ecosystem Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Good morning, {student.name.split(' ')[0]} 👋
            </h1>
            <button
              onClick={() => navigate('/sync')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
              title="Click to view Academic Sync Hub"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>NIT ERP Connected</span>
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Academic plan synchronized with your syllabus, timetable free gaps, and college emails.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/sync')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            Academic Hub →
          </button>
          <button
            onClick={() => startFocusSession(tasks[0])}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Focus Session
          </button>
        </div>
      </div>

      {/* AI Priority Card (Central Differentiator - Enhanced with Timetable Gap & Email notice) */}
      <AIInsightCard
        badgeTitle="🤖 AI Academic Guide"
        headline="Utilize 1:00 PM – 3:00 PM Timetable Gap for Electronics & DSA Trees"
        reasoning="Your timetable maps a 2-hour free study window after your 11:30 AM DSA Lab. Your connected email parsed an urgent notice from ERP: Electronics attendance is 70.8% with Midterm in 10 days. EcoStudy has scheduled JFET & Tree Traversals into your free period."
        actionText="View AI Plan →"
        onAction={() => navigate('/planner')}
      />

      {/* Academic Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Study"
          value={studyTimeString || '2h 15m'}
          subtitle="Today's planned study time"
          icon={Clock}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
          trend={{ text: '3 sessions planned', isNeutral: true }}
          onClick={() => navigate('/planner')}
        />

        <MetricCard
          label="Focus"
          value="78%"
          subtitle="Weekly completion"
          icon={Target}
          iconColor="text-teal-700"
          iconBg="bg-teal-50"
          trend={{ text: '+6% vs last week', isPositive: true }}
          onClick={() => navigate('/focus')}
        />

        <MetricCard
          label="Attendance"
          value={`${Math.round(avgAttendance * 10) / 10}%`}
          subtitle="Across subjects (75% min)"
          icon={UserCheck}
          iconColor={avgAttendance < 75 ? 'text-amber-700' : 'text-emerald-700'}
          iconBg={avgAttendance < 75 ? 'bg-amber-50' : 'bg-emerald-50'}
          trend={{
            text: elecSubject && elecSubject.attendancePercentage < 75 ? '1 alert (Elec)' : 'Healthy',
            isPositive: avgAttendance >= 75,
          }}
          onClick={() => navigate('/attendance')}
          accentBorder={avgAttendance < 75}
        />

        <MetricCard
          label="Paper Saved"
          value={`${totalSemesterPagesAvoided} pages`}
          subtitle="Total estimated pages avoided"
          icon={Leaf}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
          trend={{ text: '🌱 76p this doc', isPositive: true }}
          onClick={() => navigate('/smartprint')}
        />
      </div>

      {/* Main Grid: Today's Plan + Upcoming Exams & SmartPrint Rec */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Plan (2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Today's Plan
              </h2>
              <p className="text-xs text-slate-500">
                AI prioritized based on exam urgency, attendance risk, and mastery.
              </p>
            </div>
            <button
              onClick={() => navigate('/planner')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
            >
              Full Schedule <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => {
              const isUrgent = task.priority === 'Weak topic' || task.priority === 'Urgent attendance';
              const isExam = task.priority === 'Exam approaching';

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                    task.completed
                      ? 'border-slate-200 opacity-60 bg-slate-50/50'
                      : isUrgent
                      ? 'border-rose-200 hover:border-rose-300'
                      : isExam
                      ? 'border-amber-200 hover:border-amber-300'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-emerald-600'
                      }`}
                      aria-label="Toggle task"
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {task.subject}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{task.topic}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.durationMinutes} min
                        </span>
                        {task.scheduledTime && (
                          <span className="text-slate-400">• {task.scheduledTime}</span>
                        )}
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            isUrgent ? 'text-rose-600' : isExam ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {isUrgent ? '🔴' : isExam ? '🟡' : '🟢'} {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => startFocusSession(task)}
                      disabled={task.completed}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0B291E] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Start
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Exams & SmartPrint Highlight */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Upcoming Exams
              </h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {subjects.map(sub => {
                const maxDays = 30;
                const progressPct = Math.max(10, Math.min(100, ((maxDays - sub.examDaysLeft) / maxDays) * 100));
                const isVeryUrgent = sub.examDaysLeft <= 7;

                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{sub.name}</span>
                      <span
                        className={`font-bold ${
                          isVeryUrgent ? 'text-rose-600' : sub.examDaysLeft <= 10 ? 'text-amber-600' : 'text-slate-600'
                        }`}
                      >
                        {sub.examDaysLeft} days left
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isVeryUrgent ? 'bg-rose-500' : sub.examDaysLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI SmartPrint Recommendation Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Print Optimization</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              You don’t need to print your entire 87-page DSA module. EcoStudy recommends printing <strong>11 pages</strong> and keeping the remaining material digital.
            </p>

            <button
              onClick={() => navigate('/smartprint')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Optimize Material
            </button>
          </div>

          {/* Today's Timetable & AI Free Study Gaps */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Today's Timetable
                </h3>
              </div>
              <button
                onClick={() => navigate('/sync')}
                className="text-[11px] font-semibold text-emerald-700 hover:underline"
              >
                View Hub →
              </button>
            </div>

            <div className="space-y-2">
              {mondayClasses.slice(0, 4).map(slot => (
                <div
                  key={slot.id}
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                    slot.isFreeBlock
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-slate-500 font-bold shrink-0">
                      {slot.timeSlot.split('–')[0]}
                    </span>
                    <span className="truncate font-semibold">{slot.subjectName}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      slot.isFreeBlock ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {slot.isFreeBlock ? 'Free Gap' : slot.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Parsed College ERP Email Notice */}
          {latestAlert && (
            <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">ERP Email Parsed</span>
                </div>
                <span className="text-[10px] text-slate-400">{latestAlert.timestamp}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {latestAlert.subject}
              </h4>

              <p className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                {latestAlert.parsedInsight}
              </p>

              {latestAlert.actionRoute && (
                <button
                  onClick={() => navigate(latestAlert.actionRoute!)}
                  className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-[#0B291E] text-white text-[11px] font-semibold transition-all shadow-xs"
                >
                  {latestAlert.actionLabel || 'Take Action'} →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
