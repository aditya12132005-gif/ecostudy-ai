import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Clock,
  CheckCircle2,
  UserCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const {
    subjects,
    topics,
    tasks,
    totalSemesterPagesAvoided,
  } = useApp();

  // Weekly study hours data
  const studyHoursData = [
    { day: 'Mon', hours: 2.25, target: 2.0 },
    { day: 'Tue', hours: 1.75, target: 2.0 },
    { day: 'Wed', hours: 2.5, target: 2.0 },
    { day: 'Thu', hours: 1.5, target: 2.0 },
    { day: 'Fri', hours: 3.0, target: 2.0 },
    { day: 'Sat', hours: 3.5, target: 2.5 },
    { day: 'Sun', hours: 2.8, target: 2.5 },
  ];

  // Topic mastery before vs after
  const masteryData = topics.slice(0, 5).map(t => ({
    name: t.name.split(' ')[0],
    fullName: t.name,
    mastery: t.masteryPercentage,
    target: 80,
  }));

  // Planned vs completed sessions
  const productivityData = [
    { week: 'W1', planned: 12, completed: 11 },
    { week: 'W2', planned: 14, completed: 13 },
    { week: 'W3', planned: 15, completed: 12 },
    { week: 'W4 (Current)', planned: 16, completed: 14 },
  ];

  // Sustainability pages avoided over time
  const sustainabilityData = [
    { period: 'Week 1', pagesAvoided: 18 },
    { period: 'Week 2', pagesAvoided: 42 },
    { period: 'Week 3', pagesAvoided: 76 },
    { period: 'Current', pagesAvoided: totalSemesterPagesAvoided },
  ];

  // Subject attendance data
  const attendanceData = subjects.map(s => ({
    name: s.code,
    fullName: s.name,
    attendance: s.attendancePercentage,
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" /> Academic Intelligence Metrics
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Your Progress
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Real-time tracking of study habits, topic mastery calibration, attendance, and paper avoided.
        </p>
      </div>

      {/* Top 4 Quick Impact Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Weekly Study</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            17.3 hrs
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+2.1h vs last week</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Trees Mastery</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {topics.find(t => t.id === 'top-dsa-trees')?.masteryPercentage || 68}%
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">+6% calibrated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Paper Avoided</span>
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-['Plus_Jakarta_Sans',sans-serif]">
            {totalSemesterPagesAvoided} p
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">1.26kg CO2 avoided</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Task Adherence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            87.5%
          </div>
          <span className="text-[11px] text-slate-500">14 of 16 completed</span>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Weekly Study Hours */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Weekly Study Hours
              </h3>
              <p className="text-xs text-slate-500">Daily hours logged vs planned target (2.0h/day)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              Avg 2.47h
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={2.0} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Target', fill: '#10B981', fontSize: 10 }} />
                <Bar dataKey="hours" fill="#0B291E" radius={[6, 6, 0, 0]} name="Hours Studied" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Topic Mastery Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Current Topic Mastery
              </h3>
              <p className="text-xs text-slate-500">Updated automatically via quiz accuracy & focus time</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
              Target 80%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} unit="%" />
                <YAxis dataKey="name" type="category" tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine x={80} stroke="#D97706" strokeDasharray="3 3" />
                <Bar dataKey="mastery" fill="#059669" radius={[0, 6, 6, 0]} name="Mastery %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Subject-wise Attendance vs 75% Cutoff */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Attendance by Subject
              </h3>
              <p className="text-xs text-slate-500">University mandatory eligibility threshold is 75%</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              EC-303 under 75%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[50, 100]} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <ReferenceLine y={75} stroke="#E11D48" strokeWidth={2} strokeDasharray="4 4" label={{ value: '75% Cutoff', fill: '#E11D48', fontSize: 11, position: 'top' }} />
                <Bar dataKey="attendance" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Cumulative Sustainability: Pages Avoided */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Cumulative Paper Saved
              </h3>
              <p className="text-xs text-slate-500">Total pages avoided through SmartPrint selective packs</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
              🌱 {totalSemesterPagesAvoided} Pages
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sustainabilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="pagesAvoided" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorPages)" name="Pages Avoided" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
