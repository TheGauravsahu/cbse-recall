import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css'; // code blocks styling

import { Bookmark, HelpCircle } from 'lucide-react';
import { useBookmarksStore } from '../../stores/bookmarksStore';
import { useHighlightsStore } from '../../stores/highlightsStore';
import Callout from './Callout';

// Helper to extract text from React children tree
const getChildrenText = (node) => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getChildrenText).join('');
  if (node.props) return getChildrenText(node.props.children);
  return '';
};

export default function MarkdownRenderer({ content, subjectId, chapterId, onTextSelection }) {
  const { toggleSectionBookmark, isSectionBookmarked } = useBookmarksStore();
  const { highlights, removeHighlight } = useHighlightsStore();

  const chapterHighlights = highlights.filter(
    (h) => h.subjectId === subjectId && h.chapterId === chapterId
  );

  // Helper to dynamically inject highlights into text node
  const highlightText = (text) => {
    if (!text || chapterHighlights.length === 0) return text;

    const activeHighlights = chapterHighlights.filter((h) =>
      text.toLowerCase().includes(h.text.toLowerCase())
    );

    if (activeHighlights.length === 0) return text;

    // Escaping regex characters
    const escapedTexts = activeHighlights.map((h) =>
      h.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    );
    escapedTexts.sort((a, b) => b.length - a.length); // Sort descending by length

    const regex = new RegExp(`(${escapedTexts.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const matchedHl = activeHighlights.find(
        (h) => h.text.toLowerCase() === part.toLowerCase()
      );

      if (matchedHl) {
        let colorClass = 'bg-yellow-200 dark:bg-yellow-950/60 text-slate-900 dark:text-yellow-100';
        if (matchedHl.color === 'blue') colorClass = 'bg-blue-200 dark:bg-blue-950/60 text-slate-900 dark:text-blue-100';
        if (matchedHl.color === 'green') colorClass = 'bg-green-200 dark:bg-green-950/60 text-slate-900 dark:text-green-100';
        if (matchedHl.color === 'pink') colorClass = 'bg-pink-200 dark:bg-pink-950/60 text-slate-900 dark:text-pink-100';

        return (
          <mark key={i} className={`${colorClass} px-0.5 rounded-sm relative group/hl`}>
            {part}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeHighlight(matchedHl.id);
              }}
              title="Delete highlight"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/hl:flex bg-slate-950 text-white text-[9px] px-1.5 py-0.5 rounded shadow cursor-pointer whitespace-nowrap z-30"
            >
              Delete
            </button>
          </mark>
        );
      }

      return part;
    });
  };

  // Custom renderer components for react-markdown
  const components = {
    // Headings with IDs & Bookmark buttons
    h1: ({ children }) => {
      const text = getChildrenText(children);
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const bookmarked = isSectionBookmarked(subjectId, chapterId, id);

      return (
        <div className="group flex items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-6 mt-8 dark:border-slate-800">
          <h1 id={id} className="font-poppins text-2xl font-extrabold text-slate-800 dark:text-white">
            {children}
          </h1>
          <button
            onClick={() => toggleSectionBookmark(subjectId, chapterId, text, id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-accent dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition cursor-pointer"
            title={bookmarked ? "Remove Section Bookmark" : "Bookmark Section"}
          >
            <Bookmark className={`h-4.5 w-4.5 ${bookmarked ? 'fill-accent text-accent' : ''}`} />
          </button>
        </div>
      );
    },
    h2: ({ children }) => {
      const text = getChildrenText(children);
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const bookmarked = isSectionBookmarked(subjectId, chapterId, id);

      return (
        <div className="group flex items-center justify-between gap-4 mb-4 mt-6">
          <h2 id={id} className="font-poppins text-lg font-bold text-slate-850 dark:text-slate-200">
            {children}
          </h2>
          <button
            onClick={() => toggleSectionBookmark(subjectId, chapterId, text, id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-accent dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition cursor-pointer"
            title={bookmarked ? "Remove Section Bookmark" : "Bookmark Section"}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-accent text-accent' : ''}`} />
          </button>
        </div>
      );
    },
    h3: ({ children }) => {
      const text = getChildrenText(children);
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const bookmarked = isSectionBookmarked(subjectId, chapterId, id);

      return (
        <div className="group flex items-center justify-between gap-4 mb-2 mt-4">
          <h3 id={id} className="font-poppins text-sm font-extrabold text-slate-800 dark:text-slate-300">
            {children}
          </h3>
          <button
            onClick={() => toggleSectionBookmark(subjectId, chapterId, text, id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-accent dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition cursor-pointer"
            title={bookmarked ? "Remove Section Bookmark" : "Bookmark Section"}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-accent text-accent' : ''}`} />
          </button>
        </div>
      );
    },

    // Paragraph with selection listener and highlighting injector
    p: ({ children }) => {
      const text = getChildrenText(children);
      
      return (
        <p 
          className="font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-350 my-3 select-text"
          onMouseUp={(e) => onTextSelection(e, text)}
          onTouchEnd={(e) => onTextSelection(e, text)}
        >
          {/* If the paragraph children is simple text, inject highlights */}
          {typeof children === 'string' ? highlightText(children) : children}
        </p>
      );
    },

    // Custom Admonition blockquotes
    blockquote: ({ children }) => {
      const text = getChildrenText(children).trim();
      const firstWord = text.split(/[\s:\-\n]+/)[0];

      const types = ['Important', 'Remember', 'Exam Tip', 'Formula', 'Trick', 'Common Mistake'];
      const matchedType = types.find(
        (t) => text.toLowerCase().startsWith(t.toLowerCase())
      );

      if (matchedType) {
        // Strip the callout prefix text from children
        const cleanChildren = React.Children.map(children, (child) => {
          if (child && child.props && child.props.children) {
            const childText = getChildrenText(child).trim();
            if (childText.toLowerCase().startsWith(matchedType.toLowerCase())) {
              const newText = childText.substring(matchedType.length).replace(/^[\s:\-\n]+/, '');
              return React.cloneElement(child, {}, newText);
            }
          }
          return child;
        });

        return <Callout type={matchedType}>{cleanChildren}</Callout>;
      }

      return (
        <blockquote className="border-l-4 border-slate-350 pl-4 py-1 italic my-4 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {children}
        </blockquote>
      );
    },

    // Beautiful styling for lists
    ul: ({ children }) => (
      <ul className="list-disc pl-5 my-4 text-sm text-slate-700 dark:text-slate-350 flex flex-col gap-1.5">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 my-4 text-sm text-slate-700 dark:text-slate-350 flex flex-col gap-1.5">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed select-text" onMouseUp={(e) => onTextSelection(e, getChildrenText(children))}>
        {typeof children === 'string' ? highlightText(children) : children}
      </li>
    ),

    // Styled tables
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-50 dark:bg-slate-900/50">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-slate-250 bg-white dark:divide-slate-850 dark:bg-transparent">
        {children}
      </tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
        {children}
      </td>
    ),

    // Syntax Highlighted Code Blocks
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-850">
            <span>{match[1].toUpperCase()}</span>
            <button
              onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
              className="hover:text-accent cursor-pointer transition"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 bg-slate-950 overflow-x-auto text-xs m-0">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-slate-100 dark:bg-slate-850 px-1.5 py-0.5 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="notes-content-area prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
