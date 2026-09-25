import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Check,
  ExternalLink,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Topbar: React.FC = () => {
  const {
    isSidebarCollapsed,
    setIsMobileMenuOpen,
    setIsAIAssistantOpen,
    notifications,
    markNotificationRead,
    navigate,
    student,
    logoutUser,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('print') || q.includes('smart')) {
      navigate('/smartprint');
    } else if (q.includes('attend') || q.includes('elec')) {
      navigate('/attendance');
    } else if (q.includes('plan') || q.includes('sched')) {
      navigate('/planner');
    } else if (q.includes('quiz') || q.includes('test')) {
      navigate('/quiz');
    } else if (q.includes('focus') || q.includes('timer')) {
      navigate('/focus');
    } else if (q.includes('dsa') || q.includes('mat')) {
      navigate('/materials');
    } else {
      navigate('/materials');
    }
    setSearchQuery('');
  };

  return (
    <header
      className={`h-16 fixed top-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
        isSidebarCollapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search topics, exams, or SmartPrint..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Assistant Button */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Academic Alerts ({unreadCount} new)
                </span>
                <span className="text-[11px] text-slate-400">Synced with LMS</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 text-left transition-colors ${
                      notif.read ? 'bg-white opacity-70' : 'bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>

                    <div className="mt-2 flex items-center justify-between">
                      {notif.actionRoute && (
                        <button
                          onClick={() => {
                            navigate(notif.actionRoute!);
                            markNotificationRead(notif.id);
                            setIsNotifOpen(false);
                          }}
                          className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          {notif.actionText || 'Take Action'} →
                        </button>
                      )}
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div
          onClick={() => navigate('/analytics')}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          title="Student Profile & Analytics"
        >
          <div className="w-7 h-7 rounded-lg bg-[#0B291E] text-emerald-300 font-bold flex items-center justify-center text-xs">
            {student.name.charAt(0)}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-700">
            {student.name}
          </span>
        </div>

        {/* Quick Portal Switcher & Sign Out */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-200/80">
          <button
            onClick={() => navigate('/login')}
            title="Campus Login Portal / Switch Account"
            className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden xl:inline text-[11px]">Portal</span>
          </button>
          <button
            onClick={() => logoutUser()}
            title="Sign Out of Campus Session"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
