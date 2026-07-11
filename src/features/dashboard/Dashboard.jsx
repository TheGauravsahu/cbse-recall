import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../../utils/sound';
import { getRecommendedChapter } from './recommendations';
import { useProgressStore } from '../../stores/progressStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useRevisionStore } from '../../stores/revisionStore';
import { useAuthStore } from '../../stores/authStore';
import { subjects } from '../../data/subjects';
import { 
  Compass, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Award, 
  RotateCcw, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle,
  Play,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Stores
  const { xp, level, streak, recentActivity } = useProgressStore();
  const { attempts } = useHistoryStore();
  const { getDueQuestionsCount } = useRevisionStore();
  const { user } = useAuthStore();

  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    setRecommendation(getRecommendedChapter());
  }, [attempts]);

  const handleStartQuiz = (subId, chapId) => {
    playSFX('click');
    navigate(`/quiz/${subId}/${chapId}`);
  };

  // Find last attempted chapter in history to continue learning
  const getLastAttempt = () => {
    if (attempts.length === 0) return null;
    const last = attempts[0];
    const subDef = subjects.find(s => s.id === last.subjectId);
    const chapDef = subDef?.chapters.find(c => c.id === last.chapterId);
    if (!subDef || !chapDef) return null;
    return {
      subjectId: last.subjectId,
      chapterId: last.chapterId,
      chapterName: chapDef.name,
      subjectName: subDef.name,
      color: subDef.color,
      emoji: subDef.emoji
    };
  };

  const lastAttempt = getLastAttempt();
  const dueCount = getDueQuestionsCount();

  // Calculate today's answered count for daily goal (e.g. goal = 10 questions)
  const getTodaySolvesCount = () => {
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    return attempts
      .filter(a => a.timestamp >= startOfToday)
      .reduce((sum, a) => sum + a.totalQuestions, 0);
  };
  const todayQuestionsAnswered = getTodaySolvesCount();
  const dailyGoal = 10;
  const goalPercent = Math.min(100, Math.round((todayQuestionsAnswered / dailyGoal) * 100));

  // Extract weak chapters (< 75% accuracy)
  const getWeakChapters = () => {
    const chapterAcc = {};
    attempts.forEach(a => {
      const key = `${a.subjectId}/${a.chapterId}`;
      if (!chapterAcc[key]) chapterAcc[key] = { correct: 0, total: 0 };
      chapterAcc[key].correct += a.score;
      chapterAcc[key].total += a.totalQuestions;
    });

    const weak = [];
    Object.entries(chapterAcc).forEach(([key, stats]) => {
      const acc = (stats.correct / stats.total) * 100;
      if (acc < 75) {
        const [subId, chapId] = key.split('/');
        const sub = subjects.find(s => s.id === subId);
        const chap = sub?.chapters.find(c => c.id === chapId);
        if (sub && chap) {
          weak.push({
            subjectId: subId,
            chapterId: chapId,
            name: chap.name,
            accuracy: Math.round(acc)
          });
        }
      }
    });
    return weak.slice(0, 3); // top 3 weakest
  };
  const weakChapters = getWeakChapters();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="glow-ambient bg-accent/10 w-96 h-96 top-10 left-10"></div>
      <div className="glow-ambient bg-purple-500/5 w-80 h-80 bottom-10 right-10"></div>

      <div className="mx-auto max-w-5xl relative z-10">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-primary dark:text-white tracking-tight">
            Welcome back, {user.name} {user.avatar}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your CBSE study plans and spaced repetitions.
          </p>
        </div>

        {/* Top row: Daily Goal + Streak Info */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          
          {/* Daily Goal Card */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-poppins text-sm font-bold text-slate-700 dark:text-slate-200">
                Today's Learning Goal
              </h3>
              <span className="text-xs font-semibold text-slate-550 dark:text-slate-400">
                {todayQuestionsAnswered} / {dailyGoal} questions solved
              </span>
            </div>
            {/* Progress track */}
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2 font-medium">
              {goalPercent >= 100 
                ? "🎉 Daily goal accomplished! Keep active recalling to solidify memories." 
                : `Solve ${dailyGoal - todayQuestionsAnswered} more questions today to complete your daily revision goal.`}
            </p>
          </div>

          {/* Streak details */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              streak > 0 
                ? 'bg-orange-500/10 text-orange-500 animate-pulse' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
            }`}>
              <Flame className={`h-6 w-6 ${streak > 0 ? 'fill-orange-500' : ''}`} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Active Streak
              </div>
              <span className="font-poppins text-xl font-black text-primary dark:text-white mt-1 block">
                {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>

        </div>

        {/* Main Columns Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Left Columns: Main Cards (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Smart Recommendation Card */}
            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-accent/20 bg-gradient-to-r from-accent/5 to-accent-hover/10 p-6 shadow-sm relative overflow-hidden dark:border-accent/40"
              >
                <div className="absolute top-0 right-0 p-4 text-accent opacity-15">
                  <Zap className="h-24 w-24 fill-accent" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-black text-accent dark:bg-accent/20 uppercase tracking-widest">
                    Study Recommendation
                  </span>
                </div>

                <h3 className="font-poppins text-lg font-black text-primary dark:text-white flex items-center gap-2">
                  <span>{recommendation.emoji}</span>
                  {recommendation.chapterName}
                </h3>
                <p className="text-xs text-slate-650 dark:text-slate-350 mt-1 max-w-lg">
                  {recommendation.reason}
                </p>

                <button
                  onClick={() => handleStartQuiz(recommendation.subjectId, recommendation.chapterId)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent/20 transition hover:scale-102"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Practice Now
                </button>
              </motion.div>
            )}

            {/* Continue Learning card */}
            {lastAttempt ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Continue Learning
                  </span>
                  <h4 className="font-poppins font-bold text-primary dark:text-white text-base">
                    {lastAttempt.emoji} {lastAttempt.chapterName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lastAttempt.subjectName} chapter
                  </p>
                </div>
                <button
                  onClick={() => handleStartQuiz(lastAttempt.subjectId, lastAttempt.chapterId)}
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-550 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 transition shrink-0"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800 bg-white dark:bg-card-dark">
                <p className="text-sm font-bold text-slate-550 dark:text-slate-400">Welcome to CBSE Recall!</p>
                <p className="text-xs text-slate-400 mt-0.5">Explore subjects to start your first quiz and generate revision loops.</p>
                <button 
                  onClick={() => navigate('/subjects')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Browse Subjects
                </button>
              </div>
            )}

            {/* Quick Subjects access grid */}
            <div>
              <h3 className="font-poppins text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
                Course Subjects
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {subjects.map(sub => (
                  <div 
                    key={sub.id}
                    onClick={() => navigate(`/subject/${sub.id}`)}
                    className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-accent hover:shadow-md transition dark:border-slate-800 dark:bg-card-dark dark:hover:border-accent"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sub.emoji}</span>
                      <div>
                        <h4 className="font-poppins font-bold text-primary dark:text-white text-sm group-hover:text-accent transition-colors">
                          {sub.name}
                        </h4>
                        <span className="text-[10px] text-slate-450 dark:text-slate-550 block">
                          {sub.chapters.length} Topics
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Spaced Repetition + Weak Areas */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Spaced Repetition Queue status */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
              <h3 className="font-poppins text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5">
                Spaced Repetition
              </h3>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-poppins text-2xl font-black text-primary dark:text-white">
                    {dueCount}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Questions due for revision today
                  </span>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <RotateCcw className="h-5 w-5" />
                </div>
              </div>

              <button
                disabled={dueCount === 0}
                onClick={() => { playSFX('click'); navigate('/revision'); }}
                className={`w-full rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  dueCount === 0 
                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed' 
                    : 'bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20'
                }`}
              >
                <Zap className="h-4.5 w-4.5 fill-current" />
                Review Due Cards
              </button>
            </div>

            {/* Weak Chapters lists */}
            {weakChapters.length > 0 && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
                <h3 className="font-poppins text-xs font-black text-rose-500 uppercase tracking-widest mb-3.5">
                  Needs Focus (Low Accuracy)
                </h3>

                <div className="space-y-3.5">
                  {weakChapters.map(ch => (
                    <div 
                      key={ch.chapterId}
                      onClick={() => handleStartQuiz(ch.subjectId, ch.chapterId)}
                      className="cursor-pointer group flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-850"
                    >
                      <div className="max-w-[70%]">
                        <h4 className="font-bold text-xs text-primary dark:text-white truncate group-hover:text-accent transition-colors">
                          {ch.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block uppercase">CBSE Topic</span>
                      </div>
                      <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        {ch.accuracy}% Acc
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent activity list */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
              <h3 className="font-poppins text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5">
                Timeline activity
              </h3>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 4).map(act => (
                    <div key={act.id} className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      <span className="font-bold text-primary dark:text-white block">
                        {act.text}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 leading-normal">
                  No activity logged yet.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
