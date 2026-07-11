import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../stores/themeStore';
import { useProgressStore } from '../../stores/progressStore';
import { playSFX } from '../../utils/sound';
import { searchQuestions } from '../../data/questions';
import { 
  Flame, 
  Coins, 
  Sun, 
  Moon, 
  Search, 
  User, 
  Settings, 
  BookOpen, 
  Sparkles,
  Compass,
  RotateCcw
} from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { coins, level, streak, updateStreak } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    updateStreak();
  }, []);

  const handleNavClick = () => {
    playSFX('click');
  };

  const handleThemeToggle = () => {
    playSFX('click');
    toggleTheme();
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchQuestions(query);
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (subjectId, chapterId) => {
    playSFX('click');
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/quiz/${subjectId}/${chapterId}`);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/revision', label: 'Revision', icon: RotateCcw },
    { to: '/formulas', label: 'Formulas', icon: Sparkles },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-card-dark/90 print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={handleNavClick}
          className="flex items-center gap-2.5 font-poppins text-lg font-extrabold tracking-tight text-primary transition hover:scale-102 dark:text-white"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/20">
            <img src='/favicon.svg' className="h-6 w-6" />
          </div>
          <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
            CBSE
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">Recall</span>
        </Link>

        {/* Global Search (Desktop) */}
        <div className="relative hidden max-w-xs flex-1 px-4 md:block lg:max-w-sm">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-550" />
            <input
              type="text"
              placeholder="Search equations, topics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-9 text-sm text-slate-800 outline-none transition-all focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-accent dark:focus:bg-card-dark dark:focus:ring-accent/10"
            />
          </div>
          
          {/* Search Dropdown */}
          {searchQuery && (
            <div className="absolute mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-card-dark z-50">
              {searchResults.length > 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Questions Found
                  </div>
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.subjectId, result.chapterId)}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs text-slate-650 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-850 transition"
                    >
                      <div className="font-extrabold text-accent truncate">
                        {result.tags[0]} - {result.difficulty}
                      </div>
                      <div className="truncate text-slate-500 dark:text-slate-400 mt-0.5">
                        {result.question}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching questions found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-4">
          
          {/* Stats Badges (Hidden on mobile to avoid squishing) */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Level */}
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>Lvl {level}</span>
            </div>

            {/* Streak */}
            <div 
              title={`${streak}-day streak!`}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                streak > 0 
                  ? 'bg-orange-500/10 text-orange-500' 
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}
            >
              <Flame className={`h-4 w-4 ${streak > 0 ? 'fill-orange-500' : ''}`} />
              <span>{streak}</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-yellow-400">
              <Coins className="h-4 w-4 fill-yellow-500/20 text-amber-500" />
              <span>{coins}</span>
            </div>

          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleNavClick}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-slate-550 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="rounded-xl border border-slate-200/80 p-2 text-slate-500 outline-none hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

        </div>

      </div>
    </header>
  );
}
