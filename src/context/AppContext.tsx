import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Subject,
  Topic,
  StudyTask,
  StudyMaterial,
  QuizQuestion,
  AppNotification,
  AIReasoningLog,
  TimetableSlot,
  ParsedEmailAlert,
  EmailSyncAccount,
  SyllabusDocument,
  ExamDateEntry,
} from '../types';
import {
  initialStudent,
  initialSubjects,
  initialTopics,
  initialTasks,
  initialMaterials,
  initialQuizQuestions,
  initialEmailAccount,
  initialParsedEmailAlerts,
  initialTimetableSlots,
  initialSyllabusDocs,
  initialExamEntries,
} from '../data/initialData';
import { aiService } from '../services/ai/aiService';
import { generateAdaptiveStudyPlan } from '../services/planner/plannerService';
import { calculateCurrentAttendance } from '../services/attendance/attendanceService';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: number;
}

interface AppContextType {
  // Navigation & UI
  currentRoute: string;
  navigate: (route: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Data
  student: Student;
  subjects: Subject[];
  topics: Topic[];
  tasks: StudyTask[];
  materials: StudyMaterial[];
  selectedMaterialId: string;
  setSelectedMaterialId: (id: string) => void;
  selectedMaterial: StudyMaterial | undefined;
  
  // SmartPrint
  selectedPrintPages: number[];
  togglePrintPage: (pageNum: number) => void;
  selectAllRecommendedPrintPages: () => void;
  generatePrintPack: () => void;
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;
  totalSemesterPagesAvoided: number;
  
  // Attendance
  updateSubjectAttendance: (subjectId: string, attended: number, total: number) => void;
  addSubjectToPlan: (subject: Subject) => void;
  
  // Focus Session
  activeFocusTopic: {
    subject: string;
    topic: string;
    topicId: string;
    durationMinutes: number;
  };
  startFocusSession: (task?: StudyTask) => void;
  completeFocusSession: (understandingRating: string) => void;
  
  // Quiz
  quizQuestions: QuizQuestion[];
  quizAnswers: Record<string, string>;
  isQuizSubmitted: boolean;
  quizResult: {
    score: number;
    total: number;
    percentage: number;
    previousMastery?: number;
    newMastery: number;
    masteryDelta: number;
    recommendation: string;
  } | null;
  submitQuizAnswer: (questionId: string, optionId: string) => void;
  evaluateAndFinishQuiz: () => void;
  resetQuiz: () => void;
  addRevisionTaskTomorrow: () => void;
  updateTopicMastery: (topicId: string, newMastery: number) => void;

  // Study Planner
  plannerReasoning: AIReasoningLog[];
  regeneratePlan: () => void;
  toggleTaskCompletion: (taskId: string) => void;
  
  // Materials Upload
  uploadMaterial: (file: { name: string; size: number }, onProgress?: (p: any) => void) => Promise<StudyMaterial>;
  
  // Notifications & Toasts
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Unified Academic Hub & Auto-Sync
  emailAccount: EmailSyncAccount;
  parsedEmailAlerts: ParsedEmailAlert[];
  timetableSlots: TimetableSlot[];
  syllabusDocs: SyllabusDocument[];
  examEntries: ExamDateEntry[];
  connectEmailAccount: (email: string) => void;
  syncEmailNow: () => void;
  uploadSyllabusDocument: (subjectName: string, unitsCount: number) => void;
  uploadTimetableSchedule: (slotsCount: number) => void;
  uploadExamDatesheet: (examsCount: number) => void;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  loginUser: (studentData?: Partial<Student>) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state (supports hash / history routing)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  // Core Data
  const [student, setStudent] = useState<Student>(initialStudent);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [materials, setMaterials] = useState<StudyMaterial[]>(initialMaterials);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-dsa-u4');

  // SmartPrint Page Selection (default 11 recommended pages)
  const [selectedPrintPages, setSelectedPrintPages] = useState<number[]>([
    3, 7, 12, 19, 28, 41, 42, 59, 64, 78, 85,
  ]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [totalSemesterPagesAvoided, setTotalSemesterPagesAvoided] = useState<number>(126);

  // Planner reasoning history
  const [plannerReasoning, setPlannerReasoning] = useState<AIReasoningLog[]>([
    {
      id: 'log-1',
      timestamp: 'Today, 8:30 AM',
      title: 'Prioritized Electronics & DSA Trees',
      explanation: 'Electronics exam is in 10 days and current attendance is 71% (below 75% target). DSA Trees prioritized as weak topic (62% mastery).',
      trigger: 'Attendance Drop',
    },
  ]);

  // Focus Session
  const [activeFocusTopic, setActiveFocusTopic] = useState({
    subject: 'DSA',
    topic: 'Trees & Tree Traversals',
    topicId: 'top-dsa-trees',
    durationMinutes: 45,
  });

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(initialQuizQuestions);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    previousMastery?: number;
    newMastery: number;
    masteryDelta: number;
    recommendation: string;
  } | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Attendance Alert: Electronics',
      message: 'Current attendance is 71% (below 75% requirement). Attend the next 4 classes.',
      type: 'urgent',
      timestamp: '2 hours ago',
      read: false,
      actionRoute: '/attendance',
      actionText: 'Calculate',
    },
    {
      id: 'notif-2',
      title: 'SmartPrint Optimization Ready',
      message: 'DSA Unit 4 print pack reduced from 87 pages to 11 high-yield pages (76 saved).',
      type: 'ai',
      timestamp: 'Yesterday',
      read: false,
      actionRoute: '/smartprint',
      actionText: 'View Pack',
    },
    {
      id: 'notif-3',
      title: 'Upcoming Exam in 7 Days',
      message: 'Data Structures & Algorithms Final Exam approaches on Oct 01.',
      type: 'attention',
      timestamp: '1 day ago',
      read: true,
      actionRoute: '/planner',
      actionText: 'Review Schedule',
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Unified Academic Hub & Email Sync State
  const [emailAccount, setEmailAccount] = useState<EmailSyncAccount>(initialEmailAccount);
  const [parsedEmailAlerts, setParsedEmailAlerts] = useState<ParsedEmailAlert[]>(initialParsedEmailAlerts);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(initialTimetableSlots);
  const [syllabusDocs, setSyllabusDocs] = useState<SyllabusDocument[]>(initialSyllabusDocs);
  const [examEntries, setExamEntries] = useState<ExamDateEntry[]>(initialExamEntries);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash === '/login' || window.location.pathname === '/login') return false;
    const stored = localStorage.getItem('ecostudy_auth');
    if (stored !== null) return stored === 'true';
    return true;
  });

  // Listen to browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace(/^#/, '');
      const route = hash || window.location.pathname || '/';
      setCurrentRoute(route);
      if (route === '/login') {
        // Allow browsing login page
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState(null, '', `#${route}`);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (studentData?: Partial<Student>) => {
    if (studentData) {
      setStudent(prev => ({ ...prev, ...studentData }));
    }
    setIsAuthenticated(true);
    localStorage.setItem('ecostudy_auth', 'true');
    navigate('/');
    addToast(
      'Authentication Verified ⚡',
      `Connected as ${studentData?.name || student.name}. NIT Academic Brain Active.`,
      'success'
    );
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem('ecostudy_auth', 'false');
    navigate('/login');
    addToast('Session Disconnected', 'Logged out of campus institutional portal.', 'info');
  };

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type, timestamp: Date.now() };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 4.5s
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0];

  // SmartPrint actions
  const togglePrintPage = (pageNum: number) => {
    setSelectedPrintPages(prev => {
      if (prev.includes(pageNum)) {
        return prev.filter(p => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  };

  const selectAllRecommendedPrintPages = () => {
    if (selectedMaterial) {
      setSelectedPrintPages([...selectedMaterial.recommendedPages]);
      addToast('Pages Reset', 'Restored AI recommended print selection (11 pages).', 'info');
    }
  };

  const generatePrintPack = () => {
    const pagesSelected = selectedPrintPages.length;
    const originalPages = selectedMaterial ? selectedMaterial.originalPageCount : 87;
    const avoidedNow = Math.max(0, originalPages - pagesSelected);
    
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#6EE7B7'],
      });
    } catch {
      // safe fallback
    }

    setTotalSemesterPagesAvoided(prev => prev + avoidedNow);
    setIsPrintModalOpen(true);
    addToast(
      'Print Pack Generated! 🌱',
      `${pagesSelected} high-yield pages compiled. ${avoidedNow} pages avoided from paper waste.`,
      'success'
    );
  };

  // Attendance update & Intelligence
  const updateSubjectAttendance = (subjectId: string, attended: number, total: number) => {
    const pct = calculateCurrentAttendance(attended, total);
    let status: Subject['status'] = 'healthy';
    if (pct < 75) status = 'attention';
    if (pct < 65) status = 'urgent';

    setSubjects(prev =>
      prev.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            classesAttended: attended,
            totalClasses: total,
            attendancePercentage: pct,
            status,
          };
        }
        return s;
      })
    );

    addToast(
      'Attendance Recalculated',
      `Updated attendance to ${pct}%. AI insights and planner priorities synchronized.`,
      pct < 75 ? 'warning' : 'success'
    );
  };

  // Connect Attendance directly to Study Planner
  const addSubjectToPlan = (subject: Subject) => {
    const newTask: StudyTask = {
      id: `task-att-${Date.now()}`,
      subject: subject.name.includes('Electronics') ? 'Electronics' : subject.name,
      topic: `${subject.name} — High Yield Revision & Quiz Preparation`,
      durationMinutes: 40,
      priority: 'Urgent attendance',
      priorityLevel: 'urgent',
      completed: false,
      scheduledTime: '5:00 PM – 5:40 PM',
      day: 'Today',
      notes: `Added from Attendance Intelligence. Attendance is currently ${subject.attendancePercentage}%. Exam in ${subject.examDaysLeft} days.`,
    };

    setTasks(prev => [newTask, ...prev]);
    addToast(
      'Priority Added to Today’s Plan! 🎯',
      `${subject.name} added to your study schedule to protect exam performance.`,
      'success'
    );
    navigate('/planner');
  };

  // Tasks
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            addToast('Task Completed! 🎉', `Completed ${t.topic}. Knowledge log updated.`, 'success');
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  // Planner Regeneration
  const regeneratePlan = () => {
    const result = generateAdaptiveStudyPlan(subjects, topics, tasks);
    setTasks(result.tasks);
    setPlannerReasoning(prev => [result.reasoningLogs[0], ...prev]);
    addToast(
      'AI Schedule Regenerated 🤖',
      result.reasoningLogs[0].explanation,
      'info'
    );
  };

  // Focus Session
  const startFocusSession = (task?: StudyTask) => {
    if (task) {
      const topicObj = topics.find(t => t.name.toLowerCase().includes(task.topic.toLowerCase())) || topics[0];
      setActiveFocusTopic({
        subject: task.subject,
        topic: task.topic,
        topicId: topicObj.id,
        durationMinutes: task.durationMinutes || 45,
      });
    }
    navigate('/focus');
  };

  const completeFocusSession = (rating: string) => {
    addToast(
      'Focus Session Complete! 🏆',
      `Logged study session. Feedback: "${rating}". Launching Adaptive Quiz check...`,
      'success'
    );
    navigate('/quiz');
  };

  // Quiz
  const submitQuizAnswer = (questionId: string, optionId: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const evaluateAndFinishQuiz = () => {
    // Current topic is activeFocusTopic.topicId (e.g. 'top-dsa-trees' with 62% mastery)
    const currentTopic = topics.find(t => t.id === activeFocusTopic.topicId) || topics[0];
    const evalRes = aiService.evaluateQuiz(quizAnswers, quizQuestions, currentTopic.masteryPercentage);

    setQuizResult(evalRes);
    setIsQuizSubmitted(true);

    // Update topic mastery in state!
    setTopics(prev =>
      prev.map(t => {
        if (t.id === currentTopic.id) {
          return {
            ...t,
            masteryPercentage: evalRes.newMastery,
            statusBadge: evalRes.newMastery >= 68 ? '🟡 Moderate mastery' : t.statusBadge,
          };
        }
        return t;
      })
    );

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}

    addToast(
      'Mastery Updated! 📈',
      `${currentTopic.name} mastery increased from ${currentTopic.masteryPercentage}% → ${evalRes.newMastery}%!`,
      'success'
    );
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setQuizResult(null);
  };

  const addRevisionTaskTomorrow = () => {
    const newTask: StudyTask = {
      id: `task-rev-${Date.now()}`,
      subject: activeFocusTopic.subject,
      topic: `${activeFocusTopic.topic} — 15 min Active Recall & AVL Practice`,
      durationMinutes: 15,
      priority: 'Revision',
      priorityLevel: 'medium',
      completed: false,
      scheduledTime: 'Tomorrow, 5:00 PM',
      day: 'Tomorrow',
      notes: 'Added from Quiz feedback to solidify Level-Order Traversal & AVL edge cases.',
    };

    setTasks(prev => [...prev, newTask]);
    addToast(
      'Tomorrow’s Plan Updated! 📅',
      'Added 15-minute quick revision slot to lock in newly acquired mastery.',
      'success'
    );
    navigate('/planner');
  };

  const updateTopicMastery = (topicId: string, newMastery: number) => {
    setTopics(prev =>
      prev.map(t => (t.id === topicId ? { ...t, masteryPercentage: newMastery } : t))
    );
  };

  // Materials Upload
  // Materials Upload
  const uploadMaterial = async (
    file: { name: string; size: number },
    onProgress?: (p: any) => void
  ): Promise<StudyMaterial> => {
    const analyzed = await aiService.analyzeDocument(file, onProgress);
    setMaterials(prev => [analyzed, ...prev]);
    setSelectedMaterialId(analyzed.id);
    setSelectedPrintPages([...analyzed.recommendedPages]);
    addToast(
      'Document Analyzed Successfully! 📄',
      `"${analyzed.title}" processed. SmartPrint recommends ${analyzed.recommendedPageCount} of ${analyzed.originalPageCount} pages.`,
      'success'
    );
    return analyzed;
  };

  // Unified Academic Hub & Email Sync Handlers
  const connectEmailAccount = (email: string) => {
    setEmailAccount({
      email,
      provider: 'NIT Campus G-Suite & ERP Sync',
      isConnected: true,
      lastSyncedAt: 'Just now',
      totalEmailsTracked: 52,
      autoSyncLMS: true,
    });
    setStudent(prev => ({ ...prev, email }));
    addToast(
      'Email Connected! 📬',
      `Active tracker enabled for ${email}. College ERP, Google Classroom, and exam circulars are parsed in real time.`,
      'success'
    );
  };

  const syncEmailNow = () => {
    setEmailAccount(prev => ({
      ...prev,
      lastSyncedAt: 'Just now',
      totalEmailsTracked: prev.totalEmailsTracked + 2,
    }));
    addToast(
      'ERP & Email Feed Refreshed 🔄',
      'AI parsed incoming college alerts: Low attendance warning in EC-303 verified.',
      'info'
    );
  };

  const uploadSyllabusDocument = (subjectName: string, unitsCount: number) => {
    const newDoc: SyllabusDocument = {
      id: `syl-${Date.now()}`,
      subjectName,
      subjectCode: subjectName.substring(0, 3).toUpperCase() + '-305',
      totalCredits: 4,
      totalUnits: unitsCount,
      dateUploaded: 'Just now',
      status: 'Analyzed ✓',
      units: Array.from({ length: unitsCount }, (_, i) => ({
        unitNumber: i + 1,
        title: `Unit ${i + 1}: Core Theoretical Foundations & Problem Sets`,
        weightageMarks: Math.round(100 / unitsCount),
        keyTopics: ['Core Theorem', 'Analysis Derivation', 'Examination Model Questions'],
      })),
    };
    setSyllabusDocs(prev => [newDoc, ...prev]);
    addToast(
      'Syllabus Analyzed! 📜',
      `Extracted ${unitsCount} units and weightage distribution for ${subjectName}.`,
      'success'
    );
  };

  const uploadTimetableSchedule = (slotsCount: number) => {
    addToast(
      'Timetable Mapped! ⏰',
      `AI extracted ${slotsCount} weekly lecture slots and identified 3 high-yield free study gaps.`,
      'success'
    );
  };

  const uploadExamDatesheet = (examsCount: number) => {
    addToast(
      'Exam Dates Synchronized! 📅',
      `Mapped ${examsCount} midterm and end-semester examination dates to your urgency curves.`,
      'success'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,

        student,
        subjects,
        topics,
        tasks,
        materials,
        selectedMaterialId,
        setSelectedMaterialId,
        selectedMaterial,

        selectedPrintPages,
        togglePrintPage,
        selectAllRecommendedPrintPages,
        generatePrintPack,
        isPrintModalOpen,
        setIsPrintModalOpen,
        totalSemesterPagesAvoided,

        updateSubjectAttendance,
        addSubjectToPlan,

        activeFocusTopic,
        startFocusSession,
        completeFocusSession,

        quizQuestions,
        quizAnswers,
        isQuizSubmitted,
        quizResult,
        submitQuizAnswer,
        evaluateAndFinishQuiz,
        resetQuiz,
        addRevisionTaskTomorrow,
        updateTopicMastery,

        plannerReasoning,
        regeneratePlan,
        toggleTaskCompletion,

        uploadMaterial,

        notifications,
        markNotificationRead,
        toasts,
        addToast,
        dismissToast,

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
        isSyncModalOpen,
        setIsSyncModalOpen,

        isAuthenticated,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
