import React, { useState, useEffect, useRef } from 'react';
import { generateStorySegment, generatePanelImage } from './services/geminiService';
import ComicPanel from './components/ComicPanel';
import Controls from './components/Controls';
import SetupForm from './components/SetupForm';
import ScriptReview from './components/ScriptReview';
import { StoryPage, StoryState, StoryContext, StoryDraft } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<StoryState>({
    pages: [],
    isGenerating: false,
    error: null,
    context: null,
    draft: null, // Initial draft state
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when pages change or draft appears
  useEffect(() => {
    if (bottomRef.current) {
        // Simple timeout to ensure DOM render before scroll
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [state.pages.length, state.draft]);

  const handleStartStory = async (context: StoryContext) => {
    setState(prev => ({ ...prev, context, isGenerating: true, error: null }));

    try {
      const startPrompt = "Begin the story. Establish the scene and character.";
      const storyData = await generateStorySegment([], startPrompt, context);

      // Create a draft instead of immediately rendering
      const draft: StoryDraft = {
        narrative: storyData.narrative,
        visualDescription: storyData.visual_description,
        choices: storyData.choices
      };

      setState(prev => ({
        ...prev,
        draft: draft, // Set the draft for review
        isGenerating: false,
      }));

    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: "Failed to initialize the story script. Please try again.",
      }));
    }
  };

  const handleChoice = async (choice: string) => {
    if (state.isGenerating || !state.context) return;

    // Mark choice on current page (for history context)
    const updatedPages = [...state.pages];
    if (updatedPages.length > 0) {
        updatedPages[updatedPages.length - 1].userChoice = choice;
    }
    
    setState(prev => ({ 
      ...prev, 
      pages: updatedPages,
      isGenerating: true,
      error: null
    }));

    try {
      const storyData = await generateStorySegment(updatedPages, choice, state.context);
      
      const draft: StoryDraft = {
        narrative: storyData.narrative,
        visualDescription: storyData.visual_description,
        choices: storyData.choices
      };

      setState(prev => ({
        ...prev,
        draft: draft,
        isGenerating: false,
      }));

    } catch (err) {
        console.error(err);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: "The connection to the ether was severed. Try again.",
      }));
    }
  };

  // New handler for the ScriptReview component
  const handleRenderPanel = async (finalVisualDescription: string) => {
    if (!state.context || !state.draft) return;

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
        const imageUrl = await generatePanelImage(finalVisualDescription, state.context.artStyle);

        const newPage: StoryPage = {
            id: `page-${state.pages.length + 1}`,
            narrative: state.draft.narrative,
            imageUrl: imageUrl,
            choices: state.draft.choices,
            visualDescription: finalVisualDescription, // Save the EDITED description
        };

        setState(prev => ({
            ...prev,
            pages: [...prev.pages, newPage],
            draft: null, // Clear the draft
            isGenerating: false,
        }));

    } catch (err) {
        console.error(err);
        setState(prev => ({
            ...prev,
            isGenerating: false,
            error: "Failed to ink the page. The artist is on strike.",
        }));
    }
  };

  return (
    <div className="min-h-screen pb-40 relative selection:bg-red-900 selection:text-white bg-[#0f0f0f]">
        {/* Header */}
        <header className="p-6 text-center border-b border-zinc-800 bg-[#0a0a0a] sticky top-0 z-40 shadow-xl opacity-95">
            <h1 className="text-4xl md:text-6xl text-red-700 comic-title drop-shadow-[0_2px_2px_rgba(255,0,0,0.2)]">
                NOIR NARRATIVES
            </h1>
            <p className="text-zinc-500 text-sm md:text-base mt-2 tracking-widest uppercase">
                Infinite Comic Generator
            </p>
        </header>

        {/* Content Area */}
        <main className="container mx-auto px-4 py-8">
            
            {/* Show Setup Form if no context exists */}
            {!state.context && (
               <SetupForm onStart={handleStartStory} isGenerating={state.isGenerating} />
            )}

            {/* Show Story Pages */}
            {state.context && state.pages.map((page, index) => (
                <ComicPanel 
                    key={page.id} 
                    page={page} 
                    isActive={index === state.pages.length - 1}
                />
            ))}
            
            {/* Show Script Review (Draft Mode) */}
            {state.draft && (
                <ScriptReview 
                    draft={state.draft} 
                    onConfirm={handleRenderPanel} 
                    isGenerating={state.isGenerating}
                />
            )}

            {state.error && (
                <div className="text-center text-red-500 font-bold p-4 border border-red-900 bg-red-900/10 mx-auto max-w-md mt-4">
                    {state.error}
                </div>
            )}

            {/* Loading Indicator (Text Generation Only) */}
            {state.isGenerating && !state.draft && (
                 <div className="flex flex-col items-center justify-center space-y-4 animate-pulse mt-12">
                 <div className="text-yellow-500 font-bold text-xl tracking-widest uppercase">
                   Drafting Script...
                 </div>
                 <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-600 animate-[width_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
                 </div>
               </div>
            )}

            {/* Scroll Anchor */}
            <div ref={bottomRef} />
        </main>

        {/* Sticky Controls (Only show if story has started AND we are not in draft mode) */}
        {state.context && !state.draft && state.pages.length > 0 && (
            <Controls 
                choices={state.pages[state.pages.length - 1].choices}
                onChoose={handleChoice}
                isGenerating={state.isGenerating}
            />
        )}
    </div>
  );
};

export default App;