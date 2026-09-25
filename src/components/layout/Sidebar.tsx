import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Printer,
  CalendarCheck,
  UserCheck,
  Timer,
  CheckCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  Leaf,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    student,
    subjects,
    totalSemesterPagesAvoided,
    logoutUser,
  } = useApp();

  const attentionCount = subjects.filter(s => s.status === 'attention' || s.status === 'urgent').length;

  const navItems = [
    { label: 'Dashboard', route: '/', icon: LayoutDashboard },
    {
      label: 'Sync Hub',
      route: '/sync',
      icon: RefreshCw,
      badge: 'Live ERP',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    { label: 'Study Materials', route: '/materials', icon: BookOpen },
    {
      label: 'SmartPrint',
      route: '/smartprint',
      icon: Printer,
      badge: '76p saved',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    { label: 'Study Planner', route: '/planner', icon: CalendarCheck },
    {
      label: 'Attendance',
      route: '/attendance',
      icon: UserCheck,
      badge: attentionCount > 0 ? `${attentionCount} alert` : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    { label: 'Focus Session', route: '/focus', icon: Timer },
    { label: 'Adaptive Quiz', route: '/quiz', icon: CheckCircle },
    { label: 'Analytics', route: '/analytics', icon: BarChart3 },
    {
      label: 'Campus Login Portal',
      route: '/login',
      icon: ShieldCheck,
      badge: 'SSO',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <div
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B291E] to-[#134E39] flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Leaf className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-base tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-1.5">
                  EcoStudy <span className="text-emerald-700">AI</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate">
                  Study smarter • Print less
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#0B291E] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />

                {!isSidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                      isActive ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Impact Widget (if not collapsed) */}
        {!isSidebarCollapsed && (
          <div className="mx-3 mb-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/90 text-left">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                Paper Saved
              </span>
              <span className="font-bold">{totalSemesterPagesAvoided} pages</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 leading-snug">
              SmartPrint avoided ~1.26kg CO2 this semester.
            </p>
          </div>
        )}

        {/* Bottom Student Profile & Quick Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-1">
          <div
            onClick={() => handleNav('/analytics')}
            className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-white transition-all cursor-pointer flex-1 truncate ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title="View Profile & Analytics"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              {student.name.charAt(0)}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate text-left">
                <span className="text-xs font-bold text-slate-800 truncate">{student.name}</span>
                <span className="text-[10px] text-slate-500 truncate">{student.major.split(' ')[0]} • Sem 5</span>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={() => logoutUser()}
              title="Sign Out / Switch Campus Profile"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
