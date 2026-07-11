import React from 'react';
import { useReadingStore } from '../../stores/readingStore';
import { useProgressStore } from '../../stores/progressStore';
import { Clock, CheckCircle2, Flame, Award } from 'lucide-react';

export default function ReadingStats({ xpReward }) {
  const { readingTime, scrollProgress, completed } = useReadingStore();
  const { streak } = useProgressStore();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
      <h3 className="font-poppins text-sm font-extrabold text-slate-850 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
        📊 Reading Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        
        {/* Time Spent */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Time Spent</span>
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {formatTime(readingTime)}
          </div>
        </div>

        {/* Completion */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Progress</span>
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {Math.round(scrollProgress)}%
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* XP Reward */}
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500 mb-1">
            <Award className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Est. XP</span>
          </div>
          <div className="text-sm font-extrabold text-accent">
            +{completed ? xpReward : Math.round((scrollProgress / 100) * xpReward)} XP
          </div>
        </div>

      </div>
    </div>
  );
}
