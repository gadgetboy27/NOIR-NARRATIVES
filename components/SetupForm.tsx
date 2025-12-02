import React, { useState } from 'react';
import { StoryContext } from '../types';

interface SetupFormProps {
  onStart: (context: StoryContext) => void;
  isGenerating: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart, isGenerating }) => {
  const [formData, setFormData] = useState<StoryContext>({
    characterName: 'John Constantine',
    characterDescription: 'A cynical, chain-smoking occult detective in a trench coat. Blonde messy hair.',
    plotSummary: 'Investigating a deal gone wrong with a minor demon in a London pub.',
    artStyle: 'Gritty Noir, high contrast, ink heavy, muted colors with neon accents'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-zinc-900 border-2 border-zinc-700 shadow-2xl relative">
       {/* Decorative tape effect */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-600/80 rotate-1 shadow-sm"></div>

      <h2 className="text-3xl text-center text-white comic-title mb-6 tracking-wide">
        Create Your Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-zinc-400 text-sm font-bold mb-1 uppercase tracking-wider">Protagonist Name</label>
          <input 
            type="text" 
            name="characterName"
            value={formData.characterName}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-600 p-2 text-white font-mono focus:border-red-500 outline-none"
            placeholder="e.g. Space Marine Titus"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm font-bold mb-1 uppercase tracking-wider">Character Description</label>
          <input 
            type="text" 
            name="characterDescription"
            value={formData.characterDescription}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-600 p-2 text-white font-mono focus:border-red-500 outline-none"
            placeholder="Appearance details..."
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm font-bold mb-1 uppercase tracking-wider">Plot / Premise</label>
          <textarea 
            name="plotSummary"
            value={formData.plotSummary}
            onChange={handleChange}
            rows={3}
            className="w-full bg-black border border-zinc-600 p-2 text-white font-mono focus:border-red-500 outline-none resize-none"
            placeholder="What happens in this story?"
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm font-bold mb-1 uppercase tracking-wider">Art Style</label>
          <input 
            type="text" 
            name="artStyle"
            value={formData.artStyle}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-600 p-2 text-white font-mono focus:border-red-500 outline-none"
            placeholder="e.g. Cyberpunk, Watercolor, Horror"
            disabled={isGenerating}
          />
        </div>

        <button 
          type="submit"
          disabled={isGenerating}
          className={`
            w-full py-3 mt-4 text-xl font-bold uppercase tracking-widest border-2 
            transition-all duration-200
            ${isGenerating 
              ? 'bg-zinc-800 border-zinc-600 text-zinc-500 cursor-not-allowed' 
              : 'bg-red-900 border-red-600 text-white hover:bg-red-800 hover:scale-[1.02] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]'
            }
          `}
        >
          {isGenerating ? 'Drafting Script...' : 'Start Story'}
        </button>
      </form>
    </div>
  );
};

export default SetupForm;