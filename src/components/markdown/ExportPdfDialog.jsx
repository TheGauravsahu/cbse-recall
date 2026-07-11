import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import NotesPdfDocument from '../../features/notes/pdf/NotesPdfDocument';
import { X, FileDown, CheckCircle, Loader2 } from 'lucide-react';
import { playSFX } from '../../utils/sound';

export default function ExportPdfDialog({ 
  isOpen, 
  onClose, 
  metadata, 
  markdown, 
  highlights, 
  personalNotes 
}) {
  const [includeHighlights, setIncludeHighlights] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'LETTER'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [pdfTheme, setPdfTheme] = useState('light'); // 'light' | 'dark'
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    playSFX('click');
    setIsGenerating(true);

    try {
      const options = {
        includeHighlights,
        includeNotes,
        paperSize,
        orientation,
        theme: pdfTheme
      };

      const doc = (
        <NotesPdfDocument
          metadata={metadata}
          markdown={markdown}
          highlights={includeHighlights ? highlights : []}
          personalNotes={includeNotes ? personalNotes : []}
          options={options}
        />
      );

      // Render document to blob asynchronously
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      
      const cleanTitle = metadata.title.toLowerCase().replace(/\s+/g, '-');
      const filename = `cbse-recall-${cleanTitle}-notes.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      playSFX('success');
      onClose();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition dark:border-slate-800 dark:bg-card-dark animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FileDown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-poppins text-base font-extrabold text-slate-800 dark:text-white">
                PDF Export Settings
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Customize your offline document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-white cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Options Content */}
        <div className="my-6 flex flex-col gap-5">
          
          {/* Checkboxes: Extra Sections */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Include Personal Additions
            </span>
            
            <label className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-850/30 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHighlights}
                onChange={(e) => setIncludeHighlights(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-350 text-accent focus:ring-accent/20 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-200">My Color Highlights</span>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Include any colored markers you drew on text.</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-slate-850/30 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-350 text-accent focus:ring-accent/20 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-750 dark:text-slate-200">My Personal Sticky Notes</span>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Append your custom sticky memos in a separate section.</p>
              </div>
            </label>
          </div>

          {/* Grid: Paper settings */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Paper Size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Paper Size
              </label>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:border-accent"
              >
                <option value="A4">A4 (Standard)</option>
                <option value="LETTER">Letter (US)</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:border-accent"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            {/* PDF Color Theme */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                PDF Theme Mode
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPdfTheme('light')}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold border transition cursor-pointer ${
                    pdfTheme === 'light'
                      ? 'border-accent bg-accent/5 text-accent dark:border-accent dark:text-accent-hover'
                      : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  ☀️ Light Mode (Printer Friendly)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfTheme('dark')}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold border transition cursor-pointer ${
                    pdfTheme === 'dark'
                      ? 'border-accent bg-accent/5 text-accent dark:border-accent dark:text-accent-hover'
                      : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  🌙 Dark Mode (Night Study)
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="rounded-xl border border-slate-250 px-4 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
