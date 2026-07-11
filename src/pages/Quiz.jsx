import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestions } from '../data/questions';
import { subjects } from '../data/subjects';
import { useQuizStore } from '../stores/quizStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useBookmarkStore } from '../stores/bookmarkStore';
import { useProgressStore } from '../stores/progressStore';
import { useHistoryStore } from '../stores/historyStore';
import { useAchievementStore } from '../stores/achievementStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useRevisionStore } from '../stores/revisionStore';
import { playSFX } from '../utils/sound';
import { triggerConfetti } from '../utils/confetti';
import { 
  Heart, 
  HelpCircle, 
  BookMarked, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  AlertCircle,
  HelpCircle as HintIcon,
  ChevronRight
} from 'lucide-react';

export default function Quiz() {
  const { subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  
  // Zustand Stores
  const {
    questions,
    currentQuestionIndex,
    selectedOption,
    isCorrect,
    answers,
    timeTaken,
    isPaused,
    quizActive,
    lives,
    incorrectQuestions,
    phase,
    startQuiz,
    selectOption,
    checkAnswer,
    nextQuestion,
    skipQuestion,
    pauseQuiz,
    resumeQuiz,
    incrementTime,
    endQuiz
  } = useQuizStore();

  const { survivalMode, soundEnabled, toggleSound } = useSettingsStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const { addXp, addCoins, completeChapter } = useProgressStore();
  const { unlockAchievement } = useAchievementStore();
  const { addAttempt, attempts } = useHistoryStore();

  // Local state
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);

  // Load subject/chapter definitions
  const subject = subjects.find(s => s.id === subjectId);
  const chapter = subject?.chapters.find(c => c.id === chapterId);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (quizActive && !isPaused && phase === "active") {
      timer = setInterval(() => {
        incrementTime();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizActive, isPaused, phase]);

  // Load questions and initialize quiz rules
  useEffect(() => {
    const list = getQuestions(subjectId, chapterId);
    if (list.length === 0) {
      navigate('/subjects');
      return;
    }
    // If the quiz is already active (e.g., started as retry incorrect), do not reset it
    const active = useQuizStore.getState().quizActive;
    if (active) return;
    
    // Set state back to rules phase on load
    useQuizStore.setState({ phase: "rules", quizActive: false });
  }, [subjectId, chapterId]);

  // If questions empty, don't crash
  if (!subject || !chapter) return null;

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    const list = getQuestions(subjectId, chapterId);
    playSFX('click');
    startQuiz(subjectId, chapterId, list, survivalMode ? 5 : 99);
  };

  const handleOptionSelect = (option) => {
    if (phase !== "active") return;
    playSFX('click');
    selectOption(option);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || phase !== "active") return;
    
    const correct = checkAnswer();

    // V2: Log metrics
    const { logQuestionSolve, logResponseTime } = useAnalyticsStore.getState();
    const { logQuestionAttempt } = useRevisionStore.getState();

    logQuestionSolve(currentQuestion.difficulty);
    // Simple response time log
    const timeSpent = Math.max(3, Math.round(timeTaken / (currentQuestionIndex + 1))); 
    logResponseTime(subjectId, timeSpent);
    logQuestionAttempt(currentQuestion.id, subjectId, chapterId, correct);
    
    if (correct) {
      playSFX('correct');
      triggerConfetti();
    } else {
      playSFX('wrong');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      // If out of lives, end immediately
      if (survivalMode && lives - 1 <= 0) {
        setTimeout(() => handleFinishQuiz(), 1500);
      }
    }
  };

  const handleNext = () => {
    playSFX('click');
    setShowHint(false);
    nextQuestion();
    
    // Check if finished
    const state = useQuizStore.getState();
    if (state.phase === "finished") {
      handleFinishQuiz();
    }
  };

  const handleSkip = () => {
    playSFX('click');
    setShowHint(false);
    skipQuestion();
    
    const state = useQuizStore.getState();
    if (state.phase === "finished") {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    const state = useQuizStore.getState();
    
    // Calculate final scores
    const correctAnswers = Object.entries(state.answers).filter(
      ([qid, ans]) => {
        const q = state.questions.find(qItem => qItem.id === qid);
        return q?.correctAnswer === ans;
      }
    ).length;

    const totalQ = state.questions.length;
    const scorePercentage = (correctAnswers / totalQ) * 100;
    
    // XP logic
    let xpEarned = correctAnswers * 10; // +10 XP per correct
    let perfectQuizBonus = false;
    let speedMasterBonus = false;

    if (correctAnswers === totalQ) {
      xpEarned += 50; // Perfect score bonus
      perfectQuizBonus = true;
    }
    
    if (state.timeTaken < 30 && correctAnswers === totalQ) {
      xpEarned += 10; // Speed bonus
      speedMasterBonus = true;
    }

    const coinsEarned = correctAnswers * 5; // 5 coins per correct answer

    // Update Progress
    const leveledUp = addXp(xpEarned);
    addCoins(coinsEarned);

    // V2: Log quiz accuracy
    const { logQuizAccuracy } = useAnalyticsStore.getState();
    logQuizAccuracy(subjectId, scorePercentage);
    
    if (scorePercentage >= 80) {
      completeChapter(subjectId, chapterId);
    }

    // Award achievements
    unlockAchievement("first_quiz");
    if (perfectQuizBonus) unlockAchievement("perfect_score");
    if (speedMasterBonus) unlockAchievement("speed_master");

    const attemptId = Math.random().toString(36).substring(2, 9);
    
    // Log Attempt to History
    addAttempt({
      id: attemptId,
      subjectId,
      chapterId,
      score: correctAnswers,
      totalQuestions: totalQ,
      timeTaken: state.timeTaken,
      xpEarned,
      coinsEarned,
      answers: state.answers,
      incorrectQuestions: state.incorrectQuestions,
      timestamp: Date.now()
    });

    // Notify of Level Up
    if (leveledUp) {
      setTimeout(() => playSFX('level_up'), 600);
    }
    
    endQuiz();
    navigate(`/result/${attemptId}`);
  };

  const toggleQuestionBookmark = () => {
    playSFX('click');
    if (isBookmarked(currentQuestion.id)) {
      removeBookmark(currentQuestion.id);
    } else {
      addBookmark(currentQuestion.id);
    }
  };

  // 1. RULES PHASE SCREEN
  if (phase === "rules") {
    // Get high score from history
    const chapterAttempts = attempts.filter(
      a => a.subjectId === subjectId && a.chapterId === chapterId
    );
    const highestScore = chapterAttempts.length > 0
      ? Math.max(...chapterAttempts.map(a => a.score))
      : 0;

    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-bg-light p-4 dark:bg-bg-dark">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark"
        >
          <div className="mb-4 text-center">
            <span className="text-4xl">{subject.emoji}</span>
            <h1 className="font-poppins text-xl font-extrabold text-slate-850 dark:text-white mt-2">
              {chapter.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active recall practice challenge
            </p>
          </div>

          {/* Rules Details */}
          <div className="my-6 space-y-3.5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-350">
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{chapter.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Time Required:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{chapter.timeRequired} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Difficulty Rating:</span>
              <span className="font-bold text-accent">{chapter.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span>Passing Score:</span>
              <span className="font-bold text-slate-850 dark:text-slate-100">80% (4 / 5 correct)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/50 pt-3 dark:border-slate-800">
              <span>Your Highest Score:</span>
              <span className="font-extrabold text-emerald-500">
                {chapterAttempts.length > 0 ? `${highestScore} / ${chapter.questionCount}` : "None"}
              </span>
            </div>
          </div>

          {/* Lives Info */}
          {survivalMode && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200/30 bg-rose-500/5 p-4 text-xs font-semibold text-rose-500">
              <Heart className="h-5 w-5 fill-rose-500 shrink-0" />
              <div>
                <p className="font-bold">Survival Mode Activated</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">You have 5 hearts. Answer incorrectly, lose a heart. 0 hearts = Game Over!</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/subject/${subjectId}`)}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-850 dark:bg-card-dark dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Back
            </button>
            <button 
              onClick={handleStartQuiz}
              className="flex-1 rounded-2xl bg-accent py-3 text-sm font-bold text-white shadow-md shadow-accent/20 transition hover:scale-[1.02] hover:bg-accent-hover"
            >
              Start Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ ARENA
  const progressPercent = questions.length > 0 
    ? ((currentQuestionIndex) / questions.length) * 100 
    : 0;

  // Format timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light pb-24 dark:bg-bg-dark">
      
      {/* Quiz Top bar */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur-md dark:border-slate-850 dark:bg-bg-dark/95">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          
          {/* Pause Trigger */}
          <button 
            onClick={() => { playSFX('click'); pauseQuiz(); }}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
          >
            <Pause className="h-4.5 w-4.5" />
          </button>

          {/* Progress gauge bar */}
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
              <div 
                className={`h-full bg-gradient-to-r ${subject.color} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-350">
            <span>⏱️</span>
            <span>{formatTime(timeTaken)}</span>
          </div>

          {/* Lives Indicator if SurvivalMode */}
          {survivalMode && (
            <div className="flex items-center gap-1 text-rose-500 font-bold text-sm">
              <Heart className="h-4.5 w-4.5 fill-rose-500" />
              <span>{lives}</span>
            </div>
          )}

        </div>
      </div>

      {/* Main Question Body */}
      <div className="mx-auto max-w-3xl px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-card-dark ${
              shake ? 'animate-shake' : ''
            }`}
          >
            {/* Header controls: Tags + Bookmark */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {currentQuestion.tags.map((t, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
              <button 
                onClick={toggleQuestionBookmark}
                className="text-slate-400 hover:text-amber-500 transition"
              >
                <BookMarked 
                  className={`h-5 w-5 ${
                    isBookmarked(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''
                  }`} 
                />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                {currentQuestion.difficulty} Question
              </span>
              <p className="font-poppins text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-150 leading-snug">
                {currentQuestion.question}
              </p>
            </div>

            {/* Hint Box (Collapsible) */}
            {showHint ? (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-yellow-400"
              >
                <div className="flex gap-2">
                  <HintIcon className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Clue: </span>
                    {currentQuestion.hint}
                  </div>
                </div>
              </motion.div>
            ) : (
              phase === "active" && (
                <button
                  onClick={() => { playSFX('click'); setShowHint(true); }}
                  className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-orange-500 transition"
                >
                  <HintIcon className="h-3.5 w-3.5" />
                  Need a hint?
                </button>
              )
            )}

            {/* Options grid */}
            <div className="grid gap-3 sm:grid-cols-1">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                
                // Colors inside check phase
                let optBorder = "border-slate-200 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700";
                let optBg = "bg-white dark:bg-card-dark";
                let optText = "text-slate-700 dark:text-slate-300";

                if (phase === "active") {
                  if (isSelected) {
                    optBorder = "border-accent ring-2 ring-accent/15 dark:border-accent dark:ring-accent/10";
                    optBg = "bg-accent/5 dark:bg-accent/5";
                    optText = "text-accent font-extrabold";
                  }
                } else if (phase === "explained") {
                  // After check is done
                  const isCorrectAnswer = currentQuestion.correctAnswer === opt;
                  if (isCorrectAnswer) {
                    // Correct answer green
                    optBorder = "border-emerald-500 dark:border-emerald-500";
                    optBg = "bg-emerald-500/10 dark:bg-emerald-500/5";
                    optText = "text-emerald-600 dark:text-emerald-400 font-extrabold";
                  } else if (isSelected && !isCorrect) {
                    // User picked wrong, make red
                    optBorder = "border-rose-500 dark:border-rose-500";
                    optBg = "bg-rose-500/10 dark:bg-rose-500/5";
                    optText = "text-rose-600 dark:text-rose-400 font-extrabold";
                  } else {
                    optBorder = "border-slate-100 opacity-60 dark:border-slate-900";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={phase !== "active"}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full rounded-2xl border p-4 text-left text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.99] flex items-center justify-between ${optBorder} ${optBg} ${optText}`}
                  >
                    <span>{opt}</span>
                    {phase === "explained" && currentQuestion.correctAnswer === opt && (
                      <Check className="h-4.5 w-4.5 text-emerald-500" />
                    )}
                    {phase === "explained" && isSelected && !isCorrect && (
                      <X className="h-4.5 w-4.5 text-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Collapsible Solution Explanation */}
            {phase === "explained" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800"
              >
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <h4 className="font-poppins text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-1.5">
                    Concept Explanation
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                    {currentQuestion.explanation}
                  </p>
                  
                  <div className="border-t border-slate-200/40 pt-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                    <span className="text-accent">NCERT Tip: </span>
                    {currentQuestion.solution}
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* PAUSE MODAL OVERLAY */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-card-dark"
          >
            <h2 className="font-poppins text-lg font-extrabold text-slate-800 dark:text-white mb-2">Quiz Paused</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Need a breather? Take your time, then jump right back in.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { playSFX('click'); resumeQuiz(); }}
                className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-md shadow-accent/20 hover:bg-accent-hover flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-white" />
                Resume Quiz
              </button>
              <button 
                onClick={() => { playSFX('click'); endQuiz(); navigate(`/subject/${subjectId}`); }}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-rose-500 transition hover:bg-slate-50 dark:border-slate-850 dark:bg-card-dark dark:hover:bg-slate-900"
              >
                Quit Quiz
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DUOLINGO STYLE SLIDE-UP CHECK BAR */}
      <div className={`fixed right-0 bottom-0 left-0 border-t bg-white px-4 py-4 transition-transform duration-300 z-40 dark:bg-card-dark dark:border-slate-850 ${
        phase === "explained"
          ? isCorrect
            ? 'border-emerald-200/30 bg-emerald-500/5 translate-y-0'
            : 'border-rose-200/30 bg-rose-500/5 translate-y-0'
          : 'translate-y-0 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          
          {/* Status Label on check phase */}
          {phase === "explained" ? (
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </div>
              <div>
                <p className={`font-poppins font-extrabold text-sm ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isCorrect ? 'Awesome job!' : 'Correct Answer: ' + currentQuestion.correctAnswer}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isCorrect ? 'Keep this up, active recall works!' : 'Study the explanation card above.'}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSkip}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-550 hover:bg-slate-50 dark:border-slate-850 dark:bg-card-dark dark:text-slate-400 dark:hover:bg-slate-900"
            >
              Skip
            </button>
          )}

          {/* Action Trigger */}
          {phase === "active" ? (
            <button
              disabled={selectedOption === null}
              onClick={handleCheckAnswer}
              className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-sm transition ${
                selectedOption === null
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-650 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent-hover hover:scale-[1.02] cursor-pointer'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className={`rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-sm hover:scale-[1.02] transition flex items-center gap-1 ${
                isCorrect 
                  ? 'bg-emerald-600 shadow-emerald-600/20' 
                  : 'bg-rose-600 shadow-rose-600/20'
              }`}
            >
              Continue
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
