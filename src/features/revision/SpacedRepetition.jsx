import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playSFX } from '../../utils/sound';
import { useRevisionStore } from '../../stores/revisionStore';
import { useQuizStore } from '../../stores/quizStore';
import { useProgressStore } from '../../stores/progressStore';
import { getQuestions } from '../../data/questions';
import { subjects } from '../../data/subjects';
import { 
  Zap, 
  RotateCcw, 
  Eye, 
  Layers, 
  Check, 
  X, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function SpacedRepetition() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('due_list'); // 'due_list' | 'flashcards'
  
  // Stores
  const { revisionQueue, logQuestionAttempt, getDueQuestions } = useRevisionStore();
  const { startQuiz } = useQuizStore();
  const { addXp, logActivity } = useProgressStore();

  const dueItems = getDueQuestions();
  
  // Flashcard states
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Compile full question objects for due items
  const getDueQuestionObjects = () => {
    const list = [];
    dueItems.forEach(item => {
      const chapterQuestions = getQuestions(item.subjectId, item.chapterId);
      const qObj = chapterQuestions.find(q => q.id === item.questionId);
      if (qObj) {
        list.push({
          ...qObj,
          subjectId: item.subjectId,
          chapterId: item.chapterId
        });
      }
    });
    return list;
  };

  const dueQuestions = getDueQuestionObjects();

  const handleStartRevisionSession = () => {
    if (dueQuestions.length === 0) return;
    playSFX('click');
    
    // Pick the first item's details for routing, but load the custom revision questions list!
    const firstItem = dueQuestions[0];
    startQuiz(firstItem.subjectId, firstItem.chapterId, dueQuestions, 5);
    navigate(`/quiz/${firstItem.subjectId}/${firstItem.chapterId}`);
  };

  // Compile list of *all* questions for flashcards study
  const getAllQuestions = () => {
    const list = [];
    subjects.forEach(sub => {
      sub.chapters.forEach(chap => {
        const chapterQ = getQuestions(sub.id, chap.id);
        chapterQ.forEach(q => {
          list.push({
            ...q,
            subjectId: sub.id,
            chapterId: chap.id,
            subjectEmoji: sub.emoji,
            chapterName: chap.name
          });
        });
      });
    });
    return list;
  };

  const flashcardPool = getAllQuestions();
  const currentFlashcard = flashcardPool[cardIndex];

  const handleFlashcardSwipe = (knewIt) => {
    if (!currentFlashcard) return;
    
    // Play audio chimes
    if (knewIt) {
      playSFX('correct');
      addXp(5);
      logQuestionAttempt(currentFlashcard.id, currentFlashcard.subjectId, currentFlashcard.chapterId, true);
      logActivity(`Recalled flashcard: ${currentFlashcard.tags[0]}`);
    } else {
      playSFX('wrong');
      logQuestionAttempt(currentFlashcard.id, currentFlashcard.subjectId, currentFlashcard.chapterId, false);
    }

    setIsFlipped(false);
    
    // Move to next card
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % flashcardPool.length);
    }, 200);
  };

  const handleBackClick = () => {
    playSFX('click');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back button */}
      <div className="mx-auto max-w-3xl mb-6">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-3xl">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-poppins text-2xl font-extrabold text-primary dark:text-white flex items-center gap-2">
            <span>🔄</span>
            Active Revision Deck
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
            Solidify learning using spaced repetition algorithms and flashcards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="mb-8 flex gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
          <button
            onClick={() => { playSFX('click'); setActiveView('due_list'); }}
            className={`pb-1.5 px-4 text-sm font-bold border-b-2 transition ${
              activeView === 'due_list'
                ? 'border-accent text-accent'
                : 'border-transparent text-slate-500'
            }`}
          >
            Due Today ({dueItems.length})
          </button>
          <button
            onClick={() => { playSFX('click'); setActiveView('flashcards'); }}
            className={`pb-1.5 px-4 text-sm font-bold border-b-2 transition ${
              activeView === 'flashcards'
                ? 'border-accent text-accent'
                : 'border-transparent text-slate-500'
            }`}
          >
            Interactive Flashcards
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* VIEW 1: DUE LIST */}
          {activeView === 'due_list' && (
            <motion.div
              key="due"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark text-center">
                
                <div className="mb-4">
                  <span className="text-4xl">⏱️</span>
                  <h3 className="font-poppins text-lg font-black text-primary dark:text-white mt-2">
                    {dueItems.length === 0 ? "You're All Caught Up!" : `${dueItems.length} Cards Due`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {dueItems.length === 0 
                      ? "Awesome job. No questions are due for revision right now. Keep reviewing to lock in your progress." 
                      : "Recall answers for these card elements to extend their memory repetition intervals."}
                  </p>
                </div>

                {dueItems.length > 0 && (
                  <button
                    onClick={handleStartRevisionSession}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-accent hover:bg-accent-hover text-white py-3 px-6 text-sm font-bold shadow-md shadow-accent/25 hover:scale-102 transition"
                  >
                    <Zap className="h-4.5 w-4.5 fill-white animate-bounce" />
                    Start Review Session
                  </button>
                )}
              </div>

              {/* List of due items */}
              {dueQuestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-poppins text-xs font-black text-slate-450 uppercase tracking-widest px-1">
                    Cards Due
                  </h3>
                  
                  {dueQuestions.map(q => {
                    const sub = subjects.find(s => s.id === q.subjectId);
                    const chap = sub?.chapters.find(c => c.id === q.chapterId);
                    const queueItem = revisionQueue[q.id];

                    return (
                      <div 
                        key={q.id}
                        className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between dark:border-slate-800 dark:bg-card-dark"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-primary dark:text-white leading-tight">
                            {q.question.length > 60 ? q.question.substring(0, 60) + '...' : q.question}
                          </h4>
                          <span className="text-[10px] text-slate-450 mt-1 block uppercase">
                            {sub?.emoji} {chap?.name} · Level {queueItem?.confidence || 1} Recall
                          </span>
                        </div>
                        <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-yellow-400 shrink-0 ml-4">
                          Due
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            </motion.div>
          )}

          {/* VIEW 2: FLASHCARDS */}
          {activeView === 'flashcards' && (
            <motion.div
              key="flash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {currentFlashcard ? (
                <div className="w-full max-w-md">
                  
                  {/* Subject details card info */}
                  <div className="mb-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-650 dark:bg-slate-800 dark:text-slate-350">
                      <span>{currentFlashcard.subjectEmoji}</span>
                      <span>{currentFlashcard.chapterName}</span>
                    </span>
                  </div>

                  {/* Flippable Card container */}
                  <motion.div
                    className="relative cursor-pointer h-72 w-full perspective"
                    onClick={() => { playSFX('click'); setIsFlipped(!isFlipped); }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="w-full h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-card-dark flex flex-col justify-between select-none relative preserve-3d transition-transform duration-500"
                      style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* FRONT OF CARD */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                            Recall Question
                          </span>
                          <p className="font-poppins text-lg font-bold text-primary dark:text-white leading-snug">
                            {currentFlashcard.question}
                          </p>
                        </div>
                        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                          <Eye className="h-4 w-4" />
                          Tap to reveal answer
                        </div>
                      </div>

                      {/* BACK OF CARD (ROtated 180) */}
                      <div 
                        className="absolute inset-0 p-6 flex flex-col justify-between backface-hidden bg-slate-50 dark:bg-slate-900 rounded-3xl"
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-2">
                            NCERT Solution Key
                          </span>
                          <p className="font-poppins text-base font-bold text-primary dark:text-white leading-normal">
                            {currentFlashcard.correctAnswer}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                            {currentFlashcard.explanation}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 text-center font-bold">
                          Tip: {currentFlashcard.solution}
                        </span>
                      </div>

                    </motion.div>
                  </motion.div>

                  {/* Swiper Controls */}
                  <div className="mt-8 flex justify-center gap-6">
                    <button
                      onClick={() => handleFlashcardSwipe(false)}
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-200 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition shadow-sm"
                      title="Didn't know it"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleFlashcardSwipe(true)}
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition shadow-sm"
                      title="Knew it!"
                    >
                      <Check className="h-6 w-6" />
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-slate-400 mt-4 leading-normal">
                    Knew it: extends intervals and awards +5 XP. <br />
                    Didn't know: places card back to tomorrow's revision queue.
                  </p>

                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No flashcards pool available.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
