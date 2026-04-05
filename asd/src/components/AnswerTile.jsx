import React, { useEffect, useMemo, useState } from 'react';

const AnswerTile = ({ option, onSelect, isSelected, isCorrect, showResult }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [option.image, option.label]);

  const getStatusClasses = () => {
    if (!showResult) {
      return isSelected 
        ? 'glass-morphism border-sky-400 text-sky-700 bg-sky-100/50 shadow-[0_0_20px_rgba(14,165,233,0.1)] scale-[1.02]' 
        : 'glass-morphism border-slate-200 text-slate-500 hover:border-sky-300 hover:bg-white/40';
    }
    
    if (option.correct || isCorrect) {
      return 'bg-emerald-100/50 border-emerald-500 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02] ring-4 ring-emerald-500/10';
    }
    
    if (isSelected && !option.correct) {
      return 'bg-rose-100/50 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)] opacity-70 contrast-75';
    }
    
    return 'opacity-40 grayscale-[50%] blur-[1px] scale-95';
  };

  return (
    <button
      className={`group relative flex flex-row items-center justify-start p-4 md:p-6 rounded-2xl border-[2px] transition-all duration-300 w-full overflow-hidden ${getStatusClasses()}`}
      onClick={!showResult ? onSelect : undefined}
      disabled={showResult}
    >
      {/* Background Subtle Glow */}
      {!showResult && (
        <div className="absolute inset-0 bg-sky-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center bg-transparent rounded-xl mr-6 overflow-hidden relative z-10">
        {imageFailed || !option.image ? (
          <span className="text-2xl md:text-3xl opacity-50 grayscale">{option.label}</span>
        ) : (
          <img
            src={option.image}
            alt={option.label}
            className={`w-full h-full object-contain p-1 md:p-2 transition-all duration-500 
              ${!showResult ? 'group-hover:scale-105 contrast-125' : 'contrast-125'}
              ${showResult && !isCorrect ? 'grayscale opacity-50' : ''}`}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      
      <span className="text-lg md:text-xl font-bold uppercase tracking-[0.05em] relative z-10 text-left whitespace-nowrap overflow-hidden text-ellipsis pr-8">
        {option.label}
      </span>

      {showResult && (option.correct || isCorrect) && (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 text-emerald-500">
           <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        </div>
      )}
    </button>
  );
};

export default AnswerTile;
