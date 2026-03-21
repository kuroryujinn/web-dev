import React, { useEffect, useMemo, useState } from 'react';

const AnswerTile = ({ option, onSelect, isSelected, isCorrect, showResult }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [option.image, option.label]);

  const getStatusClasses = () => {
    if (!showResult) {
      return isSelected 
        ? 'glass-morphism border-cyan-400 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.4)] scale-105' 
        : 'glass-morphism border-white/10 text-slate-400 hover:border-cyan-500/50 hover:bg-white/10';
    }
    
    if (option.correct || isCorrect) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105 ring-8 ring-emerald-500/20';
    }
    
    if (isSelected && !option.correct) {
      return 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.4)] opacity-50 grayscale';
    }
    
    return 'opacity-20 grayscale blur-[2px] scale-95';
  };

  return (
    <button
      className={`group relative flex flex-row items-center justify-start p-8 md:p-12 rounded-3xl border-[4px] transition-all duration-500 w-full overflow-hidden ${getStatusClasses()}`}
      onClick={!showResult ? onSelect : undefined}
      disabled={showResult}
    >
      {/* Background Neon Pulse */}
      {!showResult && (
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      )}
      
      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 flex items-center justify-center bg-transparent rounded-2xl mr-10 overflow-hidden relative z-10">
        {imageFailed ? (
          <span className="text-4xl md:text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] grayscale contrast-150">🖼️</span>
        ) : (
          <img
            src={option.image}
            alt={option.label}
            className={`w-full h-full object-contain p-2 md:p-4 transition-all duration-700 
              ${!showResult ? 'group-hover:scale-110 brightness-75 group-hover:brightness-125' : 'brightness-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]'}
              ${showResult && !isCorrect ? 'grayscale opacity-50' : 'invert-[0.1]'}`}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      
      <span className="text-2xl md:text-4xl font-black uppercase tracking-[0.1em] relative z-10 drop-shadow-lg text-left whitespace-nowrap overflow-hidden text-ellipsis pr-12">
        {option.label}
      </span>

      {showResult && (option.correct || isCorrect) && (
        <div className="absolute top-1/2 -translate-y-1/2 right-10 text-emerald-400 animate-pulse">
           <div className="w-8 h-8 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,1)]"></div>
        </div>
      )}
    </button>
  );
};

export default AnswerTile;
