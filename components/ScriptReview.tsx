import React, { useState, useEffect } from 'react';
import { StoryDraft } from '../types';

interface ScriptReviewProps {
  draft: StoryDraft;
  onConfirm: (finalVisualDescription: string) => void;
  isGenerating: boolean;
}

const ScriptReview: React.FC<ScriptReviewProps> = ({ draft, onConfirm, isGenerating }) => {
  const [visualPrompt, setVisualPrompt] = useState(draft.visualDescription);

  // Update local state if the draft changes (e.g. new generation)
  useEffect(() => {
    setVisualPrompt(draft.visualDescription);
  }, [draft]);

  const handleSubmit = () => {
    onConfirm(visualPrompt);
  };

  return (
    <div className="max-w-2xl mx-auto mb-12 p-6 bg-[#f4f1ea] text-black border-4 border-zinc-800 shadow-2xl relative rotate-1">
      {/* Paper texture visual cue */}
      <div className="absolute top-0 left-0 w-full h-8 bg-zinc-800/10 -skew-y-1 transform origin-top-left"></div>
      
      <div className="mb-4 border-b-2 border-dashed border-zinc-400 pb-2">
        <h3 className="font-bold uppercase tracking-widest text-zinc-600 text-sm">
          Script Editor // Review Phase
        </h3>
      </div>

      <div className="mb-6">
        <label className="block font-bold uppercase text-xs text-zinc-500 mb-1">
          Narrative Caption (Locked)
        </label>
        <p className="font-serif text-lg leading-relaxed italic bg-white p-3 border border-zinc-300 shadow-inner">
          "{draft.narrative}"
        </p>
      </div>

      <div className="mb-6">
        <label className="block font-bold uppercase text-xs text-zinc-800 mb-2 flex justify-between items-center">
          <span>Visual Direction (Editable)</span>
          <span className="text-[10px] bg-yellow-200 px-2 py-0.5 rounded border border-yellow-400 text-yellow-800">
            Edit Before Rendering
          </span>
        </label>
        <textarea
          value={visualPrompt}
          onChange={(e) => setVisualPrompt(e.target.value)}
          rows={4}
          disabled={isGenerating}
          className="w-full bg-white p-3 font-mono text-sm border-2 border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none shadow-inner"
        />
        <p className="text-xs text-zinc-500 mt-2">
          Tip: Add details like lighting, camera angle, or specific objects to guide the artist.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isGenerating}
        className={`
          w-full py-3 text-lg font-bold uppercase tracking-widest border-2 
          transition-all duration-200 flex items-center justify-center gap-2
          ${isGenerating 
            ? 'bg-zinc-300 border-zinc-400 text-zinc-500 cursor-not-allowed' 
            : 'bg-zinc-900 border-black text-white hover:bg-red-700 hover:scale-[1.01] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]'
          }
        `}
      >
        {isGenerating ? (
            <span>Inking Page...</span>
        ) : (
            <span>Approve & Render Panel</span>
        )}
      </button>
    </div>
  );
};

export default ScriptReview;