import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../utils/sound';
import { triggerCelebration, triggerConfetti } from '../utils/confetti';
import { useHistoryStore } from '../stores/historyStore';
import { subjects } from '../data/subjects';
import { 
  Trophy, 
  Clock, 
  Award, 
  Coins, 
  RotateCcw, 
  FileText, 
  Home, 
  ChevronRight, 
  Check, 
  X, 
  TrendingUp 
} from 'lucide-react';

export default function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { attempts } = useHistoryStore();

  const attempt = attempts.find(a => a.id === attemptId);

  // If no attempt is found, redirect home
  useEffect(() => {
    if (!attempt) {
      navigate('/subjects');
      return;
    }

    // Trigger celebratory effects based on score
    const accuracy = (attempt.score / attempt.totalQuestions) * 100;
    if (accuracy >= 80) {
      triggerCelebration();
    } else if (accuracy >= 50) {
      triggerConfetti();
    }
  }, [attemptId]);

  if (!attempt) return null;

  const subject = subjects.find(s => s.id === attempt.subjectId);
  const chapter = subject?.chapters.find(c => c.id === attempt.chapterId);

  if (!subject || !chapter) return null;

  const accuracy = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const skippedCount = attempt.totalQuestions - attempt.score - attempt.incorrectQuestions.length;
  
  // Find next chapter if any
  const chapterIdx = subject.chapters.findIndex(c => c.id === attempt.chapterId);
  const nextChapter = subject.chapters[chapterIdx + 1];

  // Circle progress calculation (SVG)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  const handleNextChapter = () => {
    playSFX('click');
    navigate(`/quiz/${subject.id}/${nextChapter.id}`);
  };

  const handleRetry = () => {
    playSFX('click');
    navigate(`/quiz/${subject.id}/${chapter.id}`);
  };

  const handleGoHome = () => {
    playSFX('click');
    navigate('/subjects');
  };

  const handleReview = () => {
    playSFX('click');
    navigate(`/review/${attemptId}`);
  };

  // Format time taken
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light px-4 py-12 sm:px-6 lg:px-8 dark:bg-bg-dark flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark text-center"
      >
        
        {/* Celebration Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20"
          >
            <Trophy className="h-8 w-8" />
          </motion.div>
          
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-white mt-4">
            {accuracy >= 80 ? 'Incredible Performance!' : accuracy >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Active recall score for <b>{chapter.name}</b>
          </p>
        </div>

        {/* Circular score & metrics grid */}
        <div className="grid gap-8 md:grid-cols-2 items-center mb-10">
          
          {/* Progress Ring */}
          <div className="relative flex justify-center items-center">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Back track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Active stroke */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-accent"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-poppins text-3xl font-black text-slate-850 dark:text-white">
                {accuracy}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Accuracy
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* Correct */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Check className="h-4.5 w-4.5" />
                <span>Correct</span>
              </div>
              <span className="font-poppins text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {attempt.score}
              </span>
            </div>

            {/* Wrong */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <X className="h-4.5 w-4.5" />
                <span>Incorrect</span>
              </div>
              <span className="font-poppins text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {attempt.incorrectQuestions.length}
              </span>
            </div>

            {/* Time Taken */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <Clock className="h-4.5 w-4.5" />
                <span>Duration</span>
              </div>
              <span className="font-poppins text-lg font-black text-slate-800 dark:text-white mt-1 block truncate">
                {formatTime(attempt.timeTaken)}
              </span>
            </div>

            {/* Skipped */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left dark:border-slate-800 dark:bg-slate-900/30">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-sm">
                <TrendingUp className="h-4.5 w-4.5" />
                <span>Skipped</span>
              </div>
              <span className="font-poppins text-lg font-black text-slate-800 dark:text-white mt-1 block">
                {skippedCount}
              </span>
            </div>

          </div>
        </div>

        {/* Gamification gains */}
        <div className="mb-10 flex justify-center gap-6 rounded-2xl bg-accent/5 py-4 px-6 border border-accent/10 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-accent animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">XP Earned</span>
              <span className="font-poppins text-base font-extrabold text-accent">+{attempt.xpEarned} XP</span>
            </div>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-accent fill-accent/10" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">Coins Earned</span>
              <span className="font-poppins text-base font-extrabold text-accent">+{attempt.coinsEarned}</span>
            </div>
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          
          <button 
            onClick={handleReview}
            className="rounded-2xl border border-slate-200 bg-white py-3 px-6 text-sm font-bold text-slate-705 hover:bg-slate-50 dark:border-slate-850 dark:bg-card-dark dark:text-slate-300 flex items-center justify-center gap-1.5 dark:hover:bg-slate-900"
          >
            <FileText className="h-4.5 w-4.5" />
            Review Answers
          </button>

          <button 
            onClick={handleRetry}
            className="rounded-2xl border border-slate-200 bg-white py-3 px-6 text-sm font-bold text-slate-705 hover:bg-slate-50 dark:border-slate-850 dark:bg-card-dark dark:text-slate-300 flex items-center justify-center gap-1.5 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4.5 w-4.5" />
            Retry Chapter
          </button>

          {nextChapter ? (
            <button 
              onClick={handleNextChapter}
              className="rounded-2xl bg-accent py-3 px-6 text-sm font-bold text-white shadow-md shadow-accent/20 flex items-center justify-center gap-1.5 hover:scale-[1.02] transition hover:bg-accent-hover"
            >
              Next Chapter
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          ) : (
            <button 
              onClick={handleGoHome}
              className="rounded-2xl bg-accent py-3 px-6 text-sm font-bold text-white shadow-md shadow-accent/20 flex items-center justify-center gap-1.5 hover:scale-[1.02] transition hover:bg-accent-hover"
            >
              <Home className="h-4.5 w-4.5" />
              Subjects List
            </button>
          )}

        </div>

      </motion.div>
    </div>
  );
}
