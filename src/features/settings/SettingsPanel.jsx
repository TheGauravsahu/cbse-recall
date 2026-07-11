import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { useThemeStore } from '../../stores/themeStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';
import { useHistoryStore } from '../../stores/historyStore';
import { useProgressStore } from '../../stores/progressStore';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useRevisionStore } from '../../stores/revisionStore';
import { useFormulaStore } from '../../stores/formulaStore';
import { playSFX } from '../../utils/sound';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Heart, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export default function SettingsPanel() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Stores
  const { 
    soundEnabled, 
    animationsEnabled, 
    survivalMode, 
    reducedMotion,
    toggleSound,
    toggleAnimations,
    toggleSurvivalMode,
    toggleReducedMotion,
    resetSettings
  } = useSettingsStore();

  const { theme, toggleTheme } = useThemeStore();
  const { clearBookmarks } = useBookmarkStore();
  const { clearHistory } = useHistoryStore();
  const { resetProgress } = useProgressStore();
  const { resetAnalytics } = useAnalyticsStore();
  const { clearRevisionQueue } = useRevisionStore();
  const { clearFormulaBookmarks } = useFormulaStore();

  const handleBackClick = () => {
    playSFX('click');
    navigate('/dashboard');
  };

  const handleResetHistory = () => {
    if (window.confirm("Are you sure you want to clear your quiz attempts history? This will delete all your statistics.")) {
      playSFX('wrong');
      clearHistory();
      resetAnalytics();
      alert("Quiz history cleared!");
    }
  };

  const handleResetBookmarks = () => {
    if (window.confirm("Are you sure you want to delete all your bookmarked questions?")) {
      playSFX('wrong');
      clearBookmarks();
      clearFormulaBookmarks();
      alert("Bookmarks cleared!");
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your total XP, levels, daily streak, and unlocked badges? This action CANNOT be undone.")) {
      playSFX('wrong');
      resetProgress();
      clearRevisionQueue();
      alert("Course progress reset!");
    }
  };

  const handleResetAll = () => {
    if (window.confirm("CRITICAL WARNING: This will completely wipe your local storage profile, resetting settings, XP, history, and bookmarks. Do you want to proceed?")) {
      playSFX('wrong');
      clearHistory();
      clearBookmarks();
      resetProgress();
      resetSettings();
      resetAnalytics();
      clearRevisionQueue();
      clearFormulaBookmarks();
      alert("All data wiped successfully! Reloading page...");
      window.location.reload();
    }
  };

  // Profile Backup Export
  const handleExportBackup = () => {
    playSFX('click');
    const backupData = {
      theme: localStorage.getItem('theme-storage'),
      settings: localStorage.getItem('settings-storage'),
      bookmarks: localStorage.getItem('bookmarks-storage'),
      history: localStorage.getItem('history-storage'),
      progress: localStorage.getItem('progress-storage'),
      analytics: localStorage.getItem('analytics-storage'),
      revision: localStorage.getItem('revision-storage'),
      formula: localStorage.getItem('formula-bookmarks-storage'),
    };
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "cbse_recall_backup_v2.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Profile Backup Import
  const handleImportClick = () => {
    playSFX('click');
    fileInputRef.current.click();
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      try {
        const parsed = JSON.parse(readerEvent.target.result);
        
        if (parsed.theme) localStorage.setItem('theme-storage', parsed.theme);
        if (parsed.settings) localStorage.setItem('settings-storage', parsed.settings);
        if (parsed.bookmarks) localStorage.setItem('bookmarks-storage', parsed.bookmarks);
        if (parsed.history) localStorage.setItem('history-storage', parsed.history);
        if (parsed.progress) localStorage.setItem('progress-storage', parsed.progress);
        if (parsed.analytics) localStorage.setItem('analytics-storage', parsed.analytics);
        if (parsed.revision) localStorage.setItem('revision-storage', parsed.revision);
        if (parsed.formula) localStorage.setItem('formula-bookmarks-storage', parsed.formula);

        playSFX('correct');
        alert("Progress imported successfully! Reloading study profile...");
        window.location.reload();
      } catch (err) {
        alert("Failed to parse file. Please upload a valid CBSE Recall backup file.");
      }
    };
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back button */}
      <div className="mx-auto max-w-2xl mb-6">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-2xl">
        <h1 className="font-poppins text-2xl font-extrabold text-primary dark:text-white mb-6">
          Settings & Preferences
        </h1>

        <div className="space-y-6">
          
          {/* General Preferences section */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark">
            <h2 className="font-poppins text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              General Preferences
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Dark mode */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-primary dark:text-slate-200">Dark Interface</h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Toggle light and dark color schemes</p>
                  </div>
                </div>
                <button
                  onClick={() => { playSFX('click'); toggleTheme(); }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    theme === 'dark' ? 'bg-accent' : 'bg-slate-200 dark:bg-slate-850'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-primary dark:text-slate-200">Sound Effects</h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Satisfying correction and success audio chimes</p>
                  </div>
                </div>
                <button
                  onClick={toggleSound}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    soundEnabled ? 'bg-accent' : 'bg-slate-200 dark:bg-slate-850'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Survival Mode */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-rose-500 dark:bg-slate-800">
                    <Heart className={`h-5 w-5 ${survivalMode ? 'fill-rose-500' : ''}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-primary dark:text-slate-200">Survival Challenge</h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Duolingo-style 5 lives model. Out of hearts = fail quiz.</p>
                  </div>
                </div>
                <button
                  onClick={() => { playSFX('click'); toggleSurvivalMode(); }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    survivalMode ? 'bg-accent' : 'bg-slate-200 dark:bg-slate-850'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    survivalMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {reducedMotion ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-primary dark:text-slate-200">Reduced Motion</h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Minimize spring card and page slide transitions</p>
                  </div>
                </div>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                    reducedMotion ? 'bg-accent' : 'bg-slate-200 dark:bg-slate-850'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </div>

          {/* Data Portability Section */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark">
            <h2 className="font-poppins text-xs font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest mb-4">
              Import & Export Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Export your study history, accumulated XP, levels, and bookmarks as a single backup file.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-card-dark dark:text-slate-350 dark:hover:bg-slate-900"
              >
                <Download className="h-4 w-4" />
                Export Profile
              </button>

              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-card-dark dark:text-slate-350 dark:hover:bg-slate-900"
              >
                <Upload className="h-4 w-4" />
                Import Backup
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportBackup} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Reset profile settings */}
          <div className="rounded-3xl border border-rose-250 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark">
            <h2 className="font-poppins text-xs font-black text-rose-500 uppercase tracking-widest mb-4">
              Reset Progress Data
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="font-bold text-xs text-slate-750 dark:text-slate-300">Clear Quiz History</h3>
                  <p className="text-[9px] text-slate-400">Clears attempts, accuracy logs, and scores</p>
                </div>
                <button 
                  onClick={handleResetHistory}
                  className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition"
                >
                  Clear History
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="font-bold text-xs text-slate-750 dark:text-slate-300">Reset Bookmarks</h3>
                  <p className="text-[9px] text-slate-400">Deletes bookmarked study items</p>
                </div>
                <button 
                  onClick={handleResetBookmarks}
                  className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition"
                >
                  Clear Bookmarks
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="font-bold text-xs text-slate-750 dark:text-slate-300">Reset Course XP</h3>
                  <p className="text-[9px] text-slate-400">Resets XP points, level, and badge unlocks</p>
                </div>
                <button 
                  onClick={handleResetProgress}
                  className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition"
                >
                  Reset Progress
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-bold text-xs text-rose-600 dark:text-rose-450">Factory Reset profile</h3>
                  <p className="text-[9px] text-slate-400">Wipes entire local storage (cannot be undone)</p>
                </div>
                <button 
                  onClick={handleResetAll}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition"
                >
                  Wipe All Data
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
