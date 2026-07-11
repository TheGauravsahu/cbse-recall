import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { playSFX } from '../../utils/sound';
import { 
  Compass, 
  BookOpen, 
  RotateCcw, 
  Sparkles, 
  User 
} from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const handleNavClick = () => {
    playSFX('click');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/revision', label: 'Revision', icon: RotateCcw },
    { to: '/formulas', label: 'Formulas', icon: Sparkles },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-card border-t border-slate-200/60 bg-white/90 pb-safe-bottom dark:border-slate-800/80 dark:bg-card-dark/95 shadow-lg print:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
                           (item.to === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
                isActive 
                  ? 'text-accent' 
                  : 'text-slate-450 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-350'
              }`}
            >
              <Icon className="h-5.5 w-5.5" />
              <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
