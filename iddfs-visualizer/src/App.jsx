import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { GraphCanvas } from './components/GraphCanvas';
import { StatsPanel } from './components/StatsPanel';
import { ControlPanel } from './components/ControlPanel';
import { PseudocodePanel } from './components/PseudocodePanel';
import { useGraphEditor } from './hooks/useGraphEditor';
import { useAnimationPlayer } from './hooks/useAnimationPlayer';
import { runIDDFS } from './api';

function App() {
  const graphEditor = useGraphEditor();
  const [startNode, setStartNode] = useState('A');
  const [goalNode, setGoalNode] = useState('L');
  const [maxDepth, setMaxDepth] = useState(4);
  const [algorithmSteps, setAlgorithmSteps] = useState([]);

  const animationPlayer = useAnimationPlayer(algorithmSteps, 500);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in inputs like node name
      if (document.activeElement.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          animationPlayer.isPlaying ? animationPlayer.pause() : animationPlayer.play();
          break;
        case 'ArrowLeft':
          animationPlayer.stepBack();
          break;
        case 'ArrowRight':
          animationPlayer.stepForward();
          break;
        case 'KeyR':
          animationPlayer.reset();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationPlayer]);

  const handleRunAlgorithm = useCallback(async () => {
    if (!startNode || !goalNode) {
      alert("Please select a valid Start Node and Goal Node.");
      return;
    }
    const steps = await runIDDFS(graphEditor.graph, startNode, goalNode, maxDepth);
    setAlgorithmSteps(steps || []);
    animationPlayer.reset();
  }, [graphEditor.graph, startNode, goalNode, maxDepth, animationPlayer]);

  // Handle Preset changes updating start/goal node defaults gracefully
  useEffect(() => {
    const nodes = graphEditor.graph.nodes;
    if (nodes.length > 0) {
      if (!nodes.find(n => n.id === startNode)) setStartNode(nodes[0].id);
      if (!nodes.find(n => n.id === goalNode)) setGoalNode(nodes[nodes.length - 1].id);
    } else {
      setStartNode('');
      setGoalNode('');
    }
  }, [graphEditor.graph.nodes, startNode, goalNode]);


  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden text-text-primary">
      <Header />

      {/* 
        Responsive layout matrix:
        Desktop: Side-by-side. 65% Graph Canvas & Stats (left col), 35% Controls & Pseudo (right col)
        Tablet: 2 column. Top half Graph, bottom half Panels
        Mobile: Single stacked column 
      */}
      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-y-auto lg:overflow-hidden h-[calc(100vh-80px)]">

        {/* Left column (Graph Focus) */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-[600px] lg:h-full">
          <div className="flex-1 min-h-[400px]">
            <GraphCanvas
              graphEditor={graphEditor}
              currentStep={animationPlayer.currentStep}
              stepsLength={algorithmSteps.length}
            />
          </div>
          <div className="h-40 shrink-0">
            <StatsPanel
              currentStep={animationPlayer.currentStep}
              stepsLength={algorithmSteps.length}
              isPlaying={animationPlayer.isPlaying}
            />
          </div>
        </div>

        {/* Right column (Control & Code Focus) */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full">
          <div className="flex-[0.5] min-h-[350px]">
            <ControlPanel
              graphEditor={graphEditor}
              animationPlayer={animationPlayer}
              onRunAlgorithm={handleRunAlgorithm}
              startNode={startNode}
              setStartNode={setStartNode}
              goalNode={goalNode}
              setGoalNode={setGoalNode}
              maxDepth={maxDepth}
              setMaxDepth={setMaxDepth}
            />
          </div>
          <div className="flex-[0.5] min-h-[250px] lg:min-h-0 relative">
            <PseudocodePanel currentStep={animationPlayer.currentStep} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
