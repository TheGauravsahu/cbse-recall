import React, { useState, useEffect } from 'react';
import { useReadingStore } from '../../stores/readingStore';
import { List } from 'lucide-react';

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const { activeSectionId, setActiveSectionId } = useReadingStore();

  useEffect(() => {
    // Locate all headings in the content area
    const contentArea = document.querySelector('.notes-content-area');
    if (!contentArea) return;

    const headingElements = Array.from(contentArea.querySelectorAll('h1, h2, h3'));
    
    const parsedHeadings = headingElements.map((el, i) => {
      // Ensure element has an ID
      if (!el.id) {
        const slug = el.textContent
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        el.id = slug || `heading-${i}`;
      }
      return {
        id: el.id,
        text: el.textContent,
        level: parseInt(el.tagName.replace('H', ''), 10)
      };
    });

    setHeadings(parsedHeadings);

    // Setup intersection observer to track active section on scroll
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Trigger when heading is near the top
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [setActiveSectionId]);

  const handleHeadingClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
        <List className="h-5 w-5 text-accent" />
        <h3 className="font-poppins text-sm font-extrabold text-slate-850 dark:text-slate-100 uppercase tracking-wider">
          On This Page
        </h3>
      </div>
      
      <nav className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {headings.map((heading) => {
          const isActive = activeSectionId === heading.id;
          const indentClass = 
            heading.level === 1 ? 'pl-0 font-bold text-xs' : 
            heading.level === 2 ? 'pl-3 text-[11px] font-medium' : 
            'pl-6 text-[11px]';

          return (
            <button
              key={heading.id}
              onClick={() => handleHeadingClick(heading.id)}
              className={`w-full text-left py-1 cursor-pointer transition-colors border-l-2 pl-2 ${
                isActive
                  ? 'border-accent text-accent font-semibold dark:text-accent-hover'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
              } ${indentClass}`}
            >
              {heading.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
