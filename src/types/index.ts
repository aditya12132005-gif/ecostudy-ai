export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'revision';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  major: string;
  semester: string;
  university: string;
  targetAttendance: number; // default 75%
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classesAttended: number;
  totalClasses: number;
  attendancePercentage: number;
  examDate: string; // ISO string or format
  examDaysLeft: number;
  credits: number;
  professor: string;
  color: string;
  status: 'healthy' | 'attention' | 'urgent';
}

export interface Topic {
  id: string;
  subjectId: string;
  subjectName: string;
  name: string;
  importance: 'High' | 'Medium' | 'Low';
  difficulty: 'Hard' | 'Medium' | 'Easy';
  masteryPercentage: number; // 0 to 100
  lastStudied?: string;
  examRelevance: string;
  statusBadge: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  priority: 'Weak topic' | 'Exam approaching' | 'Revision' | 'Urgent attendance';
  priorityLevel: 'urgent' | 'high' | 'medium' | 'low';
  completed: boolean;
  scheduledTime?: string;
  day?: string; // "Monday", etc.
  notes?: string;
}

export interface MaterialPageItem {
  pageNumber: number;
  title: string;
  contentType: 'Diagram' | 'Formula' | 'Concept' | 'Examples' | 'References' | 'Filler';
  isRecommended: boolean;
  snippet: string;
  examRelevanceScore: number; // 1-10
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  originalPageCount: number;
  recommendedPageCount: number;
  pagesAvoided: number;
  status: 'Analyzed ✓' | 'Processing...' | 'Pending';
  uploadDate: string;
  summary: string;
  keyTopicsCount: number;
  importantConceptsCount: number;
  practiceQuestionsCount: number;
  recommendedPages: number[];
  pagesDetail: MaterialPageItem[];
  keyTopics: Topic[];
  formulae: string[];
  examRelevanceSummary: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicName: string;
  question: string;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface FocusSessionState {
  subject: string;
  topic: string;
  topicId: string;
  totalDurationMinutes: number;
  elapsedSeconds: number;
  isActive: boolean;
  isPaused: boolean;
  notes: string;
}

export interface SustainabilityMetrics {
  pagesAvoidedThisDoc: number;
  pagesAvoidedSemester: number;
  paperSavedGrams: number;
  waterSavedLiters: number;
  co2SavedGrams: number;
  treesProtectedFraction: number;
}

export interface AIReasoningLog {
  id: string;
  timestamp: string;
  title: string;
  explanation: string;
  trigger: 'Attendance Drop' | 'Exam Proximity' | 'Quiz Performance' | 'Document Analyzed' | 'Email Circular' | 'Timetable Gap';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'attention' | 'healthy' | 'ai';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
  actionText?: string;
}

// ==========================================
// UNIFIED ACADEMIC HUB & AUTOMATED SYNC TYPES
// ==========================================

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string; // e.g. "09:00 AM – 10:00 AM"
  subjectName: string;
  subjectCode: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Free Study Block';
  isFreeBlock?: boolean;
}

export interface ParsedEmailAlert {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  fullBody: string;
  timestamp: string;
  category: 'attendance' | 'exam' | 'assignment' | 'announcement';
  parsedInsight: string;
  actionRoute?: string;
  actionLabel?: string;
  isUrgent?: boolean;
}

export interface EmailSyncAccount {
  email: string;
  provider: string;
  isConnected: boolean;
  lastSyncedAt: string;
  totalEmailsTracked: number;
  autoSyncLMS: boolean;
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  weightageMarks: number;
  keyTopics: string[];
}

export interface SyllabusDocument {
  id: string;
  subjectName: string;
  subjectCode: string;
  totalCredits: number;
  totalUnits: number;
  units: SyllabusUnit[];
  dateUploaded: string;
  status: 'Analyzed ✓' | 'Processing...';
}

export interface ExamDateEntry {
  id: string;
  subjectName: string;
  subjectCode: string;
  examType: 'Midterm Examination' | 'Semester Final' | 'Practical Viva';
  dateFormatted: string;
  timeSlot: string;
  examinationHall: string;
  daysLeft: number;
  syllabusCovered: string;
}
