import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../utils/sound';
import { subjects } from '../data/subjects';
import { useProgressStore } from '../stores/progressStore';
import { useHistoryStore } from '../stores/historyStore';
import { ArrowLeft, Clock, Award, Star, CheckCircle, Brain, Play } from 'lucide-react';

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
};

export default function SubjectDetails() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { completedChapters } = useProgressStore();
  const { attempts } = useHistoryStore();

  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-bg-light p-4 text-center dark:bg-bg-dark">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Subject not found</h2>
        <Link to="/subjects" className="text-accent hover:underline">Back to subjects</Link>
      </div>
    );
  }

  // Calculate best score for each chapter
  const getBestScore = (chapterId) => {
    const chapterAttempts = attempts.filter(
      a => a.subjectId === subjectId && a.chapterId === chapterId
    );
    if (chapterAttempts.length === 0) return null;
    return Math.max(...chapterAttempts.map(a => a.score));
  };

  const handleChapterClick = (chapterId) => {
    playSFX('click');
    navigate(`/quiz/${subjectId}/${chapterId}`);
  };

  const handleBackClick = () => {
    playSFX('click');
    navigate('/subjects');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light px-4 py-8 sm:px-6 lg:px-8 dark:bg-bg-dark">
      
      {/* Header breadcrumb */}
      <div className="mx-auto max-w-4xl mb-6">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subjects
        </button>
      </div>

      {/* Hero Subject Box */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm mb-10 dark:border-slate-800 dark:bg-card-dark">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{subject.emoji}</span>
          <div>
            <h1 className="font-poppins text-2xl font-extrabold text-slate-800 dark:text-white">
              {subject.name} Chapters
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a chapter below to practice and earn up to 120 XP.
            </p>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          {subject.chapters.map((ch, index) => {
            const isCompleted = completedChapters.includes(`${subjectId}/${ch.id}`);
            const bestScore = getBestScore(ch.id);

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer rounded-2xl border border-slate-150 bg-white p-5 shadow-sm transition hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-card-dark dark:hover:border-accent"
              >
                {/* Visual completion stripe */}
                {isCompleted && (
                  <div className={`absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b ${subject.color}`} />
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Difficulty Badge */}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${DIFFICULTY_COLORS[ch.difficulty] || ''}`}>
                        {ch.difficulty}
                      </span>
                      
                      {/* Completed badge */}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3 w-3 fill-emerald-500/10" />
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className="font-poppins text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Play className="h-3.5 w-3.5" />
                        {ch.questionCount} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {ch.timeRequired} mins
                      </span>
                      <span className="flex items-center gap-1 text-accent">
                        <Award className="h-3.5 w-3.5" />
                        +{ch.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Right hand stats / Start trigger */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 gap-3">
                    
                    {/* Best Score display */}
                    {bestScore !== null && (
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Best Score
                        </div>
                        <div className="flex items-center gap-1 text-sm font-extrabold text-slate-700 dark:text-slate-300">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          <span>{bestScore} / {ch.questionCount}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleChapterClick(ch.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:scale-105 hover:bg-accent-hover"
                    >
                      <Brain className="h-4 w-4" />
                      {bestScore !== null ? 'Retry' : 'Start'}
                    </button>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
