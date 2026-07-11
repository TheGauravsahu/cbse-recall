import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { playSFX } from '../utils/sound';
import { subjects } from '../data/subjects';
import { useProgressStore } from '../stores/progressStore';
import { ArrowRight, Calculator, Atom, BookOpen, Globe, BrainCircuit } from 'lucide-react';

const ICON_MAP = {
  Calculator: Calculator,
  Atom: Atom,
  BookOpen: BookOpen,
  Globe: Globe
};

export default function Landing() {
  const navigate = useNavigate();
  const { completedChapters } = useProgressStore();

  const handleStartClick = () => {
    playSFX('click');
    navigate('/dashboard');
  };

  const handleSubjectClick = (subjectId) => {
    playSFX('click');
    navigate(`/subject/${subjectId}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Background Glowing Blobs */}
      <div className="absolute rounded-full filter blur-[120px] opacity-15 bg-accent w-72 h-72 top-10 left-10 pointer-events-none z-0"></div>
      <div className="absolute rounded-full filter blur-[120px] opacity-15 bg-indigo-500 w-80 h-80 bottom-10 right-10 pointer-events-none z-0"></div>

      {/* Premium Dot Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0 text-slate-400 dark:text-slate-500" 
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
        }}
      />

      {/* Hero Section */}
      <div className="mx-auto max-w-4xl text-center pt-12 pb-16 relative z-10">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent mb-6"
        >
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span>Active Recall learning model</span>
        </motion.div>

        {/* Large Heading */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="font-poppins text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
        >
          Learn Faster Through{" "}
          <span className="text-accent">
            Interactive Quizzes
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10"
        >
          Master every single chapter of CBSE Class 10 using active recall. Don't memorize formulas, internalize concepts by playing.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={handleStartClick}
            className="group relative inline-flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent/20 transition-all hover:scale-105 hover:bg-accent-hover focus:outline-none"
          >
            Start Learning
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>

      {/* Subject Showcase Grid */}
      <div className="mx-auto max-w-6xl relative z-10 pt-8">
        <div className="text-center mb-8">
          <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Choose Your Subject
          </h2>
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-accent" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((sub, index) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            
            // Calculate progress completion percentage
            const totalChapters = sub.chapters.length;
            const completedCount = sub.chapters.filter(ch => 
              completedChapters.includes(`${sub.id}/${ch.id}`)
            ).length;
            const completionPercent = totalChapters > 0 
              ? Math.round((completedCount / totalChapters) * 100) 
              : 0;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                onClick={() => handleSubjectClick(sub.id)}
                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-card-dark dark:hover:border-accent"
              >
                {/* Subject Header */}
                <div className="mb-5 flex justify-between items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${sub.color} text-white shadow-md shadow-slate-100 dark:shadow-none`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="text-2xl">{sub.emoji}</span>
                </div>

                {/* Subject Info */}
                <h3 className="font-poppins text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-accent transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>

                {/* Progress bar */}
                <div className="mt-auto">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span>{totalChapters} {totalChapters === 1 ? 'Chapter' : 'Chapters'}</span>
                    <span className="font-bold text-accent">{completionPercent}% done</span>
                  </div>
                  
                  {/* Progress track */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-500`}
                      style={{ width: `${completionPercent}%` }}
                    />
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

// Simple Sparkles icon locally, just in case
function Sparkles({ className }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/>
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/>
    </svg>
  );
}
