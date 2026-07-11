import React, { useState } from 'react';
import { useNotesStore } from '../../stores/notesStore';
import { Plus, Trash2, Edit2, Check, X, FileText } from 'lucide-react';

export default function PersonalNotes({ subjectId, chapterId, activeSectionId }) {
  const { personalNotes, addPersonalNote, updatePersonalNote, removePersonalNote } = useNotesStore();
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const chapterNotes = personalNotes.filter(
    (n) => n.subjectId === subjectId && n.chapterId === chapterId
  );

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addPersonalNote(subjectId, chapterId, newNoteText, activeSectionId || 'General');
    setNewNoteText('');
  };

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    updatePersonalNote(id, editingText);
    setEditingNoteId(null);
    setEditingText('');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-card-dark">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
        <FileText className="h-5 w-5 text-accent" />
        <h3 className="font-poppins text-sm font-extrabold text-slate-850 dark:text-slate-100 uppercase tracking-wider">
          Personal Sticky Notes
        </h3>
      </div>

      {/* Add New Note */}
      <form onSubmit={handleAddNote} className="mb-6">
        <div className="flex flex-col gap-2">
          <textarea
            placeholder={
              activeSectionId 
                ? `Add note to section "${activeSectionId.replace(/-/g, ' ')}"...`
                : "Add a general chapter note..."
            }
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-accent dark:focus:bg-card-dark"
          />
          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent py-2 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Note
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="flex flex-col gap-4">
        {chapterNotes.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4">
            No notes added yet. Double-click or select text/sections to note down formulas or definitions.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-1">
            {chapterNotes.map((note) => {
              const isEditing = editingNoteId === note.id;

              return (
                <div
                  key={note.id}
                  className="relative rotate-[-0.5deg] border border-yellow-200 bg-yellow-50/70 p-4 shadow-sm transition hover:scale-101 hover:shadow-md dark:border-yellow-900/40 dark:bg-yellow-950/10 rounded-xl"
                >
                  {/* Sticky note tape look */}
                  <div className="absolute top-[-8px] left-1/2 h-3.5 w-12 -translate-x-1/2 bg-yellow-100/80 border-b border-yellow-250/30 dark:bg-yellow-900/30" />

                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-yellow-700/80 dark:text-yellow-600">
                    <span className="truncate max-w-[120px]">
                      📍 {note.sectionId ? note.sectionId.replace(/-/g, ' ') : 'General'}
                    </span>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-yellow-300 bg-white p-2 text-xs text-slate-800 outline-none dark:border-yellow-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-600 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-300 text-slate-700 transition hover:bg-slate-400 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-poppins text-xs leading-relaxed text-slate-750 dark:text-slate-200 whitespace-pre-wrap">
                        {note.text}
                      </p>
                      
                      <div className="mt-3 flex justify-end gap-2 border-t border-yellow-200/40 pt-2 text-[10px] text-yellow-700/80 dark:text-yellow-600">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => removePersonalNote(note.id)}
                          className="flex items-center gap-0.5 text-rose-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
