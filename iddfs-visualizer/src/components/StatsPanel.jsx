import React from 'react';

export function StatsPanel({ currentStep, stepsLength, isPlaying }) {
    // Calculate live stats based on currentStep
    const currentIteration = currentStep ? currentStep.depthLimit : '-';
    const nodesVisitedThisIteration = currentStep && stepsLength > 0
        ? currentStep.path.length // Rough estimate via path length for visual representation
        : '-';

    // Since we precompued, we can just say what step we are on
    const stepIndex = currentStep ? stepsLength - 1 /* placeholder until passed real index */ : '-';
    const isGoalFound = currentStep?.type === 'goal_found';

    return (
        <div className="panel h-full flex flex-col justify-between">
            <h2 className="text-lg font-bold mb-3 border-b border-border-custom pb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
                Execution Stats
            </h2>

            <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-bg-base/50 p-3 rounded border border-border-custom/50 flex flex-col justify-center items-center">
                    <span className="text-text-secondary text-xs uppercase tracking-wider mb-1 text-center">Current Limit</span>
                    <span className="text-3xl font-display font-bold text-cyan-neon drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]">
                        {currentIteration}
                    </span>
                </div>

                <div className="bg-bg-base/50 p-3 rounded border border-border-custom/50 flex flex-col justify-center items-center">
                    <span className="text-text-secondary text-xs uppercase tracking-wider mb-1 text-center">Status</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded ${isGoalFound ? 'bg-gold/20 text-gold-glow border border-gold' : isPlaying ? 'bg-green/20 text-green-phosphor border border-green/50 animate-pulse' : 'bg-bg-panel text-text-primary'}`}>
                        {isGoalFound ? 'FOUND!' : isPlaying ? 'RUNNING' : 'IDLE'}
                    </span>
                </div>

                <div className="col-span-2 bg-bg-base/50 p-3 rounded border border-border-custom/50 flex items-center justify-between">
                    <span className="text-text-secondary text-xs uppercase tracking-wider">Depth Reached</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-text-primary">{currentStep ? currentStep.depth : '-'}</span>
                        <span className="text-text-secondary">/</span>
                        <span className="text-sm font-bold text-text-secondary">{currentIteration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
