import React from 'react';

// The pseudocode lines as an array mapping exact 1-indexed lines
const ALGORITHM_CODE = {
    'IDDFS': [
        "IDDFS(root, goal, maxDepth):",                                        // 1
        "  for depth = 0 to maxDepth:",                                        // 2
        "    // ← NEW ITERATION (depth limit = depth)",                        // 3
        "    result = DLS(root, goal, depth, path=[])",                        // 4
        "    if result == FOUND → return FOUND",                                // 5
        "  return NOT_FOUND",                                                  // 6
        "",                                                                    // 7
        "DLS(node, goal, limit, path):",                                       // 8
        "  add node to path",                                                  // 9
        "  visit(node)",                                                       // 10
        "  if node == goal → return FOUND",                                    // 11
        "  if depth >= limit → return CUTOFF",                                 // 12
        "  for each neighbor not in path:",                                    // 13
        "    result = DLS(neighbor, goal, limit-1, path)",                     // 14
        "    if result == FOUND → return FOUND",                                // 15
        "  backtrack ← remove node from path"                                  // 16
    ],
    'BFS': [
        "BFS(root, goal):",                                                    // 1
        "  queue = [root]",                                                    // 2
        "  while queue is not empty:",                                         // 3
        "    node = queue.pop(0)",                                             // 4
        "    visit(node)",                                                     // 5
        "    if node == goal → return FOUND",                                  // 6
        "    for each neighbor of node:",                                      // 7
        "      if neighbor not visited:",                                      // 8
        "        mark neighbor visited",                                       // 9
        "        queue.append(neighbor)",                                      // 10
        "  return NOT_FOUND"                                                   // 11
    ],
    'DFS': [
        "DFS(node, goal, path):",                                              // 1
        "  add node to path",                                                  // 2
        "  visit(node)",                                                       // 3
        "  if node == goal → return FOUND",                                    // 4
        "  for each neighbor not in path:",                                    // 5
        "    result = DFS(neighbor, goal, path)",                              // 6
        "    if result == FOUND → return FOUND",                               // 7
        "  backtrack ← remove node from path",                                 // 8
        "  return NOT_FOUND"                                                   // 9
    ],
    'DIJKSTRA': [
        "Dijkstra(root, goal):",                                               // 1
        "  pq = [(0, root)] // Priority queue",                                // 2
        "  distances = {root: 0, others: ∞}",                                  // 3
        "  while pq is not empty:",                                            // 4
        "    dist, node = pq.pop()",                                           // 5
        "    visit(node)",                                                     // 6
        "    if node == goal → return FOUND",                                  // 7
        "    for each neighbor of node:",                                      // 8
        "      new_dist = dist + weight(node, neighbor)",                      // 9
        "      if new_dist < distances[neighbor]:",                            // 10
        "        distances[neighbor] = new_dist",                              // 11
        "        pq.push((new_dist, neighbor))",                               // 12
        "  return NOT_FOUND"                                                   // 13
    ]
};

export function PseudocodePanel({ currentStep, algorithm = 'IDDFS' }) {
    const activeLine = currentStep ? currentStep.pseudocodeLine : null;
    const codeLines = ALGORITHM_CODE[algorithm] || ALGORITHM_CODE['IDDFS'];

    return (
        <div className="panel h-full flex flex-col">
            <h2 className="text-lg font-bold mb-4 border-b border-border-custom pb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Algorithm Trace
            </h2>
            <div className="flex-1 overflow-x-auto text-sm bg-bg-base/50 rounded p-4 font-sans font-medium whitespace-pre group relative border border-border-custom/50">
                <div className="absolute top-0 left-0 w-8 h-full bg-bg-card/30 border-r border-border-custom/50 flex flex-col items-end py-4 pr-2 text-text-secondary/50 font-mono text-xs select-none">
                    {codeLines.map((_, i) => (
                        <div key={`n-${i}`} className={`h-6 flex items-center ${activeLine === i + 1 ? 'text-cyan font-bold' : ''}`}>
                            {i + 1}
                        </div>
                    ))}
                </div>
                <div className="pl-6 flex flex-col relative z-0">
                    {codeLines.map((lineText, index) => {
                        const lineNum = index + 1;
                        const isActive = activeLine === lineNum;
                        return (
                            <div
                                key={lineNum}
                                className={`h-6 flex items-center px-2 transition-all duration-200 rounded ${isActive ? 'bg-cyan-neon/20 text-cyan-neon scale-[1.01] origin-left border-l-2 border-cyan-neon shadow-[inset_0_0_12px_rgba(0,245,255,0.1)]' : 'text-text-primary/70'}`}
                            >
                                {/* Syntax highlighting hack based on keywords */}
                                <span dangerouslySetInnerHTML={{
                                    __html: lineText
                                        .replace(/(for|while|if|return|to|each|not in|is not empty)/g, '<span class="text-[#ff79c6]">$1</span>')
                                        .replace(/(FOUND|NOT_FOUND|CUTOFF)/g, '<span class="text-[#f1fa8c]">$1</span>')
                                        .replace(/(IDDFS|DLS|BFS|DFS|Dijkstra|visit)/g, '<span class="text-[#50fa7b]">$1</span>')
                                        .replace(/\/\/.*/g, '<span class="text-text-secondary italic">$&</span>')
                                }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
}
