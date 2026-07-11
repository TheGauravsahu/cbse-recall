import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { subjects } from '../data/subjects';
import { useNotesStore } from '../stores/notesStore';
import { useReadingStore } from '../stores/readingStore';
import { useBookmarksStore } from '../stores/bookmarksStore';
import { useHighlightsStore } from '../stores/highlightsStore';
import { playSFX } from '../utils/sound';

import NoteToolbar from '../components/markdown/NoteToolbar';
import MarkdownRenderer from '../components/markdown/MarkdownRenderer';
import TableOfContents from '../components/markdown/TableOfContents';
import ReadingStats from '../components/markdown/ReadingStats';
import PersonalNotes from '../components/markdown/PersonalNotes';
import HighlightMenu from '../components/markdown/HighlightMenu';
import ExportPdfDialog from '../components/markdown/ExportPdfDialog';

import { 
  getNoteRawContent, 
  searchNotes, 
  parseFrontmatter 
} from '../features/notes/search/SearchIndex';

import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Search, 
  Settings, 
  Menu, 
  SidebarClose, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function NotesViewer() {
  const { subjectId: routeSubjectId, chapterId: routeChapterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State Stores
  const { 
    currentSubjectId, 
    currentChapterId, 
    setCurrentSubjectAndChapter, 
    updateReadingHistory, 
    readingHistory,
    personalNotes
  } = useNotesStore();
  
  const { 
    scrollProgress, 
    setScrollProgress, 
    readingTime, 
    incrementReadingTime, 
    resetReadingSession, 
    readingMode, 
    activeSectionId,
    setCompleted 
  } = useReadingStore();

  const { highlights, addHighlight } = useHighlightsStore();

  // Route fallback / redirect
  const subjectId = routeSubjectId || currentSubjectId || 'maths';
  const chapterId = routeChapterId || currentChapterId || 'trigonometry';

  // Component UI State
  const [markdown, setMarkdown] = useState('');
  const [metadata, setMetadata] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  
  // Highlight Menu coordinates
  const [highlightMenuVisible, setHighlightMenuVisible] = useState(false);
  const [selectionPosition, setSelectionPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  
  // Dialog Open states
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Sidebar expanded subjects
  const [expandedSubjects, setExpandedSubjects] = useState({ [subjectId]: true });

  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  // Load notes content on subject/chapter change
  useEffect(() => {
    resetReadingSession();
    setCurrentSubjectAndChapter(subjectId, chapterId);

    const raw = getNoteRawContent(subjectId, chapterId);
    if (raw) {
      const { metadata: parsedMeta, content: parsedContent } = parseFrontmatter(raw);
      setMetadata(parsedMeta);
      setMarkdown(parsedContent);
    } else {
      // Notes coming soon template
      setMetadata({
        title: 'Revision Notes Coming Soon',
        subject: subjects.find(s => s.id === subjectId)?.name || 'Subject',
        chapter: chapterId,
        difficulty: 'Easy',
        class: 10,
        estimatedTime: '5 minutes',
        questions: 0
      });
      setMarkdown(`
# Revision Notes Coming Soon!

We are currently preparing detailed offline notes for **${chapterId.replace(/_/g, ' ')}**. 

In the meantime, you can:
- Attempt the chapter quiz directly to test your active recall.
- Navigate to other chapters under this subject.
- Request this notes file in the community dashboard.

> Formula
> Keep studying, persistence is the key to unlocking your full potential!
      `);
    }
  }, [subjectId, chapterId]);

  // Scroll & Glow effect for URL hashes (Verify in Notes feature)
  useEffect(() => {
    const hash = location.hash;
    if (hash && markdown) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Apply amber highlight glow effects
          element.classList.add('bg-amber-500/10', 'border-amber-400', 'px-3', 'py-1', 'rounded-xl', 'animate-pulse');
          
          const clearTimer = setTimeout(() => {
            element.classList.remove('bg-amber-500/10', 'border-amber-400', 'px-3', 'py-1', 'rounded-xl', 'animate-pulse');
          }, 3500);
          
          return () => clearTimeout(clearTimer);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.hash, markdown]);

  // Session Time Tracker
  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        incrementReadingTime();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementReadingTime]);

  // Handle Scroll Progress & Completion (Throttled for buttery smooth rendering)
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    const rounded = Math.min(100, Math.max(0, Math.round(progress)));

    // Directly update the progress bar DOM width to avoid React render cycle latency
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${rounded}%`;
    }

    // Only update react state when scroll change is significant to avoid heavy re-renders
    if (Math.abs(rounded - scrollProgress) >= 3 || rounded === 0 || rounded === 100) {
      setScrollProgress(rounded);

      if (rounded >= 90) {
        setCompleted(true);
        updateReadingHistory(subjectId, chapterId, { completed: true });
      }
      updateReadingHistory(subjectId, chapterId, { lastPosition: el.scrollTop });
    }
  };

  // Selection highlighting menu
  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    const selectedStr = selection.toString().trim();
    
    if (selectedStr && containerRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setSelectionPosition({
        x: rect.left - containerRect.left + (rect.width / 2),
        y: rect.top - containerRect.top + containerRef.current.scrollTop
      });
      setSelectedText(selectedStr);
      setHighlightMenuVisible(true);
    } else {
      setHighlightMenuVisible(false);
    }
  };

  const handleApplyHighlight = (color) => {
    playSFX('click');
    addHighlight(subjectId, chapterId, selectedText, color, activeSectionId || 'General');
    window.getSelection()?.removeAllRanges();
    setHighlightMenuVisible(false);
  };

  // Keyboard shortcut listener (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Run offline search
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      const results = searchNotes(val);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (subId, chapId) => {
    playSFX('click');
    setSearchModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/notes/${subId}/${chapId}`);
  };

  const toggleSubjectExpanded = (subId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Revision mode fonts styling
  const contentFontSizeClass = 
    readingMode === 'revision' 
      ? 'prose-xl text-slate-900 dark:text-slate-100 font-medium' 
      : 'prose-sm text-slate-705 dark:text-slate-300';

  const isFocusMode = readingMode === 'focus';

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      
      {/* Dynamic Note Toolbar Header with high-performance progress bar */}
      <div className="relative shrink-0">
        <NoteToolbar
          subjectId={subjectId}
          chapterId={chapterId}
          chapterName={metadata.title || chapterId}
          onPdfTrigger={() => setPdfDialogOpen(true)}
          onSearchTrigger={() => setSearchModalOpen(true)}
        />
        {/* Reading Progress Animated Bar (DOM ref updates on scroll) */}
        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full dark:bg-slate-900 z-50">
          <div 
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative min-h-0">
        
        {/* 1. Left Sidebar - Subjects Accordion (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <aside className={`w-64 h-full min-h-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-card-dark flex flex-col transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-30 h-full'
          } md:relative md:translate-x-0`}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Chapters Index</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
                       <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 min-h-0">
              {subjects.map((sub) => {
                const isExpanded = expandedSubjects[sub.id];
                const isActiveSubject = sub.id === subjectId;

                return (
                  <div key={sub.id} className="flex flex-col gap-1">
                    {/* Header Subject Accordion trigger */}
                    <button
                      onClick={() => toggleSubjectExpanded(sub.id)}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isActiveSubject
                          ? 'bg-accent/5 text-accent dark:bg-accent/10 dark:text-accent-hover'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{sub.emoji}</span>
                        <span>{sub.name}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                    </button>

                    {/* Chapters List (Docs-style vertical guideline layout. Uses direct animation height for 100% height accuracy) */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 ml-4 pl-3.5 border-l border-slate-200 dark:border-slate-800/60 mt-1">
                        {sub.chapters.map((chap) => {
                          const isCurrentChapter = chap.id === chapterId && sub.id === subjectId;
                          const history = readingHistory[`${sub.id}/${chap.id}`] || {};
                          
                          return (
                            <button
                              key={chap.id}
                              onClick={() => {
                                playSFX('click');
                                navigate(`/notes/${sub.id}/${chap.id}`);
                              }}
                              className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                                isCurrentChapter
                                  ? 'bg-accent text-white font-extrabold shadow-sm'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                              }`}
                            >
                              <span className="truncate max-w-[130px]">{chap.name}</span>
                              {history.completed && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isCurrentChapter ? 'bg-white' : 'bg-emerald-500'}`} title="Read Completed" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* 2. Middle Content Panel (Relative for Highlight positioning) */}
        <main 
          ref={containerRef}
          onScroll={handleScroll}
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
          className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 relative notes-content-container scroll-smooth"
        >
          {/* Admonition header for Revision mode */}
          {readingMode === 'revision' && (
            <div className="max-w-3xl mx-auto mb-6 rounded-2xl border border-yellow-250 bg-yellow-50/70 p-4 dark:border-yellow-900/60 dark:bg-yellow-950/20 text-xs font-bold text-yellow-800 dark:text-yellow-300">
              ⚡ Exam Revision Mode is active. Key formulas and exam boxes are highlighted, and font scaling is increased for fast reading.
            </div>
          )}

          {/* Core Notes Markdown Contents */}
          <div className={`max-w-3xl mx-auto ${contentFontSizeClass} select-text`}>
            <MarkdownRenderer
              content={markdown}
              subjectId={subjectId}
              chapterId={chapterId}
              onTextSelection={handleTextSelection}
            />

            {/* Bottom Actions: Jump back to Quiz */}
            <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="font-poppins text-base font-extrabold text-slate-800 dark:text-white">
                  Done reading the notes?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
                  Test your retention now by starting the active recall quiz.
                </p>
              </div>
              
              <button
                onClick={() => {
                  playSFX('click');
                  navigate(`/quiz/${subjectId}/${chapterId}`);
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-md hover:bg-accent-hover cursor-pointer"
              >
                <BookOpen className="h-4.5 w-4.5" />
                Attempt Quiz
              </button>
            </div>
          </div>

          {/* Floating selection highlighter tooltip */}
          <HighlightMenu
            position={selectionPosition}
            visible={highlightMenuVisible}
            onSelectColor={handleApplyHighlight}
          />
        </main>

        {/* 3. Right Sidebar - TOC, Stats, Personal Notes (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <aside className={`w-80 h-full min-h-0 border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-card-dark flex flex-col transition-all duration-300 ${
            rightSidebarOpen ? 'translate-x-0' : 'translate-x-full absolute right-0 z-30 h-full'
          } lg:relative lg:translate-x-0`}>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Study Companion</span>
              <button 
                onClick={() => setRightSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 min-h-0 no-scrollbar">
              {/* Dynamic scroll-linked TOC */}
              <TableOfContents />

              {/* Session Analytics */}
              <ReadingStats xpReward={120} />

              {/* Personal Sticky Notes */}
              <PersonalNotes
                subjectId={subjectId}
                chapterId={chapterId}
                activeSectionId={activeSectionId}
              />
            </div>
          </aside>
        )}

      </div>

      {/* Floating sidebar menu triggers (For mobile layout overlays) */}
      {!isFocusMode && (
        <div className="fixed bottom-20 left-4 z-40 md:hidden flex flex-col gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20 cursor-pointer"
            title="Index chapters"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}
      {!isFocusMode && (
        <div className="fixed bottom-20 right-4 z-40 lg:hidden flex flex-col gap-2">
          <button
            onClick={() => setRightSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20 cursor-pointer"
            title="TOC & Notes panel"
          >
            <FileText className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Export PDF settings dialog popup */}
      <ExportPdfDialog
        isOpen={pdfDialogOpen}
        onClose={() => setPdfDialogOpen(false)}
        metadata={metadata}
        markdown={markdown}
        highlights={highlights.filter(h => h.subjectId === subjectId && h.chapterId === chapterId)}
        personalNotes={personalNotes.filter(n => n.subjectId === subjectId && n.chapterId === chapterId)}
      />

      {/* 4. Instant Search Palette (Ctrl + K modal overlay) */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-card-dark"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/20">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search offline formulas, topics, concepts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-slate-850 dark:text-slate-100 outline-none"
                />
                <button
                  onClick={() => {
                    setSearchModalOpen(false);
                    setSearchQuery('');
                  }}
                  className="rounded-lg bg-slate-200/80 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                >
                  ESC
                </button>
              </div>

              {/* Search Suggestions */}
              <div className="max-h-[350px] overflow-y-auto p-3">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearchResultClick(result.subjectId, result.chapterId)}
                          className="w-full text-left rounded-2xl p-3 border border-transparent hover:border-accent/15 hover:bg-accent/5 dark:hover:bg-slate-850 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-accent dark:text-accent-hover uppercase">
                              {result.title}
                            </span>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-450 dark:bg-slate-800 rounded px-1.5 py-0.5">
                              {result.subjectId.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Snippet matched */}
                          {result.bestSnippet && (
                            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 line-clamp-1 italic font-medium">
                              "{result.bestSnippet}"
                            </p>
                          )}
                          
                          {/* Heading matched */}
                          {result.matchedHeadings.length > 0 && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              {result.matchedHeadings.map((h, i) => (
                                <span key={i} className="text-[9px] font-bold text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5">
                                  🎯 {h}
                                </span>
                              ))}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No matching notes found for "{searchQuery}"
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                    <BookOpen className="h-8 w-8 text-slate-350" />
                    <span>Search index covers formulas, complementary ratios, Satyagrahas, tenses matrix, and electrical potential formulas.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
