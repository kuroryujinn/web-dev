import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Plus, Trash2, LayoutTemplate, Zap } from 'lucide-react';
import { PRESETS } from '../utils/presets';
import { generateGraph } from '../api';

export function ControlPanel({
    graphEditor,
    animationPlayer,
    onRunAlgorithm,
    startNode,
    setStartNode,
    goalNode,
    setGoalNode,
    maxDepth,
    setMaxDepth
}) {
    const [newNodeName, setNewNodeName] = useState('');
    const [edgeSource, setEdgeSource] = useState('');
    const [edgeTarget, setEdgeTarget] = useState('');
    const [numNodes, setNumNodes] = useState(8);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddNode = () => {
        graphEditor.addNode(newNodeName);
        setNewNodeName('');
    };

    const handleAddEdge = () => {
        if (edgeSource && edgeTarget) {
            graphEditor.addEdge(edgeSource, edgeTarget);
            setEdgeSource('');
            setEdgeTarget('');
        }
    };

    const handleGenerateRandom = async () => {
        setIsGenerating(true);
        const newGraph = await generateGraph(numNodes);
        if (newGraph) {
            graphEditor.setGraph(newGraph);
        }
        setIsGenerating(false);
    };

    return (
        <div className="panel h-full flex flex-col gap-6 overflow-y-auto">

            {/* Playback Controls */}
            <section>
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                    Playback Controls
                </h2>
                <div className="grid grid-cols-4 gap-2 mb-3">
                    <button
                        className="btn col-span-2 justify-center bg-cyan/10 border-cyan/30 text-cyan hover:bg-cyan/20"
                        onClick={animationPlayer.isPlaying ? animationPlayer.pause : animationPlayer.play}
                        disabled={!animationPlayer.currentStep}
                    >
                        {animationPlayer.isPlaying ? <Pause size={18} /> : <Play size={18} />}
                        {animationPlayer.isPlaying ? 'Pause' : 'Play'} (Space)
                    </button>

                    <button className="btn justify-center" onClick={animationPlayer.stepBack} disabled={!animationPlayer.currentStep}>
                        <SkipBack size={18} />
                    </button>
                    <button className="btn justify-center" onClick={animationPlayer.stepForward} disabled={!animationPlayer.currentStep}>
                        <SkipForward size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn justify-center px-3" onClick={animationPlayer.reset} title="Reset">
                        <RotateCcw size={16} />
                    </button>
                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-text-secondary">
                            <span>Speed</span>
                            <span>{animationPlayer.speed}ms</span>
                        </div>
                        <input
                            type="range"
                            min="100" max="1500" step="100"
                            value={1600 - animationPlayer.speed} // Invert visually so right is faster
                            onChange={(e) => animationPlayer.setSpeed(1600 - Number(e.target.value))}
                            className="w-full accent-cyan"
                        />
                    </div>
                </div>
            </section>

            {/* Algorithm Config */}
            <section className="border-t border-border-custom pt-4">
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Algorithm Config</h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-text-secondary">Start Node</label>
                        <select
                            value={startNode} onChange={e => setStartNode(e.target.value)}
                            className="bg-bg-base border border-border-custom rounded p-1 text-sm outline-none focus:border-cyan"
                        >
                            <option value="">Select...</option>
                            {graphEditor.graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-text-secondary">Goal Node</label>
                        <select
                            value={goalNode} onChange={e => setGoalNode(e.target.value)}
                            className="bg-bg-base border border-border-custom rounded p-1 text-sm outline-none focus:border-cyan"
                        >
                            <option value="">Select...</option>
                            {graphEditor.graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex justify-between text-xs text-text-secondary">
                        <span>Max Depth</span>
                        <span>{maxDepth}</span>
                    </div>
                    <input
                        type="range" min="1" max="15"
                        value={maxDepth} onChange={e => setMaxDepth(Number(e.target.value))}
                        className="w-full accent-cyan"
                    />
                </div>

                <button
                    className="btn btn-primary w-full justify-center py-3 font-bold tracking-wide"
                    onClick={onRunAlgorithm}
                    disabled={!startNode || !goalNode}
                >
                    GENERATE & RUN IDDFS
                </button>
            </section>

            {/* Graph Editor */}
            <section className="border-t border-border-custom pt-4 flex-1">
                <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Graph Editor</h2>

                <div className="flex flex-col gap-3">
                    {/* Presets */}
                    <div className="flex items-center gap-2">
                        <LayoutTemplate size={16} className="text-text-secondary" />
                        <select
                            onChange={e => graphEditor.loadPreset(e.target.value)}
                            className="bg-bg-base border border-border-custom rounded p-1.5 text-sm outline-none focus:border-cyan flex-1"
                            defaultValue="balancedTree"
                        >
                            <option value="balancedTree">Balanced Tree</option>
                            <option value="unbalancedTree">Unbalanced Tree</option>
                            <option value="cyclicGraph">Cyclic Graph</option>
                        </select>
                    </div>

                    {/* Generate Random Graph */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-2 top-2 text-xs text-text-secondary">Nodes:</span>
                            <input
                                type="number" min="2" max="50"
                                value={numNodes} onChange={e => setNumNodes(Number(e.target.value))}
                                className="bg-bg-base border border-border-custom rounded p-1.5 pl-12 text-sm outline-none focus:border-cyan w-full min-w-0"
                            />
                        </div>
                        <button
                            className="btn px-3 border-border-custom bg-cyan/10 text-cyan hover:bg-cyan/20"
                            onClick={handleGenerateRandom}
                            disabled={isGenerating}
                            title="Generate Random Graph"
                        >
                            <Zap size={16} />
                        </button>
                    </div>

                    {/* Add Node */}
                    <div className="flex gap-2">
                        <input
                            type="text" placeholder="Node name (e.g. Z)"
                            value={newNodeName} onChange={e => setNewNodeName(e.target.value.toUpperCase())}
                            className="bg-bg-base border border-border-custom rounded p-1.5 text-sm outline-none focus:border-cyan w-full min-w-0"
                            maxLength={3}
                        />
                        <button className="btn px-2 border-border-custom" onClick={handleAddNode} disabled={!newNodeName}>
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Add Edge */}
                    <div className="flex gap-2">
                        <select
                            value={edgeSource} onChange={e => setEdgeSource(e.target.value)}
                            className="bg-bg-base border border-border-custom rounded p-1.5 text-sm outline-none focus:border-cyan flex-1 min-w-0"
                        >
                            <option value="">From...</option>
                            {graphEditor.graph.nodes.map(n => <option key={`src-${n.id}`} value={n.id}>{n.id}</option>)}
                        </select>
                        <select
                            value={edgeTarget} onChange={e => setEdgeTarget(e.target.value)}
                            className="bg-bg-base border border-border-custom rounded p-1.5 text-sm outline-none focus:border-cyan flex-1 min-w-0"
                        >
                            <option value="">To...</option>
                            {graphEditor.graph.nodes.map(n => <option key={`tgt-${n.id}`} value={n.id}>{n.id}</option>)}
                        </select>
                        <button className="btn px-2 border-border-custom" onClick={handleAddEdge} disabled={!edgeSource || !edgeTarget}>
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
