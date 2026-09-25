import { StudyMaterial, Topic, QuizQuestion, Subject, StudyTask } from '../../types';
import { initialTopics, initialMaterials } from '../../data/initialData';

export interface DocumentAnalysisProgress {
  step: string;
  percent: number;
}

export const AI_MODE = 'mock'; // Can be switched to 'api' if VITE_GEMINI_API_KEY is supplied

/**
 * Modular AI Service Layer
 */
export const aiService = {
  /**
   * Simulates full document processing with realistic steps and timing
   */
  async analyzeDocument(
    file: { name: string; size: number },
    onProgress?: (progress: DocumentAnalysisProgress) => void
  ): Promise<StudyMaterial> {
    const steps: { step: string; percent: number; delay: number }[] = [
      { step: 'Uploading file and verifying structure...', percent: 15, delay: 600 },
      { step: 'Reading document text and optical diagrams...', percent: 40, delay: 900 },
      { step: 'Finding important exam-relevant topics...', percent: 70, delay: 900 },
      { step: 'Generating SmartPrint recommendations and practice sets...', percent: 90, delay: 800 },
      { step: 'Analysis complete ✓', percent: 100, delay: 400 },
    ];

    for (const s of steps) {
      if (onProgress) {
        onProgress({ step: s.step, percent: s.percent });
      }
      await new Promise(res => setTimeout(res, s.delay));
    }

    // Determine subject from title
    const lowerName = file.name.toLowerCase();
    const isMath = lowerName.includes('math') || lowerName.includes('calculus');
    const isElec = lowerName.includes('elect') || lowerName.includes('circuit') || lowerName.includes('fet');
    const subjectName = isMath ? 'Mathematics' : isElec ? 'Electronics' : 'Data Structures';
    const subjectId = isMath ? 'sub-math' : isElec ? 'sub-elec' : 'sub-dsa';
    
    // Estimate original page count
    const estimatedOriginalPages = Math.max(32, Math.min(120, Math.floor(file.size / 35000) || 72));
    const recommendedCount = Math.max(6, Math.floor(estimatedOriginalPages * 0.13));
    const avoided = estimatedOriginalPages - recommendedCount;

    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      subject: subjectName,
      subjectId: subjectId,
      originalPageCount: estimatedOriginalPages,
      recommendedPageCount: recommendedCount,
      pagesAvoided: avoided,
      status: 'Analyzed ✓',
      uploadDate: 'Just now',
      summary: `AI Module Analysis: Extracted ${estimatedOriginalPages} pages covering key conceptual foundations, mathematical models, exam derivations, and university question blueprints. Recommended concise print pack avoids ${avoided} unnecessary pages of boilerplate code, syllabus, and unworked bibliographies.`,
      keyTopicsCount: 8,
      importantConceptsCount: 6,
      practiceQuestionsCount: 16,
      recommendedPages: [2, 5, 9, 14, 21, 28, 35, 42, estimatedOriginalPages - 2].slice(0, recommendedCount),
      pagesDetail: [
        { pageNumber: 2, title: 'Foundational Theorems & Summary Matrix', contentType: 'Concept', isRecommended: true, snippet: 'Core theoretical formulation and structural axioms.', examRelevanceScore: 9 },
        { pageNumber: 5, title: 'Key Mathematical Derivations & Formulas', contentType: 'Formula', isRecommended: true, snippet: 'High-frequency exam equations and parameter constraints.', examRelevanceScore: 10 },
        { pageNumber: 9, title: 'Comparative Architecture & Flow Diagram', contentType: 'Diagram', isRecommended: true, snippet: 'Visual system state flow and comparison breakdown.', examRelevanceScore: 9 },
        { pageNumber: 14, title: 'Standard University Worked Solutions', contentType: 'Examples', isRecommended: true, snippet: 'Step-by-step examination solutions for maximum marks.', examRelevanceScore: 9 },
        { pageNumber: 21, title: 'Critical Revision Summary Cheat Sheet', contentType: 'Formula', isRecommended: true, snippet: 'High-yield memory triggers for rapid pre-exam recall.', examRelevanceScore: 10 },
      ],
      keyTopics: initialTopics.filter(t => t.subjectId === subjectId),
      formulae: [
        'Fundamental Relation: E = mc^2 / characteristic equation',
        'State Transition Invariant: T(n) = aT(n/b) + f(n)',
        'Efficiency Ratio: η = (P_out / P_in) * 100%',
      ],
      examRelevanceSummary: `Calculated high exam utility. Features 3 topics recurrent in the last 4 years of university question papers.`,
    };

    return newMaterial;
  },

  /**
   * Generates summary for material
   */
  generateSummary(materialTitle: string, subject: string): string {
    return `AI Executive Synthesis for "${materialTitle}": Focuses heavily on high-yield core principles of ${subject}. Deconstructs theoretical derivations and categorizes high-probability examination problems while eliminating filler administrative slides.`;
  },

  /**
   * Identifies important topics and categorizes priority
   */
  identifyImportantTopics(subjectId: string): Topic[] {
    const list = initialTopics.filter(t => t.subjectId === subjectId);
    return list.length > 0 ? list : initialTopics.slice(0, 3);
  },

  /**
   * Evaluates quiz score and returns percentage and topic mastery update
   */
  evaluateQuiz(
    userAnswers: Record<string, string>,
    questions: QuizQuestion[],
    currentMastery: number = 62
  ): {
    score: number;
    total: number;
    percentage: number;
    previousMastery: number;
    newMastery: number;
    masteryDelta: number;
    recommendation: string;
  } {
    let score = 0;
    const answeredQuestionIds = Object.keys(userAnswers);
    answeredQuestionIds.forEach(qId => {
      const q = questions.find(item => item.id === qId);
      if (q && userAnswers[qId] === q.correctOptionId) {
        score += 1;
      }
    });

    const total = answeredQuestionIds.length > 0 ? answeredQuestionIds.length : questions.length;
    const percentage = Math.round((score / total) * 100);

    // Mastery formula: if score >= 75%, mastery increases by 6%. Otherwise modest yield
    let delta = 3;
    if (percentage >= 75) {
      delta = 6;
    } else if (percentage >= 50) {
      delta = 4;
    } else {
      delta = 2;
    }

    const previousMastery = currentMastery;
    const newMastery = Math.min(100, currentMastery + delta);

    let recommendation = '';
    if (newMastery >= 80) {
      recommendation = 'Excellent comprehension! Your retention of tree structures and balance factors is now in the top tier.';
    } else if (newMastery >= 65) {
      recommendation = 'You understand traversal and structural basics well, but need more hands-on practice with AVL rotation edge cases.';
    } else {
      recommendation = 'Foundations require another active recall pass. Recommend a 15-minute quick revision tomorrow.';
    }

    return {
      score,
      total,
      percentage,
      previousMastery,
      newMastery,
      masteryDelta: delta,
      recommendation,
    };
  },

  /**
   * State-aware AI Assistant response generator
   */
  async generateAssistantResponse(
    query: string,
    appContext: {
      studentName: string;
      subjects: Subject[];
      topics: Topic[];
      materials: StudyMaterial[];
      tasks: StudyTask[];
      pagesAvoided: number;
    }
  ): Promise<{ text: string; actionSuggestion?: { label: string; route: string } }> {
    const q = query.toLowerCase();

    // 1. "What should I study today?"
    if (q.includes('what should i study') || q.includes('study plan') || q.includes('priority')) {
      const elecSub = appContext.subjects.find(s => s.name.toLowerCase().includes('electron'));
      const weakTopic = appContext.topics.find(t => t.masteryPercentage < 65);
      return {
        text: `Based on your upcoming exams, current attendance (${elecSub?.attendancePercentage}% in Electronics) and your topic mastery (${weakTopic?.masteryPercentage}% in ${weakTopic?.name}), here is my recommendation:\n\n1. **Electronics (JFET)** — High exam urgency (10 days) & attendance risk below 75%.\n2. **DSA (Trees & BST)** — Your current mastery is ${weakTopic?.masteryPercentage}%; a 45-minute focused session will close the gap.\n3. **Mathematics** — Quick 30-minute revision.`,
        actionSuggestion: { label: 'Open Study Planner', route: '/planner' }
      };
    }

    // 2. "Check attendance" or "Electronics"
    if (q.includes('attendance') || q.includes('absent') || q.includes('miss class')) {
      const lowSub = appContext.subjects.find(s => s.attendancePercentage < 75);
      if (lowSub) {
        return {
          text: `⚠️ **Attention Required**: Your **${lowSub.name}** attendance is **${lowSub.attendancePercentage}%** (below your ${75}% requirement). You have attended ${lowSub.classesAttended} out of ${lowSub.totalClasses} classes.\n\nEcoStudy Intelligence recommends attending your next **4 consecutive classes** to bring your score above 74.8% and restore your exam eligibility margin.`,
          actionSuggestion: { label: 'Open Attendance Calculator', route: '/attendance' }
        };
      }
      return {
        text: `Your overall attendance across all subjects is healthy, averaging 81.1%. Keep up the consistency!`,
        actionSuggestion: { label: 'View Attendance', route: '/attendance' }
      };
    }

    // 3. "Optimize this PDF" or "SmartPrint"
    if (q.includes('print') || q.includes('smartprint') || q.includes('paper') || q.includes('pdf')) {
      return {
        text: `🌱 **SmartPrint Optimization**: For your 87-page Data Structures module, EcoStudy recommends printing only **11 high-yield pages** (containing formulas, AVL rotation proofs, and traversal matrices) while keeping the remaining 76 pages digital.\n\nThis single decision saves **76 pages of paper**, 760ml of water, and keeps your physical study folder lightweight.`,
        actionSuggestion: { label: 'Review Print Pack', route: '/smartprint' }
      };
    }

    // 4. "Timetable" or "Classes" or "Free slot"
    if (q.includes('timetable') || q.includes('class') || q.includes('schedule') || q.includes('free')) {
      return {
        text: `⏰ **Today's Class Schedule & AI Study Gaps**:\n\n- **09:00 AM – 10:00 AM:** CS-301 Data Structures (LH-201)\n- **10:15 AM – 11:15 AM:** EC-303 Electronics (LH-104)\n- **11:30 AM – 01:00 PM:** DSA Lab (Computing Lab 3)\n- 💡 **01:00 PM – 03:00 PM:** **AI Detected Free Study Window** (Recommended for JFET & Tree Traversals deep work)\n- **03:00 PM – 04:00 PM:** MA-302 Engineering Math (LH-201)\n- **04:15 PM – 05:15 PM:** CS-304 Operating Systems (LH-102)`,
        actionSuggestion: { label: 'Open Academic Sync Hub', route: '/sync' }
      };
    }

    // 5. "Email" or "ERP alert" or "Notice"
    if (q.includes('email') || q.includes('alert') || q.includes('erp') || q.includes('notice')) {
      return {
        text: `📬 **Parsed College ERP & Email Feed**:\n\n1. **NIT ERP Cell (Today 8:15 AM):** ⚠️ *Low Attendance Warning in EC-303 (70.83%)*. Minimum 75% required for hall ticket eligibility.\n2. **Controller of Exams (Yesterday):** *Midterm Date-sheet Released*. CS-301 on 01 Oct, EC-303 on 04 Oct.\n3. **Prof. Sharma (2 days ago):** *Focus on AVL single & double rotations and 3-case BST deletion*.\n\nAll three notices have been factored into today's adaptive study plan.`,
        actionSuggestion: { label: 'Review Email Feed', route: '/sync' }
      };
    }

    // 6. "Syllabus" or "Units" or "Weightage"
    if (q.includes('syllabus') || q.includes('unit') || q.includes('weightage') || q.includes('exam date')) {
      return {
        text: `📜 **Syllabus & Exam Blueprint Overview**:\n\n- **CS-301 Data Structures:** 4 Credits, 5 Units. *Unit 4 (Trees & AVL) accounts for 25% of exam marks.* Exam in **7 days** (Hall A, Desk 42).\n- **EC-303 Electronics:** 3 Credits, 4 Units. *Unit 2 (JFET & MOSFET) carries 28 marks.* Exam in **10 days** (Electronics Wing 302).\n- **MA-302 Math III:** 4 Credits, 5 Units. *Unit 3 (Vector Calculus) carries 25 marks.* Exam in **15 days**.`,
        actionSuggestion: { label: 'View Syllabus Breakdown', route: '/sync' }
      };
    }

    // 7. "Explain this topic" or "Trees" / "JFET"
    if (q.includes('explain') || q.includes('trees') || q.includes('avl') || q.includes('jfet')) {
      return {
        text: `### 🌲 Quick Topic Breakdown: Binary Trees & AVL Rotations\n\n- **Inorder Traversal:** Left → Root → Right (produces sorted keys in a BST).\n- **Level-Order:** Breadth-First Search (BFS) using a FIFO queue.\n- **AVL Balance Factor:** $BF = Height(Left) - Height(Right) \\in \\{-1, 0, +1\\}$.\n- **Rotations:** LL, RR (single rotations) and LR, RL (double rotations).\n\nWould you like to test your recall with a 2-minute quick check?`,
        actionSuggestion: { label: 'Start Quick Quiz', route: '/quiz' }
      };
    }

    // Default intelligent conversational reply
    return {
      text: `Hello ${appContext.studentName}! I am your EcoStudy Academic Copilot. I continuously cross-reference your 4 course syllabi, class timetable, upcoming midterm dates, and connected college ERP email feed to guide every minute of your study routine.\n\nWhat would you like to check right now?`,
      actionSuggestion: { label: 'Open Academic Sync Hub', route: '/sync' }
    };
  }
};
