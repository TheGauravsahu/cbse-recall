import React from 'react';
import { Trash2 } from 'lucide-react';

const COLORS = [
  { name: 'yellow', bg: 'bg-yellow-250 hover:bg-yellow-300 border-yellow-400', label: 'Yellow' },
  { name: 'blue', bg: 'bg-blue-200 hover:bg-blue-350 border-blue-450', label: 'Blue' },
  { name: 'green', bg: 'bg-green-200 hover:bg-green-350 border-green-450', label: 'Green' },
  { name: 'pink', bg: 'bg-pink-200 hover:bg-pink-350 border-pink-450', label: 'Pink' }
];

export default function HighlightMenu({ position, onSelectColor, onClear, visible }) {
  if (!visible) return null;

  return (
    <div 
      className="absolute z-50 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%) translateY(-8px)'
      }}
    >
      <div className="flex items-center gap-1 px-1">
        {COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onSelectColor(color.name)}
            title={color.label}
            className={`h-6 w-6 rounded-full border cursor-pointer transition hover:scale-110 active:scale-95 ${color.bg}`}
          />
        ))}
      </div>
      
      {onClear && (
        <>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          <button
            onClick={onClear}
            title="Remove Highlight"
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-450 hover:bg-slate-50 hover:text-rose-500 dark:hover:bg-slate-850 cursor-pointer transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
