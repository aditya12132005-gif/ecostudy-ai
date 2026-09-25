import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CalendarPlus,
  TrendingUp,
  Brain,
  HelpCircle,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuizPage: React.FC = () => {
  const {
    quizQuestions,
    quizAnswers,
    isQuizSubmitted,
    quizResult,
    submitQuizAnswer,
    evaluateAndFinishQuiz,
    resetQuiz,
    addRevisionTaskTomorrow,
    activeFocusTopic,
    topics,
    navigate,
  } = useApp();

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  const currentTopic = topics.find(t => t.id === activeFocusTopic.topicId) || topics[0];
  const question = quizQuestions[currentQIndex];

  const totalQuestions = quizQuestions.length;
  const answeredCount = Object.keys(quizAnswers).length;
  const allAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Brain className="w-4 h-4" /> Active Spaced Recall
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          Quick Check
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Let’s see what you actually learned. Real-time feedback calibrates your topic mastery.
        </p>
      </div>

      {!isQuizSubmitted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Progress Header with Interactive Question Navigation Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Topic: {question.topicName}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                {answeredCount} of {totalQuestions} answered
              </span>
            </div>

            {/* Question Quick Jump Pills */}
            <div className="flex items-center gap-1.5">
              {quizQuestions.map((q, idx) => {
                const isAnswered = !!quizAnswers[q.id];
                const isCurrent = currentQIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isCurrent
                        ? 'bg-[#0B291E] text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Q{idx + 1}
                    {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
              {question.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {question.options.map(option => {
              const isSelected = quizAnswers[question.id] === option.id;
              const hasAnsweredThis = !!quizAnswers[question.id];
              const isCorrect = option.id === question.correctOptionId;

              let style = 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 text-slate-800';

              if (hasAnsweredThis) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold shadow-xs';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-400 bg-rose-50 text-rose-900 font-medium';
                } else {
                  style = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => submitQuizAnswer(question.id, option.id)}
                  disabled={hasAnsweredThis}
                  className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 ${style}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                      hasAnsweredThis && isCorrect
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isSelected
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {option.label}
                  </span>

                  <span className="mt-0.5 leading-relaxed flex-1">{option.text}</span>

                  {hasAnsweredThis && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {hasAnsweredThis && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {quizAnswers[question.id] && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed transition-all ${
                quizAnswers[question.id] === question.correctOptionId
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {quizAnswers[question.id] === question.correctOptionId ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-600" />
                    Detailed Explanation:
                  </>
                )}
              </div>
              {question.explanation}
            </div>
          )}

          {/* Bottom Action Bar: Always allow submission once at least 1 question is answered! */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
              >
                ← Previous
              </button>

              {currentQIndex < totalQuestions - 1 && (
                <button
                  onClick={() => setCurrentQIndex(currentQIndex + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0B291E] text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Finish & Update Mastery Button: Active and bright whenever at least 1 question is answered! */}
            <button
              onClick={evaluateAndFinishQuiz}
              disabled={answeredCount === 0}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${
                answeredCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/20 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Finish & Update Mastery {answeredCount > 0 ? `(${answeredCount}/${totalQuestions})` : ''}
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Complete & Mastery Update Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Assessment Completed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              Score: {quizResult?.score} / {quizResult?.total} ({quizResult?.percentage}%)
            </h2>
          </div>

          {/* Mastery Update Prominent Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 text-left space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Mastery Calibrated
            </span>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">{currentTopic.name}</h4>
                <div className="text-2xl font-black text-emerald-800 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  {quizResult?.previousMastery || 62}% → {quizResult?.newMastery}%
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                <TrendingUp className="w-4 h-4" />
                +{quizResult?.masteryDelta}% Yield
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="pt-2 border-t border-emerald-100 text-xs text-slate-700 leading-relaxed">
              <strong>AI Recommendation:</strong> {quizResult?.recommendation}
            </div>
          </div>

          {/* Connected Action: Add 15 min revision tomorrow */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={addRevisionTaskTomorrow}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B291E] hover:bg-[#071D15] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <CalendarPlus className="w-4 h-4 text-emerald-400" />
              Add 15 min revision tomorrow
            </button>

            <button
              onClick={() => {
                resetQuiz();
                navigate('/analytics');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              View Updated Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
