import React, { useState } from 'react';

const AnswerTile = ({ option, onSelect, isSelected, isCorrect, showResult }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const getDepthState = () => {
    if (!showResult) return isSelected ? 'pressed' : 'raised';
    if (isSelected && !option.correct) return 'dropped-negative';
    if (option.correct || isCorrect) return 'raised-correct';
    return 'raised-muted';
  };

  const depthState = getDepthState();

  const getStatusClasses = () => {
    if (!showResult) {
      return isSelected 
        ? 'bg-[var(--surface-butter)] text-[var(--ink)]'
        : 'bg-white/85 text-[var(--ink-soft)] hover:bg-[var(--surface-sky)]';
    }
    
    if (option.correct || isCorrect) {
      return 'bg-[var(--surface-mint)] text-[var(--ink)]';
    }
    
    if (isSelected && !option.correct) {
      return 'bg-[var(--surface-coral)] text-[var(--ink)]';
    }
    
    return 'bg-white/70 text-[var(--ink-soft)]';
  };

  return (
    <button
      data-depth-state={depthState}
      data-layer="option"
      className={`brutal-tile pressable ${depthState} group relative flex flex-row items-center justify-start p-4 md:p-6 w-full overflow-hidden ${getStatusClasses()}`}
      onClick={!showResult ? onSelect : undefined}
      disabled={showResult}
    >
      {!showResult && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>}
      
      <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center bg-transparent rounded-xl mr-6 overflow-hidden relative z-10">
        {imageFailed || !option.image ? (
          <span className="text-2xl md:text-3xl opacity-70">{option.label}</span>
        ) : (
          <img
            src={option.image}
            alt={option.label}
            className={`w-full h-full object-contain p-1 md:p-2 transition-all duration-500 
              ${!showResult ? 'group-hover:scale-105' : ''}
              ${showResult && !isCorrect ? 'grayscale opacity-60' : ''}`}
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      
      <span className="text-lg md:text-xl font-black uppercase tracking-[0.05em] relative z-10 text-left whitespace-nowrap overflow-hidden text-ellipsis pr-8">
        {option.label}
      </span>

      {showResult && (option.correct || isCorrect) && (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 text-[var(--ink)]">
           <div className="w-4 h-4 bg-[var(--surface-mint)] border-2 border-[var(--ink)] rounded-full"></div>
        </div>
      )}
    </button>
  );
};

export default AnswerTile;
