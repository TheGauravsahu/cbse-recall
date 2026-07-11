import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../../utils/sound';
import { useProgressStore } from '../../stores/progressStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { ACHIEVEMENTS_LIST, useAchievementStore } from '../../stores/achievementStore';
import { subjects } from '../../data/subjects';
import { 
  Trophy, 
  Flame, 
  Award, 
  Clock, 
  Target, 
  ArrowLeft,
  Lock,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProfilePanel() {
  const navigate = useNavigate();
  
  // Stores
  const { xp, level, streak, recentActivity } = useProgressStore();
  const { attempts } = useHistoryStore();
  const { unlockedAchievements } = useAchievementStore();
  const { practiceHeatmap, responseTimes, accuracyHistory, difficultySolves } = useAnalyticsStore();

  const handleBackClick = () => {
    playSFX('click');
    navigate('/dashboard');
  };

  // 1. Math counters
  const totalQuestionsAttempted = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const overallAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalCorrect / totalQuestionsAttempted) * 100) 
    : 0;

  // 2. Compute Average Response Times per subject
  const getAverageResponseTimes = () => {
    const data = [];
    Object.entries(responseTimes).forEach(([subId, times]) => {
      const subDef = subjects.find(s => s.id === subId);
      if (subDef && times.length > 0) {
        const avg = Math.round(times.reduce((sum, t) => sum + t, 0) / times.length);
        data.push({
          subjectName: subDef.name,
          avgSeconds: avg,
          emoji: subDef.emoji,
          color: subDef.color
        });
      }
    });
    return data;
  };
  const avgResponseData = getAverageResponseTimes();

  // 3. Render Custom SVG Line Chart for Accuracy History
  const renderAccuracyLineChart = () => {
    if (accuracyHistory.length < 2) {
      return (
        <div className="flex h-32 items-center justify-center text-xs text-slate-400">
          Complete at least 2 quizzes to plot accuracy timeline
        </div>
      );
    }

    const width = 450;
    const height = 120;
    const padding = 10;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = accuracyHistory.map((item, idx) => {
      const x = padding + (idx / (accuracyHistory.length - 1)) * chartWidth;
      const y = padding + chartHeight - (item.accuracy / 100) * chartHeight;
      return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    return (
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 text-accent">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={padding + chartHeight/2} x2={width - padding} y2={padding + chartHeight/2} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={padding + chartHeight} x2={width - padding} y2={padding + chartHeight} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="3" />
          
          {/* Chart line path */}
          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Points circles */}
          {accuracyHistory.map((item, idx) => {
            const x = padding + (idx / (accuracyHistory.length - 1)) * chartWidth;
            const y = padding + chartHeight - (item.accuracy / 100) * chartHeight;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="4.5"
                className="fill-white stroke-accent dark:fill-card-dark"
                strokeWidth="2.5"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // 4. Render GitHub-style Practice Heatmap (Last 12 weeks = 84 days)
  const renderHeatmap = () => {
    const days = 84;
    const cells = [];
    const now = new Date();
    
    // Create list of dates chronologically from 84 days ago to today
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = practiceHeatmap[dateStr] || 0;
      cells.push({ dateStr, count });
    }

    return (
      <div className="grid grid-flow-col grid-rows-7 gap-1 max-w-full overflow-x-auto pb-2 scrollbar-none">
        {cells.map((cell, idx) => {
          let cellColor = "bg-slate-100 dark:bg-slate-800/80";
          if (cell.count > 0) {
            if (cell.count <= 2) cellColor = "bg-accent/20 text-accent";
            else if (cell.count <= 5) cellColor = "bg-accent/50 text-white";
            else cellColor = "bg-accent text-white";
          }

          return (
            <div
              key={idx}
              title={`${cell.dateStr}: ${cell.count} questions answered`}
              className={`w-3.5 h-3.5 heatmap-cell rounded-[2.5px] ${cellColor}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back button */}
      <div className="mx-auto max-w-5xl mb-6">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
        
        {/* Left Column: Streaks & Levels */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Level details */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm text-center dark:border-slate-800 dark:bg-card-dark">
            <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent to-accent-hover text-white shadow-lg shadow-accent/20">
              <Trophy className="h-10 w-10 text-white" />
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white border-2 border-white dark:border-card-dark">
                {level}
              </div>
            </div>
            
            <h2 className="font-poppins text-lg font-extrabold text-primary dark:text-white">
              CBSE Scholar
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
              Total XP points: <span className="font-bold text-accent">{xp} XP</span>
            </p>
            
            {/* Level progress */}
            <div className="text-left bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Active Level
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                You are Level {level}. Complete active recall cards to level up!
              </p>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark flex items-center gap-3.5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
              streak > 0 
                ? 'bg-orange-500/10 text-orange-500 animate-pulse' 
                : 'bg-slate-100 text-slate-450 dark:bg-slate-800'
            }`}>
              <Flame className={`h-6 w-6 ${streak > 0 ? 'fill-orange-500' : ''}`} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-primary dark:text-white text-base">
                {streak} Day Streak
              </h3>
              <span className="text-[10px] text-slate-450 dark:text-slate-550 block">
                {streak > 0 ? 'Consistency is key!' : 'Study today to log activity'}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Advanced Analytics */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Charts Row */}
          <div>
            <h2 className="font-poppins text-lg font-extrabold text-primary dark:text-white mb-4 px-1">
              Advanced Performance Analytics
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* SVG Line Graph (Accuracy) */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
                <h3 className="font-poppins text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5">
                  Quiz Accuracy Curve
                </h3>
                {renderAccuracyLineChart()}
              </div>

              {/* Response times list */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
                <h3 className="font-poppins text-xs font-black text-slate-400 uppercase tracking-widest mb-3.5">
                  Solve Speed (Seconds)
                </h3>
                {avgResponseData.length > 0 ? (
                  <div className="space-y-4 pt-2">
                    {avgResponseData.map(item => (
                      <div key={item.subjectName}>
                        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-650 dark:text-slate-350">
                          <span>{item.emoji} {item.subjectName}</span>
                          <span className="font-bold text-accent">{item.avgSeconds}s average</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-accent transition-all`}
                            style={{ width: `${Math.min(100, (item.avgSeconds / 30) * 100)}%` }} // scale out of 30 seconds
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center text-xs text-slate-400">
                    No solve response logs recorded yet.
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* GitHub Heatmap section */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
            <h3 className="font-poppins text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Practice Heatmap (Last 12 Weeks)
            </h3>
            {renderHeatmap()}
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[9px] font-bold text-slate-400 uppercase">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[1.5px] bg-slate-100 dark:bg-slate-800/80" />
              <div className="w-2.5 h-2.5 rounded-[1.5px] bg-accent/20" />
              <div className="w-2.5 h-2.5 rounded-[1.5px] bg-accent/50" />
              <div className="w-2.5 h-2.5 rounded-[1.5px] bg-accent" />
              <span>More</span>
            </div>
          </div>

          {/* Achievements badge showcase */}
          <div>
            <h2 className="font-poppins text-lg font-extrabold text-primary dark:text-white mb-4 px-1">
              Badge & Achievements Cabinet
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ACHIEVEMENTS_LIST.map(ach => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id}
                    className={`rounded-2xl border p-4 shadow-sm flex gap-3.5 items-center transition duration-200 ${
                      isUnlocked 
                        ? 'bg-accent/5 border-accent/20' 
                        : 'bg-slate-50 border-slate-150 dark:bg-slate-900/30 dark:border-slate-850/80 opacity-60'
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                      isUnlocked ? 'bg-accent text-white' : 'bg-slate-200 text-slate-450 dark:bg-slate-800'
                    }`}>
                      {isUnlocked ? ach.icon : <Lock className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-poppins text-sm font-extrabold text-primary dark:text-white leading-snug">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
