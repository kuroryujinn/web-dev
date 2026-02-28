import React from 'react';

export function Header() {
    return (
        <header className="py-4 px-6 border-b flex items-center justify-between border-border-custom bg-bg-panel w-full z-10 sticky top-0 shadow-lg">
            <div className="flex items-center gap-3">
                {/* Simple animated logo */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-bg-card to-[#1a3a5f] border border-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan opacity-20 animate-pulse"></div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan w-6 h-6 z-10">
                        <polyline points="4 22 20 22"></polyline>
                        <path d="M12 2v20"></path>
                        <path d="M5 9l7 7 7-7"></path>
                        <path d="M5 5l7 7 7-7"></path>
                    </svg>
                </div>

                <div>
                    <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-cyan to-text-secondary">
                        IDDFS Visualizer
                    </h1>
                    <p className="text-xs text-text-secondary tracking-widest uppercase mt-0.5">
                        Iterative Deepening Depth-First Search
                    </p>
                </div>
            </div>
        </header>
    );
}
