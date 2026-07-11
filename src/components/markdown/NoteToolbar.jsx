import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useBookmarksStore } from '../../stores/bookmarksStore';
import { useReadingStore } from '../../stores/readingStore';
import { playSFX } from '../../utils/sound';
import { 
  ArrowLeft, 
  Bookmark, 
  Sun, 
  Moon, 
  FileDown, 
  BookOpen, 
  Eye, 
  Maximize2, 
  Search, 
  Clock 
} from 'lucide-react';

export default function NoteToolbar({ 
  subjectId, 
  chapterId, 
  chapterName, 
  onPdfTrigger, 
  onSearchTrigger 
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { toggleChapterBookmark, isChapterBookmarked } = useBookmarksStore();
  const { readingMode, setReadingMode, readingTime } = useReadingStore();

  const isBookmarked = isChapterBookmarked(subjectId, chapterId);

  const handleBackClick = () => {
    playSFX('click');
    navigate(`/subject/${subjectId}`);
  };

  const handleBookmarkClick = () => {
    playSFX('click');
    toggleChapterBookmark(subjectId, chapterId);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="sticky top-[64px] z-40 w-full border-b border-slate-200 bg-white/95 py-3 shadow-sm backdrop-blur-md transition dark:border-slate-800/80 dark:bg-card-dark/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition cursor-pointer"
            title="Back to Subject Chapters"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Notes</span>
            <h2 className="font-poppins text-sm font-extrabold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[200px] sm:max-w-[300px]">
              {chapterName}
            </h2>
          </div>
        </div>

        {/* Middle Side: Reading Mode Selectors */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
          <button
            onClick={() => setReadingMode('normal')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              readingMode === 'normal'
                ? 'bg-white text-accent shadow-sm dark:bg-slate-850 dark:text-accent-hover'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Normal Mode"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Normal</span>
          </button>
          
          <button
            onClick={() => setReadingMode('focus')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              readingMode === 'focus'
                ? 'bg-white text-accent shadow-sm dark:bg-slate-850 dark:text-accent-hover'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Focus Mode"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Focus</span>
          </button>
          
          <button
            onClick={() => setReadingMode('revision')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              readingMode === 'revision'
                ? 'bg-white text-accent shadow-sm dark:bg-slate-850 dark:text-accent-hover'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Exam Revision Mode"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exam Rev</span>
          </button>
        </div>

        {/* Right Side: Search, Bookmark, PDF, Theme & Stats */}
        <div className="flex items-center gap-2">
          
          {/* Active Reading Timer */}
          <div className="hidden items-center gap-1 rounded-xl bg-slate-50 border border-slate-200/50 px-2.5 py-1.5 text-xs font-bold text-slate-500 dark:bg-slate-900/60 dark:border-slate-800 md:flex">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(readingTime)}</span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onSearchTrigger}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white transition cursor-pointer"
            title="Search Notes (Ctrl + K)"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Bookmark Toggle */}
          <button
            onClick={handleBookmarkClick}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
              isBookmarked 
                ? 'border-accent bg-accent/5 text-accent dark:border-accent dark:bg-accent/10 dark:text-accent-hover'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white'
            }`}
            title={isBookmarked ? "Bookmarked Chapter" : "Bookmark Chapter"}
          >
            <Bookmark className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-accent' : ''}`} />
          </button>

          {/* Export PDF */}
          <button
            onClick={onPdfTrigger}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:scale-103 hover:bg-accent-hover cursor-pointer"
            title="Export to PDF"
          >
            <FileDown className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
}
