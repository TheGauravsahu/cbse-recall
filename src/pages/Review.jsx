import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../utils/sound';
import { useHistoryStore } from '../stores/historyStore';
import { useQuizStore } from '../stores/quizStore';
import { getQuestions } from '../data/questions';
import { subjects } from '../data/subjects';
import { 
  ArrowLeft, 
  Check, 
  X, 
  HelpCircle, 
  Lightbulb, 
  AlertCircle, 
  RefreshCcw, 
  BookMarked,
  BookOpen
} from 'lucide-react';

function getHeadingAnchorForQuestion(question) {
  const text = (question.question + " " + (question.tags || []).join(" ")).toLowerCase();
  
  if (text.includes('identity') || text.includes('identities')) {
    return 'trigonometric-identities';
  }
  if (text.includes('ratio')) {
    return 'trigonometric-ratios';
  }
  if (text.includes('angle') || text.includes('sin 60') || text.includes('value of')) {
    return 'standard-angles-table';
  }
  if (text.includes('ohm')) {
    return 'ohms-law';
  }
  if (text.includes('series') || text.includes('parallel') || text.includes('combination') || text.includes('resistance')) {
    return 'resistance-combinations';
  }
  if (text.includes('rowlatt')) {
    return 'the-rowlatt-act';
  }
  if (text.includes('jallianwala')) {
    return 'jallianwala-bagh-massacre-13-april-1919';
  }
  if (text.includes('satyagraha') || text.includes('champaran') || text.includes('kheda') || text.includes('ahmedabad')) {
    return 'timeline-of-key-satyagrahas-1915---1918';
  }
  if (text.includes('salt') || text.includes('dandi')) {
    return 'the-salt-march-and-civil-disobedience';
  }
  if (text.includes('tense') || text.includes('verb')) {
    return 'the-tense-matrix';
  }
  if (text.includes('modal') || text.includes('must') || text.includes('should')) {
    return 'modals-chart';
  }
  
  return '';
}

export default function Review() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { attempts } = useHistoryStore();
  const { startQuiz } = useQuizStore();

  const attempt = attempts.find(a => a.id === attemptId);

  if (!attempt) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-bg-light p-4 dark:bg-bg-dark text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Attempt not found</h2>
        <button onClick={() => navigate('/subjects')} className="text-accent hover:underline">
          Back to subjects
        </button>
      </div>
    );
  }

  const subject = subjects.find(s => s.id === attempt.subjectId);
  const chapter = subject?.chapters.find(c => c.id === attempt.chapterId);
  const questions = getQuestions(attempt.subjectId, attempt.chapterId);

  if (!subject || !chapter || questions.length === 0) return null;

  const handleBackClick = () => {
    playSFX('click');
    navigate(`/result/${attemptId}`);
  };

  const handleRetryIncorrect = () => {
    playSFX('click');
    
    // Filter out only incorrect questions
    const incorrectList = questions.filter(q => 
      attempt.incorrectQuestions.includes(q.id)
    );

    if (incorrectList.length === 0) return;

    // Start a custom quiz session with incorrect questions only
    startQuiz(attempt.subjectId, attempt.chapterId, incorrectList, 5);
    
    // Navigate to active quiz (it will skip the introductory rules screen because we set quizActive = true)
    navigate(`/quiz/${attempt.subjectId}/${attempt.chapterId}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light px-4 py-8 sm:px-6 lg:px-8 dark:bg-bg-dark">
      
      {/* Header toolbar */}
      <div className="mx-auto max-w-3xl flex items-center justify-between mb-8 border-b border-slate-100 pb-4 dark:border-slate-800">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>

        {attempt.incorrectQuestions.length > 0 && (
          <button 
            onClick={handleRetryIncorrect}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-md shadow-accent/20 hover:scale-105 transition hover:bg-accent-hover"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Retry Incorrect ({attempt.incorrectQuestions.length})
          </button>
        )}
      </div>

      {/* Chapter header description */}
      <div className="mx-auto max-w-3xl mb-8">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
          Review Session
        </span>
        <h1 className="font-poppins text-2xl font-extrabold text-slate-800 dark:text-white">
          {chapter.name}
        </h1>
        <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
          Reviewing your performance: <span className="font-bold text-emerald-500">{attempt.score} correct</span>, <span className="font-bold text-rose-500">{attempt.incorrectQuestions.length} incorrect</span>.
        </p>
      </div>

      {/* Question review list */}
      <div className="mx-auto max-w-3xl space-y-6">
        {questions.map((q, index) => {
          const userAnswer = attempt.answers[q.id];
          const isSkipped = userAnswer === "__skipped__" || !userAnswer;
          const isCorrect = q.correctAnswer === userAnswer;

          let cardBorder = "border-slate-150 dark:border-slate-800";
          let badgeBg = "bg-slate-100 text-slate-500 dark:bg-slate-800";
          let badgeLabel = "Skipped";
          let BadgeIcon = HelpCircle;

          if (!isSkipped) {
            if (isCorrect) {
              cardBorder = "border-emerald-200 dark:border-emerald-900/30";
              badgeBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
              badgeLabel = "Correct";
              BadgeIcon = Check;
            } else {
              cardBorder = "border-rose-200 dark:border-rose-900/30";
              badgeBg = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
              badgeLabel = "Incorrect";
              BadgeIcon = X;
            }
          }

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-card-dark ${cardBorder}`}
            >
              
              {/* Question Index & Status Badge */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  Question {index + 1}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeBg}`}>
                  <BadgeIcon className="h-3 w-3" />
                  {badgeLabel}
                </span>
              </div>

              {/* Question Text */}
              <p className="font-poppins font-bold text-slate-800 dark:text-slate-200 mb-4 leading-snug">
                {q.question}
              </p>

              {/* Answer Blocks */}
              <div className="grid gap-3.5 sm:grid-cols-2 mb-4">
                {/* Your Answer */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/25">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Your Answer
                  </span>
                  <span className={`text-xs font-bold ${
                    isSkipped 
                      ? 'text-slate-400 italic' 
                      : isCorrect 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isSkipped ? 'Skipped' : userAnswer}
                  </span>
                </div>

                {/* Correct Answer */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/25">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Correct Answer
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {q.correctAnswer}
                  </span>
                </div>
              </div>

              {/* Concept Review Explanation block */}
              <div className="rounded-xl bg-amber-500/5 p-4 border border-amber-500/10">
                <div className="flex gap-2.5">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-poppins text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-widest mb-1">
                      Active Recall Tip
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                      {q.explanation}
                    </p>
                    <div className="border-t border-slate-200/40 pt-2 text-xs font-bold text-slate-650 dark:text-slate-300">
                      <span className="text-amber-500">Method: </span>
                      {q.solution}
                    </div>

                    <button
                      onClick={() => {
                        playSFX('click');
                        const anchor = getHeadingAnchorForQuestion(q);
                        navigate(`/notes/${attempt.subjectId}/${attempt.chapterId}${anchor ? `#${anchor}` : ''}`);
                      }}
                      className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs font-extrabold text-accent hover:bg-accent/10 transition cursor-pointer dark:border-accent/40 dark:bg-accent/15 dark:text-accent-hover"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Verify in Chapter Notes
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
