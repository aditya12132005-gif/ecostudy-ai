import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/Toast';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';
import { useApp } from '../../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-['Inter',sans-serif]">
      {/* Sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-16 min-h-screen flex flex-col ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="py-5 px-6 border-t border-slate-200/70 text-center text-xs text-slate-500 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">🌱 EcoStudy AI</span>
            <span>—</span>
            <span>Study smarter. Print less. Stay on track.</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Adaptive Academic AI Engine • Target Attendance 75%
          </div>
        </footer>
      </main>

      {/* Floating Global AI Assistant */}
      <AIAssistantDrawer />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
