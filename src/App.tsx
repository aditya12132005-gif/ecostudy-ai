import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { SmartPrintPage } from './pages/SmartPrintPage';
import { AttendancePage } from './pages/AttendancePage';
import { PlannerPage } from './pages/PlannerPage';
import { FocusPage } from './pages/FocusPage';
import { QuizPage } from './pages/QuizPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AcademicSyncPage } from './pages/AcademicSyncPage';
import { LoginPage } from './pages/LoginPage';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { currentRoute, isAuthenticated } = useApp();

  // If user navigated to /login OR is not yet authenticated, render the high-tech Landing/Login Portal
  if (currentRoute === '/login' || (!isAuthenticated && currentRoute === '/')) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  // Authenticated App Route Dispatcher
  const renderRoute = () => {
    if (currentRoute === '/') {
      return <DashboardPage />;
    }
    if (currentRoute === '/sync') {
      return <AcademicSyncPage />;
    }
    if (currentRoute === '/materials') {
      return <MaterialsPage />;
    }
    if (currentRoute.startsWith('/materials/')) {
      return <MaterialDetailPage />;
    }
    if (currentRoute === '/smartprint') {
      return <SmartPrintPage />;
    }
    if (currentRoute === '/attendance') {
      return <AttendancePage />;
    }
    if (currentRoute === '/planner') {
      return <PlannerPage />;
    }
    if (currentRoute === '/focus') {
      return <FocusPage />;
    }
    if (currentRoute === '/quiz') {
      return <QuizPage />;
    }
    if (currentRoute === '/analytics') {
      return <AnalyticsPage />;
    }
    // Default fallback
    return <DashboardPage />;
  };

  return <Layout>{renderRoute()}</Layout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

