import React, { useState } from 'react';
import {
  Mail,
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileText,
  Building,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AcademicSyncPage: React.FC = () => {
  const {
    student,
    emailAccount,
    parsedEmailAlerts,
    timetableSlots,
    syllabusDocs,
    examEntries,
    connectEmailAccount,
    syncEmailNow,
    uploadSyllabusDocument,
    uploadTimetableSchedule,
    uploadExamDatesheet,
    navigate,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'email' | 'timetable' | 'syllabus' | 'exams'>('email');
  const [emailInput, setEmailInput] = useState(student.email || 'aditya.raj@nit.ac.in');
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<'Monday' | 'Tuesday' | 'Wednesday'>('Monday');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Filter timetable slots for selected day
  const filteredSlots = timetableSlots.filter(s => s.day === selectedTimetableDay);

  const handleConnectEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    connectEmailAccount(emailInput.trim());
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    addToast('Scanning College Ecosystem 🔄', 'Syncing College ERP, Google Classroom, and timetable schedules...', 'info');

    setTimeout(() => {
      syncEmailNow();
      setIsSyncingAll(false);
      addToast(
        'Academic Brain Fully Synchronized! 🧠',
        '4 Syllabi, 28 Timetable slots, 4 Exams, and College Email feed are active and guiding your daily plan.',
        'success'
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> Academic Central Nervous System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Academic Sync Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Connect your college email, upload syllabus, timetable, and exam dates. EcoStudy AI correlates everything to guide your daily routine.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B291E] hover:bg-[#071D15] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
          {isSyncingAll ? 'Scanning Feeds...' : 'Sync Full Academic Brain'}
        </button>
      </div>

      {/* 4 Connected Feeds Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setActiveTab('syllabus')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            activeTab === 'syllabus' ? 'border-emerald-600 bg-white shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">Syllabus Extracted</span>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {syllabusDocs.length} Subjects
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Units & blueprints mapped
          </span>
        </div>

        <div
          onClick={() => setActiveTab('timetable')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            activeTab === 'timetable' ? 'border-emerald-600 bg-white shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">Class Timetable</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            15 Slots Mapped
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Free study gaps detected
          </span>
        </div>

        <div
          onClick={() => setActiveTab('exams')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            activeTab === 'exams' ? 'border-emerald-600 bg-white shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">Exam Date-sheet</span>
            <Calendar className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {examEntries.length} Midterms
          </div>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3 h-3" /> DSA in 7 days
          </span>
        </div>

        <div
          onClick={() => setActiveTab('email')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            activeTab === 'email' ? 'border-emerald-600 bg-white shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold">Connected Email</span>
            <Mail className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] truncate">
            {emailAccount.isConnected ? 'Active Tracker' : 'Disconnected'}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5 truncate">
            <ShieldCheck className="w-3 h-3 shrink-0" /> {emailAccount.email.split('@')[0]}
          </span>
        </div>
      </div>

      {/* Tabs Navigator */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('email')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'email' ? 'bg-[#0B291E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email & ERP Feed Tracker ({parsedEmailAlerts.length})
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'timetable' ? 'bg-[#0B291E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          Timetable & Free Gaps
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'syllabus' ? 'bg-[#0B291E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Syllabus Units & Weightage
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'exams' ? 'bg-[#0B291E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Exam Circulars
        </button>
      </div>

      {/* TAB 1: CONNECTED EMAIL & ERP FEED TRACKER */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          {/* Email Account Connection Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {emailAccount.provider}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Connected: {emailAccount.email}
              </h3>
              <p className="text-xs text-slate-500">
                EcoStudy AI scans incoming emails for professor notices, attendance reports, circulars, and classroom deadlines.
              </p>
            </div>

            <form onSubmit={handleConnectEmail} className="flex items-center gap-2 shrink-0">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="college.email@nit.ac.in"
                className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-52 sm:w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B291E] hover:bg-[#071D15] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Sync Email
              </button>
            </form>
          </div>

          {/* Parsed Emails Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  AI Parsed Academic Stream
                </h3>
                <p className="text-xs text-slate-500">
                  Real emails automatically translated into schedule interventions and priority updates.
                </p>
              </div>

              <button
                onClick={syncEmailNow}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Feed
              </button>
            </div>

            <div className="space-y-3">
              {parsedEmailAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl p-5 border transition-all space-y-3 shadow-xs ${
                    alert.isUrgent ? 'border-amber-300' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {alert.sender}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({alert.senderEmail})</span>
                      {alert.isUrgent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          Action Required
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {alert.subject}
                  </h4>

                  <p className="text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 leading-relaxed font-mono">
                    "{alert.snippet}"
                  </p>

                  {/* AI Extraction Insight Box */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-950 font-medium">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{alert.parsedInsight}</span>
                    </div>

                    {alert.actionRoute && (
                      <button
                        onClick={() => navigate(alert.actionRoute!)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B291E] text-white text-xs font-semibold shrink-0"
                      >
                        {alert.actionLabel || 'Follow AI Guidance'} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMETABLE & FREE STUDY GAPS */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Class Timetable & Intelligent Gap Optimization
                </h3>
                <p className="text-xs text-slate-500">
                  EcoStudy maps your mandatory classes, labs, and turns unused between-class periods into targeted study sessions.
                </p>
              </div>

              {/* Day Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['Monday', 'Tuesday', 'Wednesday'] as const).map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedTimetableDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedTimetableDay === day
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable slots */}
            <div className="space-y-3 pt-2">
              {filteredSlots.map(slot => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    slot.isFreeBlock
                      ? 'bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl text-xs font-mono font-bold shrink-0 ${
                        slot.isFreeBlock
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {slot.timeSlot}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {slot.subjectName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            slot.isFreeBlock
                              ? 'bg-emerald-100 text-emerald-800'
                              : slot.type === 'Lab'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {slot.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {slot.subjectCode} • Location: <strong>{slot.room}</strong>
                      </div>
                    </div>
                  </div>

                  {slot.isFreeBlock ? (
                    <button
                      onClick={() => navigate('/focus')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all shrink-0 self-end sm:self-center"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Slot Focus Task
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Mandatory Attendance</span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Timetable Drag & Drop Zone */}
            <div
              onClick={() => uploadTimetableSchedule(18)}
              className="mt-4 p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 text-center cursor-pointer transition-all"
            >
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-800">
                Upload New Semester Timetable (PDF / Image)
              </div>
              <p className="text-[11px] text-slate-400">
                EcoStudy extracts all class periods and recalculates your daily study timeline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYLLABUS UNITS & WEIGHTAGE */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Extracted University Syllabus
              </h3>
              <p className="text-xs text-slate-500">
                AI parses your official course curriculum into units, exam mark allocations, and essential problem classes.
              </p>
            </div>

            <button
              onClick={() => uploadSyllabusDocument('Operating Systems & Kernel Architecture', 5)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B291E] text-white text-xs font-bold shadow-xs"
            >
              + Upload Syllabus PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {syllabusDocs.map(doc => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {doc.subjectCode} • {doc.totalCredits} Credits
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {doc.subjectName}
                  </h4>

                  <div className="space-y-2 pt-1">
                    {doc.units.map(unit => (
                      <div
                        key={unit.unitNumber}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Unit {unit.unitNumber}: {unit.title}</span>
                          <span className="text-emerald-700 font-semibold">{unit.weightageMarks} marks</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap gap-1">
                          {unit.keyTopics.map((topic, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{doc.dateUploaded}</span>
                  <button
                    onClick={() => navigate('/materials')}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    View Matched Notes →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EXAM CIRCULARS & DATE SHEET */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Official Examination Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Extracted from university circulars and controller of examination notifications.
                </p>
              </div>

              <button
                onClick={() => uploadExamDatesheet(4)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Sync with Exam Cell
              </button>
            </div>

            <div className="space-y-3">
              {examEntries.map(ex => (
                <div
                  key={ex.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {ex.subjectCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {ex.examType}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                      {ex.subjectName}
                    </h4>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                      <span>Date: <strong>{ex.dateFormatted}</strong></span>
                      <span>•</span>
                      <span>Time: <strong>{ex.timeSlot}</strong></span>
                      <span>•</span>
                      <span>Hall: <strong>{ex.examinationHall}</strong></span>
                    </div>

                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit mt-1">
                      Syllabus: {ex.syllabusCovered}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-2xl font-black text-rose-600 font-['Plus_Jakarta_Sans',sans-serif]">
                        {ex.daysLeft}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">days left</div>
                    </div>

                    <button
                      onClick={() => navigate('/planner')}
                      className="px-4 py-2 rounded-xl bg-[#0B291E] text-white text-xs font-bold"
                    >
                      View Prep Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
