import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Leaf,
  ShieldCheck,
  Lock,
  Mail,
  Key,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Building,
  GraduationCap,
  Eye,
  EyeOff,
  UserCheck,
  RefreshCw,
  Sliders,
  Globe,
  Printer,
  Calendar,
  Check,
  Clock,
  Layers,
  Zap,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginUser, navigate, addToast, student } = useApp();

  // Login Mode: 'one-click' | 'form' | 'presets'
  const [authMode, setAuthMode] = useState<'one-click' | 'form' | 'presets'>('one-click');

  // Form State
  const [email, setEmail] = useState('aditya.raj@nit.ac.in');
  const [password, setPassword] = useState('NIT@academic2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [autoSync, setAutoSync] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Authenticating state with simulated high-tech loading stages
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');

  // Interactive Left Showcase State
  const [showcaseTab, setShowcaseTab] = useState<'smartprint' | 'attendance' | 'hub'>('smartprint');
  const [printSliderValue, setPrintSliderValue] = useState<number>(11); // 11 to 87
  const [simulatedClassesAttended, setSimulatedClassesAttended] = useState<number>(20);
  const [simulatedTotalClasses, setSimulatedTotalClasses] = useState<number>(28);

  // Password Security Analysis
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 4
  };
  const pwdStrength = getPasswordStrength(password);

  // Calculate Attendance Percentage in Simulator
  const simulatedAttendance =
    simulatedTotalClasses > 0
      ? ((simulatedClassesAttended / simulatedTotalClasses) * 100).toFixed(1)
      : '0.0';
  const isAttendanceSafe = parseFloat(simulatedAttendance) >= 75.0;

  // Domain Quick-Fill
  const handleDomainAppend = (domain: string) => {
    const username = email.split('@')[0] || 'student';
    setEmail(`${username}${domain}`);
  };

  // Trigger high-tech login sequence
  const handleLogin = (customData?: {
    name?: string;
    email?: string;
    major?: string;
    university?: string;
  }) => {
    setIsAuthenticating(true);

    const steps = [
      'Establishing TLS 1.3 Handshake with NIT Calicut Gateway...',
      'Decrypting Semester 5 Attendance & Course Enrolments...',
      'Synchronizing SmartPrint High-Yield Knowledge Base...',
      'Calibrating 75% Attendance Safeguard Curves...',
      'Authentication Verified! Launching Command Center 🚀',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAuthStep(step);
      }, idx * 450);
    });

    setTimeout(() => {
      // Fire celebratory green/gold confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669', '#F59E0B'],
      });

      loginUser(customData);
      setIsAuthenticating(false);
    }, steps.length * 450 + 200);
  };

  return (
    <div className="min-h-screen bg-[#04140D] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden font-['Inter',sans-serif]">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-48 -left-48 w-96 sm:w-[550px] h-96 sm:h-[550px] bg-emerald-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-48 w-80 sm:w-[600px] h-80 sm:h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-48 left-1/3 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-emerald-800/15 rounded-full blur-[150px]" />
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 bg-grid-cyber opacity-70" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-emerald-950/80 bg-[#04140D]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B291E] to-[#10B981] flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight font-['Plus_Jakarta_Sans',sans-serif] text-white">
                EcoStudy <span className="text-emerald-400">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                NIT Gateway v4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Academic Resource Optimizer & Student Command Center
            </p>
          </div>
        </div>

        {/* Live campus status badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>ERP Sync: Online</span>
            <span className="text-emerald-700">•</span>
            <span className="text-slate-300 font-semibold">142.8k Pages Saved</span>
          </div>

          <button
            onClick={() => handleLogin()}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Direct Demo Access →
          </button>
        </div>
      </header>

      {/* Main Hero & Split-Screen Interactive Body */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        
        {/* Left Side: Interactive Academic Brain & Eco Simulator Showcase */}
        <div className="w-full lg:w-7/12 space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built for Modern College Campuses</span>
            <span className="text-emerald-700">•</span>
            <span className="text-emerald-400 font-bold">B.Tech / Higher Ed</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-white leading-[1.15] font-['Plus_Jakarta_Sans',sans-serif]">
            Study smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Print less.
            </span>
            <br />
            Stay on track.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            EcoStudy AI connects your college email, class timetable, and syllabi into an autonomous academic brain. Prune 87-page slide dumps down to 11 high-yield pages and protect your 75% attendance cut-off with predictive modeling.
          </p>

          {/* Interactive Feature Playground Container */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#071F17]/90 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_35px_rgba(16,185,129,0.12)] space-y-5">
            {/* Interactive Showcase Tabs */}
            <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Interactive Feature Simulator
              </span>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#04140D] border border-emerald-900/60 text-xs">
                <button
                  onClick={() => setShowcaseTab('smartprint')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    showcaseTab === 'smartprint'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SmartPrint
                </button>
                <button
                  onClick={() => setShowcaseTab('attendance')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    showcaseTab === 'attendance'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Attendance Guard
                </button>
                <button
                  onClick={() => setShowcaseTab('hub')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    showcaseTab === 'hub'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neural Sync Hub
                </button>
              </div>
            </div>

            {/* Tab 1: SmartPrint Interactive Simulator */}
            {showcaseTab === 'smartprint' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Printer className="w-4 h-4 text-emerald-400" />
                      DSA Unit 4: AVL Trees & Recurrences
                    </h3>
                    <p className="text-xs text-slate-400">
                      Drag the slider to see how AI strips filler pages while preserving 100% exam yield.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-extrabold text-emerald-400">
                      {87 - printSliderValue}
                    </span>
                    <span className="text-xs text-slate-400"> / 87 pages avoided</span>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-emerald-300 font-semibold">11 High-Yield Pages (Optimized)</span>
                    <span>87 Full Slides (Wasteful)</span>
                  </div>
                  <input
                    type="range"
                    min={11}
                    max={87}
                    value={printSliderValue}
                    onChange={e => setPrintSliderValue(Number(e.target.value))}
                    className="w-full accent-emerald-400 bg-emerald-950/80 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Live Impact Counters */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 text-center">
                    <span className="block text-base font-bold text-emerald-400">
                      {((87 - printSliderValue) * 0.01).toFixed(2)} kg
                    </span>
                    <span className="text-[10px] text-slate-400">CO₂ Avoided</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 text-center">
                    <span className="block text-base font-bold text-teal-400">
                      {((87 - printSliderValue) * 0.1).toFixed(1)} L
                    </span>
                    <span className="text-[10px] text-slate-400">Water Preserved</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 text-center">
                    <span className="block text-base font-bold text-amber-400">
                      ₹{(87 - printSliderValue) * 2}
                    </span>
                    <span className="text-[10px] text-slate-400">Printing Money Saved</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Attendance Cut-off Interactive Simulator */}
            {showcaseTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      Electronics & Semiconductor Devices
                    </h3>
                    <p className="text-xs text-slate-400">
                      Mandatory Hall Ticket Cutoff: <span className="text-emerald-400 font-bold">75.0%</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-2xl font-black ${
                        isAttendanceSafe ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {simulatedAttendance}%
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {isAttendanceSafe ? '✅ Hall Ticket Guaranteed' : '⚠️ Critical Debar Risk'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-full h-3 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isAttendanceSafe
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, parseFloat(simulatedAttendance))}%` }}
                  />
                  {/* 75% threshold marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_8px_white]"
                    style={{ left: '75%' }}
                    title="75% Mandatory Cutoff"
                  />
                </div>

                {/* Interactive Simulator Buttons */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-slate-400">Model scenario:</span>
                  <button
                    onClick={() => {
                      setSimulatedTotalClasses(prev => prev + 1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-all"
                  >
                    Miss next class (-1)
                  </button>
                  <button
                    onClick={() => {
                      setSimulatedClassesAttended(prev => prev + 1);
                      setSimulatedTotalClasses(prev => prev + 1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 text-xs font-semibold transition-all"
                  >
                    Attend 1 class (+1)
                  </button>
                  <button
                    onClick={() => {
                      setSimulatedClassesAttended(prev => prev + 4);
                      setSimulatedTotalClasses(prev => prev + 4);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-xs"
                  >
                    Attend next 4 (Reach 75% Safe)
                  </button>
                  <button
                    onClick={() => {
                      setSimulatedClassesAttended(20);
                      setSimulatedTotalClasses(28);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 underline ml-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Neural Sync Hub Feed */}
            {showcaseTab === 'hub' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    College ERP Live Parser
                  </h3>
                  <span className="text-[11px] text-emerald-300 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    NIT Calicut Node #408
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <div className="p-2.5 rounded-xl bg-[#04140D]/90 border border-emerald-900/50 flex items-start gap-2.5 text-xs">
                    <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300">Timetable Free Gap Detected:</span>
                      <p className="text-slate-300 text-[11px]">
                        1:00 PM – 3:00 PM slot after DSA Lab. Scheduled 45m Electronics focus + JFET quiz.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#04140D]/90 border border-amber-900/50 flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Email Notice from Academic Cell:</span>
                      <p className="text-slate-300 text-[11px]">
                        B.Tech Sem 5 Midterms scheduled starting Oct 1st. 4 Exam countdowns active.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#04140D]/90 border border-teal-900/50 flex items-start gap-2.5 text-xs">
                    <Leaf className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-300">Syllabus Ingestion:</span>
                      <p className="text-slate-300 text-[11px]">
                        4 Course Syllabi parsed into 24 conceptual units with credit-weightage scoring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Campus Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#071F17]/70 border border-emerald-900/40">
              <span className="block text-xl font-black text-white">142,800+</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Sheets Avoided</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#071F17]/70 border border-emerald-900/40">
              <span className="block text-xl font-black text-teal-300">17.2</span>
              <span className="text-[11px] text-teal-400 font-semibold">Trees Preserved</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#071F17]/70 border border-emerald-900/40">
              <span className="block text-xl font-black text-amber-300">98.2%</span>
              <span className="text-[11px] text-amber-400 font-semibold">Attendance Safe</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#071F17]/70 border border-emerald-900/40">
              <span className="block text-xl font-black text-emerald-300">1,240+</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Active Students</span>
            </div>
          </div>
        </div>

        {/* Right Side: The "Crazy" Next-Gen Institutional Login Card */}
        <div className="w-full lg:w-5/12 max-w-md mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#092D21]/95 to-[#041810]/98 border border-emerald-500/40 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.22)] overflow-hidden">
            {/* Animated Laser Shimmer across top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser" />

            {/* Glowing top ambient spot */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between mb-5 pb-4 border-b border-emerald-900/60">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Academic SSO Gateway
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                  Campus Portal Login
                </h2>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-300 shadow-inner">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            {/* Auth Mode Tabs */}
            <div className="relative z-10 grid grid-cols-3 gap-1 p-1 bg-[#04140D] rounded-2xl border border-emerald-900/60 mb-5 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('one-click')}
                className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'one-click'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1-Click SSO</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('form')}
                className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'form'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>ERP Login</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('presets')}
                className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'presets'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Personas</span>
              </button>
            </div>

            {/* MODE 1: 1-Click Instant Institute SSO (Aditya Raj) */}
            {authMode === 'one-click' && (
              <div className="relative z-10 space-y-4">
                {/* Digital Student Identity Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#062419] to-[#03170F] border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400/60 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0B291E] to-[#10B981] flex items-center justify-center text-white font-extrabold text-xl shadow-lg border-2 border-emerald-400/40">
                        {student.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#04140D] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                      </span>
                    </div>

                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-base truncate">
                          {student.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">
                        Roll: 22BCE10482 • B.Tech CSE
                      </p>
                      <p className="text-[11px] text-emerald-400/90 truncate">
                        National Institute of Technology
                      </p>
                    </div>
                  </div>

                  {/* Sync Details Pill */}
                  <div className="mt-3.5 pt-3 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      Sem 5 • 4 Syllabi Synced
                    </span>
                    <span className="text-emerald-300 font-semibold">ERP Attendance: 71.4%</span>
                  </div>
                </div>

                {/* Instant Launch Action Button */}
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={() => handleLogin()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{authStep || 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Authenticate as Aditya Raj ⚡</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  Instant zero-click verification for authorized institute test credentials.
                </p>
              </div>
            )}

            {/* MODE 2: Full Institutional ERP Form */}
            {authMode === 'form' && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleLogin({ email, name: email.split('@')[0] });
                }}
                className="relative z-10 space-y-4"
              >
                {/* Role Switcher */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Academic Role
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#04140D] rounded-xl border border-emerald-900/60 text-xs">
                    {(['student', 'faculty', 'admin'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`py-1 rounded-lg capitalize font-semibold transition-all ${
                          selectedRole === role
                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-700/60'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Institute Email */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Institute Email / Roll ID
                    </label>
                    <span className="text-[10px] text-emerald-400">College Domain Auto-Sync</span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="roll_no@nit.ac.in"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#04140D]/90 border border-emerald-900/80 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-white transition-all font-mono"
                    />
                  </div>

                  {/* Domain Quick-Chips */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px]">
                    <span className="text-slate-500 text-[10px]">Suffix:</span>
                    {['@nit.ac.in', '@iit.ac.in', '@bits-pilani.ac.in', '@college.edu'].map(dom => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => handleDomainAppend(dom)}
                        className="px-2 py-0.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-300 transition-colors shrink-0"
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ERP Access PIN / Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addToast(
                          'ERP PIN Recovery',
                          'A password reset OTP has been dispatched to aditya.raj@nit.ac.in.',
                          'info'
                        )
                      }
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#04140D]/90 border border-emerald-900/80 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Academic Security Meter */}
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Security Shield:</span>
                      <span
                        className={`font-bold ${
                          pwdStrength >= 3 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {pwdStrength >= 4
                          ? 'Ironclad 256-Bit SSL'
                          : pwdStrength >= 3
                          ? 'Strong Institute Protection'
                          : 'Basic Password'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pwdStrength >= 1 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          pwdStrength >= 2 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          pwdStrength >= 3 ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <div
                        className={`h-full rounded-full transition-all ${
                          pwdStrength >= 4 ? 'bg-teal-300' : 'bg-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-1 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={e => setAutoSync(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span>Auto-sync Timetable & Syllabi on Login</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                    <span>Remember on this campus workstation</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{authStep || 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate & Enter Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 3: Preset Personas (Switch Roles) */}
            {authMode === 'presets' && (
              <div className="relative z-10 space-y-3">
                <p className="text-xs text-slate-300 mb-2">
                  Select an academic persona to experience tailored workflows:
                </p>

                {/* Persona 1: Aditya Raj */}
                <div
                  onClick={() =>
                    handleLogin({
                      name: 'Aditya Raj',
                      major: 'Computer Science & Engineering',
                      email: 'aditya.raj@nit.ac.in',
                    })
                  }
                  className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-200 font-bold flex items-center justify-center text-xs">
                      AR
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Aditya Raj (B.Tech CSE)
                      </div>
                      <div className="text-[10px] text-amber-400">
                        Attendance 71.4% • Midterms in 10 Days
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </div>

                {/* Persona 2: Priya Nair */}
                <div
                  onClick={() =>
                    handleLogin({
                      name: 'Priya Nair',
                      major: 'Electrical & Electronics Engg',
                      email: 'priya.nair@nit.ac.in',
                    })
                  }
                  className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-800 text-teal-200 font-bold flex items-center justify-center text-xs">
                      PN
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                        Priya Nair (B.Tech EE)
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        Attendance 88.5% • SmartPrint Formula Champion
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </div>

                {/* Persona 3: Prof. Sharma */}
                <div
                  onClick={() =>
                    handleLogin({
                      name: 'Dr. R. K. Sharma',
                      major: 'Faculty of Computer Science',
                      email: 'rk.sharma@nit.ac.in',
                    })
                  }
                  className="p-3 rounded-2xl bg-[#04140D]/90 border border-emerald-900/60 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-900 text-purple-200 font-bold flex items-center justify-center text-xs">
                      RS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        Dr. R. K. Sharma (Course Instructor)
                      </div>
                      <div className="text-[10px] text-purple-300">
                        Curriculum Auditor & Syllabus Overseer
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    Enter →
                  </span>
                </div>
              </div>
            )}

            {/* Alternative Institutional SSO Options */}
            <div className="relative z-10 mt-5 pt-4 border-t border-emerald-900/60 text-center">
              <span className="text-[11px] text-slate-400 block mb-2.5">
                Federated Identity & Single Sign-On
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="py-2 px-3 rounded-xl bg-[#04140D] hover:bg-emerald-950/60 border border-emerald-900/60 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="py-2 px-3 rounded-xl bg-[#04140D] hover:bg-emerald-950/60 border border-emerald-900/60 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>DigiLocker / ABC</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compliance & Green Campus Certified Footer */}
      <footer className="relative z-10 border-t border-emerald-950/80 bg-[#03100A]/90 backdrop-blur-md py-4 px-4 sm:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> FERPA & 256-Bit SSL Compliant
          </span>
          <span className="text-emerald-900">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Green Campus Initiative 2026
          </span>
          <span className="text-emerald-900">•</span>
          <span>NEP 2020 Framework Aligned</span>
        </div>

        <div className="text-[11px] text-slate-500">
          EcoStudy AI Academic Suite • Designed for Indian Engineering Campuses
        </div>
      </footer>
    </div>
  );
};
