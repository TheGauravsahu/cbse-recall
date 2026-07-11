import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { playSFX } from '../../utils/sound';
import { useFormulaStore } from '../../stores/formulaStore';
import { 
  ArrowLeft, 
  Star, 
  Sparkles, 
  Eye, 
  EyeOff,
  BookOpen,
  Printer
} from 'lucide-react';

const RATIOS = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'];
const ANGLES = ['0°', '30°', '45°', '60°', '90°'];

const TRIG_TABLE = {
  sin: { '0°': '0', '30°': '1/2', '45°': '1/√2', '60°': '√3/2', '90°': '1' },
  cos: { '0°': '1', '30°': '√3/2', '45°': '1/√2', '60°': '1/2', '90°': '0' },
  tan: { '0°': '0', '30°': '1/√3', '45°': '1', '60°': '√3', '90°': '∞ (Undefined)' },
  cosec: { '0°': '∞ (Undefined)', '30°': '2', '45°': '√2', '60°': '2/√3', '90°': '1' },
  sec: { '0°': '1', '30°': '2/√3', '45°': '√2', '60°': '2', '90°': '∞ (Undefined)' },
  cot: { '0°': '∞ (Undefined)', '30°': '√3', '45°': '1', '60°': '1/√3', '90°': '0' }
};

const IDENTITIES = [
  { name: "sin² θ + cos² θ = 1", desc: "Pythagorean Identity" },
  { name: "1 + tan² θ = sec² θ", desc: "Pythagorean Identity" },
  { name: "1 + cot² θ = cosec² θ", desc: "Pythagorean Identity" },
  { name: "sin θ = 1 / cosec θ", desc: "Reciprocal Relation" },
  { name: "cos θ = 1 / sec θ", desc: "Reciprocal Relation" },
  { name: "tan θ = 1 / cot θ", desc: "Reciprocal Relation" },
  { name: "tan θ = sin θ / cos θ", desc: "Quotient Relation" },
  { name: "cot θ = cos θ / sin θ", desc: "Quotient Relation" }
];

const OTHER_FORMULAS = [
  { name: "HCF * LCM = a * b", desc: "Real Numbers Formula" },
  { name: "x = [-b ± √(b² - 4ac)] / 2a", desc: "Quadratic Equation Roots" },
  { name: "a_n = a + (n - 1)d", desc: "Arithmetic Progression nth Term" },
  { name: "S_n = n/2 * [2a + (n - 1)d]", desc: "Arithmetic Progression Sum" },
  { name: "Volume of Cone = 1/3 * π * r² * h", desc: "Surface Areas & Volumes" },
  { name: "Volume of Sphere = 4/3 * π * r³", desc: "Surface Areas & Volumes" }
];

export default function FormulasCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trig_table'); // 'trig_table' | 'identities' | 'bookmarks'
  const [memoryMode, setMemoryMode] = useState(false);
  const [revealedCells, setRevealedCells] = useState({});

  const { bookmarkedFormulas, toggleFormulaBookmark, isFormulaBookmarked } = useFormulaStore();

  const handleBackClick = () => {
    playSFX('click');
    navigate('/dashboard');
  };

  const handleCellClick = (ratio, angle) => {
    if (!memoryMode) return;
    const key = `${ratio}-${angle}`;
    const wasRevealed = revealedCells[key];
    setRevealedCells(prev => ({ ...prev, [key]: !prev[key] }));
    if (!wasRevealed) playSFX('correct');
    else playSFX('click');
  };

  const handleFormulaBookmarkClick = (formulaName) => {
    playSFX('click');
    toggleFormulaBookmark(formulaName);
  };

  const allCheatFormulas = [...IDENTITIES, ...OTHER_FORMULAS];
  const bookmarkedList = allCheatFormulas.filter(f => isFormulaBookmarked(f.name));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-light dark:bg-bg-dark px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      
      {/* Back button */}
      <div className="mx-auto max-w-5xl mb-6 print:hidden">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-5xl print:hidden">
        
        {/* Title row */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-poppins text-2xl font-extrabold text-primary dark:text-white flex items-center gap-2">
              <span>📐</span>
              CBSE formula center
            </h1>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
              Interactive cheat sheets, trigonometry tables, and saved formulas.
            </p>
          </div>

          <div className="flex gap-2.5">
            {activeTab === 'trig_table' && (
              <button
                onClick={() => { playSFX('click'); setMemoryMode(!memoryMode); setRevealedCells({}); }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer ${
                  memoryMode 
                    ? 'bg-accent text-white shadow-accent/25' 
                    : 'bg-white border border-slate-200 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {memoryMode ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                <span>{memoryMode ? 'Memory Mode Active' : 'Memory Training Mode'}</span>
              </button>
            )}
            
            <button
              onClick={() => { playSFX('click'); window.print(); }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white shadow-sm cursor-pointer"
            >
              <Printer className="h-4.5 w-4.5 text-accent" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="mb-8 flex gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800 overflow-x-auto scrollbar-none print:hidden">
          <button
            onClick={() => { playSFX('click'); setActiveTab('trig_table'); }}
            className={`pb-1.5 px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'trig_table' ? 'border-accent text-accent' : 'border-transparent text-slate-500'
            }`}
          >
            Trig Ratio Grid
          </button>
          <button
            onClick={() => { playSFX('click'); setActiveTab('identities'); }}
            className={`pb-1.5 px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'identities' ? 'border-accent text-accent' : 'border-transparent text-slate-500'
            }`}
          >
            Equations & Cheat Sheets
          </button>
          <button
            onClick={() => { playSFX('click'); setActiveTab('bookmarks'); }}
            className={`pb-1.5 px-4 text-sm font-bold border-b-2 transition whitespace-nowrap ${
              activeTab === 'bookmarks' ? 'border-accent text-accent' : 'border-transparent text-slate-500'
            }`}
          >
            Saved Formulas ({bookmarkedList.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* TAB 1: TRIG TABLE */}
          {activeTab === 'trig_table' && (
            <motion.div
              key="trig"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-card-dark overflow-hidden"
            >
              {memoryMode && (
                <div className="mb-6 flex gap-2.5 rounded-2xl bg-accent/10 p-4 text-xs font-semibold text-accent dark:bg-accent/20 dark:text-accent-hover">
                  <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Interactive recall testing</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Recite the ratio value in your mind, then tap the cells to check correctness.
                    </p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
                      <th className="py-4 px-6 text-sm font-bold text-slate-400 uppercase tracking-widest text-left border-r border-slate-200 dark:border-slate-800">Ratio</th>
                      {ANGLES.map((ang, idx) => (
                        <th 
                          key={ang} 
                          className={`py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200 ${
                            idx < ANGLES.length - 1 ? 'border-r border-slate-200 dark:border-slate-800' : ''
                          }`}
                        >
                          {ang}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800/80">
                    {RATIOS.map(ratio => (
                      <tr key={ratio} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-6 text-sm font-black text-accent dark:text-accent-hover text-left capitalize border-r border-slate-100 dark:border-slate-800/60">{ratio}</td>
                        {ANGLES.map((ang, idx) => {
                          const val = TRIG_TABLE[ratio][ang];
                          const cellKey = `${ratio}-${ang}`;
                          const isRevealed = revealedCells[cellKey];

                          return (
                            <td 
                              key={ang} 
                              onClick={() => handleCellClick(ratio, ang)}
                              className={`py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-100 ${
                                idx < ANGLES.length - 1 ? 'border-r border-slate-100 dark:border-slate-800/60' : ''
                              } ${
                                memoryMode ? 'cursor-pointer select-none' : ''
                              }`}
                            >
                              {memoryMode ? (
                                <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 transition ${
                                  isRevealed 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' 
                                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                                }`}>
                                  {isRevealed ? val : '?'}
                                </span>
                              ) : (
                                <span>{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: IDENTITIES & CHEATS */}
          {activeTab === 'identities' && (
            <motion.div
              key="cheats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {allCheatFormulas.map((form, idx) => {
                const bookmarked = isFormulaBookmarked(form.name);
                return (
                  <div 
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm flex items-center justify-between dark:border-slate-800 dark:bg-card-dark"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        {form.desc}
                      </span>
                      <p className="font-poppins text-sm font-bold text-primary dark:text-white">
                        {form.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFormulaBookmarkClick(form.name)}
                      className="text-slate-400 hover:text-amber-500 transition shrink-0 ml-4"
                    >
                      <Star className={`h-5 w-5 ${bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 3: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {bookmarkedList.length > 0 ? (
                bookmarkedList.map((form, idx) => (
                  <div 
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm flex items-center justify-between dark:border-slate-800 dark:bg-card-dark"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                        {form.desc}
                      </span>
                      <p className="font-poppins text-sm font-bold text-primary dark:text-white">
                        {form.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleFormulaBookmarkClick(form.name)}
                      className="text-slate-400 hover:text-amber-500 transition shrink-0 ml-4"
                    >
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800 bg-white dark:bg-card-dark">
                  <Star className="mx-auto h-8 w-8 text-slate-350 mb-2" />
                  <p className="text-sm font-bold text-slate-550 dark:text-slate-400">No formula bookmarks saved</p>
                  <p className="text-xs text-slate-400 mt-1">Tap the star next to any equation in the list to collect them here for quick revision.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Print-only layout */}
      <div className="hidden print:block text-slate-800 bg-white p-4 max-w-3xl mx-auto">
        <div className="text-center border-b pb-2 mb-4">
          <h1 className="font-sans text-xl font-bold">CBSE Class 10 Mathematics Cheat Sheet</h1>
          <p className="text-[10px] text-slate-500 mt-0.5">Trigonometric Ratio Grids & Pythagorean Identities</p>
        </div>

        {/* 1. Trig ratios table */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-accent border-b pb-0.5">1. Trigonometric Ratios Table</h2>
          <table className="w-full text-center border-collapse border border-slate-350 text-[10px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-350">
                <th className="py-1 px-2 border border-slate-350 text-left font-bold">Ratio</th>
                {ANGLES.map(ang => (
                  <th key={ang} className="py-1 px-2 border border-slate-350 font-bold">{ang}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RATIOS.map(ratio => (
                <tr key={ratio} className="border-b border-slate-300">
                  <td className="py-1 px-2 border border-slate-350 text-left font-bold capitalize">{ratio}</td>
                  {ANGLES.map(ang => (
                    <td key={ang} className="py-1 px-2 border border-slate-350">{TRIG_TABLE[ratio][ang]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Identities */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-accent border-b pb-0.5">2. Equations & Formulas</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[...IDENTITIES, ...OTHER_FORMULAS].map((form, idx) => (
              <div key={idx} className="border-b pb-1 text-[10px]">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wide">{form.desc}</span>
                <span className="font-mono font-bold text-slate-900">{form.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-2 border-t text-[9px] text-slate-400">
          Generated via CBSE Recall Study Companion. Solidify concepts through active recall.
        </div>
      </div>

    </div>
  );
}
