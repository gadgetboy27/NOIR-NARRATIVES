import React, { useEffect, useRef } from 'react';
import { StoryPage } from '../types';

interface ComicPanelProps {
  page: StoryPage;
  isActive: boolean;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ page, isActive }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  return (
    <div 
      ref={scrollRef}
      className={`
        w-full max-w-2xl mx-auto mb-12 p-4 bg-zinc-900 border-4 border-zinc-800 shadow-2xl relative
        transition-opacity duration-700
        ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95 grayscale'}
      `}
    >
      {/* Visual Panel */}
      <div className="relative aspect-square w-full overflow-hidden border-2 border-black bg-black">
        <img 
          src={page.imageUrl} 
          alt={page.visualDescription}
          className="w-full h-full object-cover"
        />
        
        {/* Comic Texture Overlay (Optional Scanlines/Noise) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      {/* Narrative Caption Box */}
      <div className="mt-4 bg-[#fffff0] text-black p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
        <p className="text-lg md:text-xl font-bold uppercase leading-tight tracking-wide">
          {page.narrative}
        </p>
      </div>

      {/* Page Number / Turn Marker */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-red-700 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10">
         <span className="text-white font-bold text-xs">{page.id.split('-')[1]}</span>
      </div>
    </div>
  );
};

export default ComicPanel;
