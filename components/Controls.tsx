import React from 'react';

interface ControlsProps {
  choices: string[];
  onChoose: (choice: string) => void;
  isGenerating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ choices, onChoose, isGenerating }) => {
  if (choices.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-black via-zinc-900 to-transparent pb-8 pt-12 px-4 z-50">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="text-yellow-500 font-bold text-xl tracking-widest uppercase">
              Constructing Reality...
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 animate-[width_2s_ease-in-out_infinite]" style={{width: '50%'}}></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => onChoose(choice)}
                className="
                  group relative px-6 py-4 bg-zinc-800 border-2 border-zinc-600 text-zinc-100
                  hover:bg-red-900 hover:border-red-500 hover:text-white hover:scale-[1.02]
                  transition-all duration-200 ease-out uppercase font-bold tracking-wider text-sm md:text-base
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
                  active:translate-y-[2px] active:shadow-none
                "
              >
                <span className="absolute -left-2 -top-2 w-6 h-6 bg-yellow-600 text-black text-xs flex items-center justify-center font-black border border-black group-hover:bg-white group-hover:text-red-900">
                    {String.fromCharCode(65 + idx)}
                </span>
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;
