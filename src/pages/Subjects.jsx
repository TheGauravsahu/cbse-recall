import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../utils/sound';
import { subjects } from '../data/subjects';
import { useProgressStore } from '../stores/progressStore';
import { Calculator, Atom, BookOpen, Globe, Trophy, Star, ChevronRight, Award } from 'lucide-react';

const ICON_MAP = {
  Calculator: Calculator,
  Atom: Atom,
  BookOpen: BookOpen,
  Globe: Globe
};

export default function Subjects() {
  const navigate = useNavigate();
  const { completedChapters, xp, level, streak } = useProgressStore();

  const handleSubjectClick = (subjectId) => {
    playSFX('click');
    navigate(`/subject/${subjectId}`);
  };

  const handleDashboardClick = () => {
    playSFX('click');
    navigate('/profile');
  };

  // Calculate global completion progress
  const totalChaptersGlobal = subjects.reduce((sum, s) => sum + s.chapters.length, 0);
  const totalCompletedGlobal = completedChapters.length;
  const globalPercentage = totalChaptersGlobal > 0 
    ? Math.round((totalCompletedGlobal / totalChaptersGlobal) * 100) 
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light px-4 py-8 sm:px-6 lg:px-8 dark:bg-bg-dark">
      
      {/* Dashboard Summary Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl mb-10 overflow-hidden rounded-3xl border border-accent/20 bg-accent/5 p-6 shadow-sm md:p-8 dark:border-slate-850 dark:bg-card-dark"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-md shadow-accent/15">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-poppins text-2xl font-extrabold text-slate-800 dark:text-white">
                CBSE Study Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You are currently Level <span className="font-bold text-accent">{level}</span> with <span className="font-bold text-accent">{xp}</span> total XP points.
              </p>
            </div>
          </div>
          
          {/* Action button */}
          <button 
            onClick={handleDashboardClick}
            className="self-start md:self-center inline-flex items-center gap-1.5 rounded-xl border border-accent bg-white px-4 py-2.5 text-sm font-bold text-accent shadow-sm transition hover:bg-accent/5 dark:border-accent dark:bg-slate-900 dark:text-accent-hover dark:hover:bg-slate-800"
          >
            <Award className="h-4.5 w-4.5" />
            View Achievements
          </button>
        </div>

        {/* Global Progress Row */}
        <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
            <span>Overall Course Progress</span>
            <span>{totalCompletedGlobal} / {totalChaptersGlobal} chapters completed ({globalPercentage}%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
            <div 
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: `${globalPercentage}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="mx-auto max-w-5xl">
        <h2 className="font-poppins text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 px-1">
          Explore Subjects
        </h2>

        <div className="flex flex-col gap-5">
          {subjects.map((sub, index) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            const completedCount = sub.chapters.filter(ch => 
              completedChapters.includes(`${sub.id}/${ch.id}`)
            ).length;
            const progressPercent = Math.round((completedCount / sub.chapters.length) * 100);

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ x: 4 }}
                onClick={() => handleSubjectClick(sub.id)}
                className="group cursor-pointer rounded-2xl border border-slate-150 bg-white p-5 shadow-sm transition hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-card-dark dark:hover:border-accent"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {/* Subject Icon Box */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${sub.color} text-white shadow-sm`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sub.emoji}</span>
                        <h3 className="font-poppins text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">
                          {sub.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 pr-6">
                        {sub.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress stats */}
                  <div className="flex items-center gap-6 self-start pl-16 sm:self-center sm:pl-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Chapters
                      </div>
                      <div className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                        {completedCount} / {sub.chapters.length}
                      </div>
                    </div>

                    <div className="hidden min-w-[80px] text-right md:block">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Progress
                      </div>
                      <div className="text-sm font-extrabold text-accent">
                        {progressPercent}%
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-accent group-hover:text-white transition-colors dark:bg-slate-800 dark:group-hover:text-white">
                      <ChevronRight className="h-5 w-5" />
                    </div>
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
