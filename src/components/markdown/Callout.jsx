import React from 'react';
import { AlertCircle, Lightbulb, Brain, BookOpen, Sparkles, XCircle } from 'lucide-react';

const CALLOUT_TYPES = {
  Important: {
    icon: AlertCircle,
    emoji: '⚠️',
    title: 'Important',
    bg: 'bg-amber-50/70 border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/60',
    text: 'text-amber-800 dark:text-amber-300',
    titleColor: 'text-amber-900 dark:text-amber-200'
  },
  Remember: {
    icon: Brain,
    emoji: '🧠',
    title: 'Remember',
    bg: 'bg-indigo-50/70 border-indigo-250 dark:bg-indigo-950/20 dark:border-indigo-900/60',
    text: 'text-indigo-800 dark:text-indigo-300',
    titleColor: 'text-indigo-900 dark:text-indigo-200'
  },
  'Exam Tip': {
    icon: Lightbulb,
    emoji: '💡',
    title: 'Exam Tip',
    bg: 'bg-emerald-50/70 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900/60',
    text: 'text-emerald-800 dark:text-emerald-300',
    titleColor: 'text-emerald-900 dark:text-emerald-200'
  },
  Formula: {
    icon: BookOpen,
    emoji: '📘',
    title: 'Formula',
    bg: 'bg-blue-50/70 border-blue-250 dark:bg-blue-950/20 dark:border-blue-900/60',
    text: 'text-blue-800 dark:text-blue-300',
    titleColor: 'text-blue-900 dark:text-blue-200'
  },
  Trick: {
    icon: Sparkles,
    emoji: '✨',
    title: 'Trick',
    bg: 'bg-cyan-50/70 border-cyan-250 dark:bg-cyan-950/20 dark:border-cyan-900/60',
    text: 'text-cyan-800 dark:text-cyan-300',
    titleColor: 'text-cyan-900 dark:text-cyan-200'
  },
  'Common Mistake': {
    icon: XCircle,
    emoji: '❌',
    title: 'Common Mistake',
    bg: 'bg-rose-50/70 border-rose-250 dark:bg-rose-950/20 dark:border-rose-900/60',
    text: 'text-rose-800 dark:text-rose-300',
    titleColor: 'text-rose-900 dark:text-rose-200'
  }
};

export default function Callout({ type, children }) {
  const config = CALLOUT_TYPES[type] || CALLOUT_TYPES['Important'];
  const IconComponent = config.icon;

  return (
    <div className={`my-6 flex gap-4 rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${config.bg}`}>
      <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <IconComponent className={`h-5.5 w-5.5 ${config.text}`} />
      </div>
      <div className="flex-1">
        <h4 className={`font-poppins text-sm font-extrabold uppercase tracking-wider mb-1 ${config.titleColor}`}>
          {config.emoji} {config.title}
        </h4>
        <div className={`text-sm leading-relaxed font-sans ${config.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
export { CALLOUT_TYPES };
