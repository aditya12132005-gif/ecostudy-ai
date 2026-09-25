import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Brain,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Topic, QuizQuestion } from '../types';

export const MaterialDetailPage: React.FC = () => {
  const {
    selectedMaterial,
    topics,
    navigate,
    addToast,
    updateTopicMastery,
  } = useApp();

  const mat = selectedMaterial;

  // Filter topics for this subject
  const subjectTopics = topics.filter(
    t => t.subjectId === mat?.subjectId || t.subjectName.toLowerCase().includes(mat?.subject?.toLowerCase() || '')
  );

  // Group topics by priority
  const highPriorityTopics = subjectTopics.filter(t => t.importance === 'High');
  const mediumPriorityTopics = subjectTopics.filter(t => t.importance === 'Medium');
  const lowPriorityTopics = subjectTopics.filter(t => t.importance === 'Low');

  // Interactive In-line Practice Question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const practiceQuestion: QuizQuestion = {
    id: 'pq-recursion',
    topicId: 'top-dsa-recursion',
    topicName: 'Recursion & Backtracking',
    question: 'What is the fundamental termination condition in a recursive function that prevents infinite stack overflow?',
    options: [
      { id: 'opt-1', label: 'A', text: 'The Recursive Step' },
      { id: 'opt-2', label: 'B', text: 'The Base Case' },
      { id: 'opt-3', label: 'C', text: 'The Memory Heap Allocation' },
      { id: 'opt-4', label: 'D', text: 'The Inorder Predecessor' },
    ],
    correctOptionId: 'opt-2',
    explanation: 'The Base Case is the condition under which the function halts recurring calls and begins unwinding the call stack, preventing a StackOverflowError.',
  };

  const handleSelectOption = (optId: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(optId);
    setIsAnswerChecked(true);

    if (optId === practiceQuestion.correctOptionId) {
      addToast('Correct Answer! 🎉', 'Well done! +5% mastery bonus added to Recursion.', 'success');
      // boost mastery
      const recTopic = topics.find(t => t.id === practiceQuestion.topicId);
      if (recTopic) {
        updateTopicMastery(recTopic.id, Math.min(100, recTopic.masteryPercentage + 5));
      }
    } else {
      addToast('Not quite right', 'Review the explanation below to reinforce your understanding.', 'warning');
    }
  };

  if (!mat) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Material not found.</p>
        <button
          onClick={() => navigate('/materials')}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs"
        >
          Back to Materials
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Top back navigation & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/materials')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Study Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/smartprint')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            Open in SmartPrint ({mat.recommendedPageCount} pages)
          </button>
        </div>
      </div>

      {/* Main Header & AI Summary Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
            {mat.subject}
          </span>
          <span className="text-xs text-slate-400 font-medium">•</span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            {mat.originalPageCount} pages analyzed
          </span>
          <span className="text-xs text-slate-400 font-medium">•</span>
          <span className="text-xs text-slate-500">Uploaded {mat.uploadDate}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          {mat.title}
        </h1>

        {/* AI Synthesis Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-100 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              AI Document Synthesis
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950/80 mt-1 leading-relaxed">
              {mat.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Topics breakdown + Exam Relevance & Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Important Topics (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Important Topics Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Categorized by exam frequency, concept complexity, and your current student mastery.
              </p>
            </div>

            {/* High Priority Topics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  High Priority Topics
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {highPriorityTopics.map(topic => (
                  <TopicItemCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>

            {/* Medium Priority Topics */}
            {mediumPriorityTopics.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Medium Priority Topics
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {mediumPriorityTopics.map(topic => (
                    <TopicItemCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </div>
            )}

            {/* Low Priority Topics */}
            {lowPriorityTopics.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Low Priority (Foundational)
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {lowPriorityTopics.map(topic => (
                    <TopicItemCard key={topic.id} topic={topic} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Practice Question */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  AI Practice Recall Question
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Assessment
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 leading-snug">
              {practiceQuestion.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {practiceQuestion.options.map(opt => {
                const isSelected = selectedAnswer === opt.id;
                const isCorrect = opt.id === practiceQuestion.correctOptionId;

                let btnStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800';
                if (isAnswerChecked) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswerChecked}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 font-bold text-slate-700 flex items-center justify-center shrink-0">
                      {opt.label}
                    </span>
                    <span className="mt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {isAnswerChecked && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                  selectedAnswer === practiceQuestion.correctOptionId
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {selectedAnswer === practiceQuestion.correctOptionId ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Correct!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-amber-600" />
                      Incorrect Choice
                    </>
                  )}
                </div>
                {practiceQuestion.explanation}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Formulas & Exam Weightage */}
        <div className="space-y-6">
          {/* Key Formulas Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Key Formulas Extracted
            </h3>

            <div className="space-y-2">
              {mat.formulae.map((formula, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-snug break-all"
                >
                  {formula}
                </div>
              ))}
            </div>
          </div>

          {/* Exam Relevance Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Exam Relevance
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {mat.examRelevanceSummary}
            </p>

            <button
              onClick={() => navigate('/planner')}
              className="w-full py-2.5 rounded-xl bg-[#0B291E] hover:bg-[#071D15] text-white text-xs font-semibold transition-all shadow-xs"
            >
              Add Topics to Study Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopicItemCard: React.FC<{ topic: Topic }> = ({ topic }) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{topic.name}</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              topic.difficulty === 'Hard'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : topic.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {topic.difficulty}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-tight">{topic.examRelevance}</p>
      </div>

      <div className="shrink-0 w-36 space-y-1">
        <div className="flex justify-between text-[11px] font-medium">
          <span className="text-slate-500">Mastery</span>
          <span className="font-bold text-slate-800">{topic.masteryPercentage}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              topic.masteryPercentage >= 75
                ? 'bg-emerald-500'
                : topic.masteryPercentage >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${topic.masteryPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
