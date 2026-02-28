import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function GraphCanvas({ graphEditor, currentStep, stepsLength }) {
    const d3Container = useRef(null);
    const simulationRef = useRef(null);
    const graph = graphEditor.graph;

    // Initialize D3 Simulation
    useEffect(() => {
        if (!graph || !d3Container.current) return;

        const width = d3Container.current.clientWidth;
        const height = d3Container.current.clientHeight;

        const svg = d3.select(d3Container.current);
        svg.selectAll('*').remove();

        // Setup defs for arrow marker
        const defs = svg.append('defs');
        defs.append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 22) // Offset from node center
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#1e3a5f'); // Default edge color

        const simulation = d3.forceSimulation(graph.nodes)
            .force('link', d3.forceLink(graph.links).id(d => d.id).distance(80))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            // Add a weak vertical force to approximate trees organically
            .force('y', d3.forceY(height / 3).strength(0.05));

        simulationRef.current = simulation;

        // Draw depth limit line (hidden by default)
        svg.append('line')
            .attr('class', 'depth-limit-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', 0) // Updated dynamically based on depth
            .attr('y2', 0)
            .attr('stroke', '#00f5ff')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '10, 10')
            .attr('display', 'none'); // Hidden initially

        // Draw edges
        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(graph.links)
            .enter().append('line')
            .attr('stroke-width', 2)
            .attr('stroke', '#1e3a5f')
            .attr('marker-end', 'url(#arrow)');

        // Draw nodes
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(graph.nodes)
            .enter().append('g')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('circle')
            .attr('r', 16)
            .attr('fill', '#1a2744')
            .attr('stroke', '#1e3a5f')
            .attr('stroke-width', 2);

        node.append('text')
            .text(d => d.id)
            .attr('text-anchor', 'middle')
            .attr('dy', 4) // Center text vertically
            .attr('fill', '#e0f0ff')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('font-family', 'Space Mono');

        simulation.on('tick', () => {
            // Ensure nodes bounded within SVG
            node.attr('transform', d => {
                d.x = Math.max(20, Math.min(width - 20, d.x));
                d.y = Math.max(20, Math.min(height - 20, d.y));
                return `translate(${d.x},${d.y})`;
            });

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            // Update depth line if visible based on an approximate Y mapping
            const depthLine = svg.select('.depth-limit-line');
            if (depthLine.attr('display') !== 'none') {
                // Find root node roughly
                const rootNode = graph.nodes[0];
                if (rootNode) {
                    const currentLimit = Number(depthLine.attr('data-limit')) || 0;
                    // roughly 80px per depth level, starting just below root
                    const targetY = rootNode.y + (currentLimit * 80) + 40;
                    depthLine.attr('y1', targetY).attr('y2', targetY);
                }
            }
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Cleanup
        return () => {
            simulation.stop();
        };
    }, [graph]); // Re-run when graph nodes/links genuinely change Reference

    // Step-based Visual Updates
    useEffect(() => {
        if (!d3Container.current) return;
        const svg = d3.select(d3Container.current);

        // Reset all nodes and links to unvisited
        svg.selectAll('.nodes circle')
            .attr('fill', '#1a2744')
            .attr('stroke', '#1e3a5f')
            .attr('class', '');

        svg.selectAll('.links line')
            .attr('stroke', '#1e3a5f');

        const depthLine = svg.select('.depth-limit-line');

        if (!currentStep) {
            depthLine.attr('display', 'none');
            return;
        }

        // Update Depth limit line
        depthLine
            .attr('display', 'block')
            .attr('data-limit', currentStep.depthLimit);

        if (currentStep.type === 'new_iteration') {
            // Animate the sweep line
            depthLine
                .style('stroke-dashoffset', '1000')
                .transition().duration(800).ease(d3.easeLinear)
                .style('stroke-dashoffset', '0');
        }

        const { path, node, type, depth } = currentStep;

        // Highlight path edges (from root down to current node)
        if (path.length > 0) {
            // Create a set of structural edges in current path for easy lookup
            const pathEdges = new Set();
            for (let i = 0; i < path.length - 1; i++) {
                pathEdges.add(`${path[i]}-${path[i + 1]}`);
            }

            // We also highlight the edge leading *to* the current node being acted upon if it's not a backtrack
            if (type !== 'backtrack' && path.length > 0) {
                const lastInPath = path[path.length - 1];
                if (lastInPath !== node) {
                    pathEdges.add(`${lastInPath}-${node}`);
                }
            }

            svg.selectAll('.links line')
                .attr('stroke', d => {
                    const edgeKey1 = `${typeof d.source === 'object' ? d.source.id : d.source}-${typeof d.target === 'object' ? d.target.id : d.target}`;
                    const edgeKey2 = `${typeof d.target === 'object' ? d.target.id : d.target}-${typeof d.source === 'object' ? d.source.id : d.source}`; // If undirected visually

                    if (pathEdges.has(edgeKey1) || pathEdges.has(edgeKey2)) {
                        return '#39ff14'; // Phosphor green
                    }
                    return '#1e3a5f';
                })
                .attr('stroke-width', d => {
                    const edgeKey1 = `${typeof d.source === 'object' ? d.source.id : d.source}-${typeof d.target === 'object' ? d.target.id : d.target}`;
                    const edgeKey2 = `${typeof d.target === 'object' ? d.target.id : d.target}-${typeof d.source === 'object' ? d.source.id : d.source}`;
                    if (pathEdges.has(edgeKey1) || pathEdges.has(edgeKey2)) {
                        return 3;
                    }
                    return 2;
                });
        }

        // Update Node Colors
        svg.selectAll('.nodes g').each(function (d) {
            const gNode = d3.select(this).select('circle');

            // Determine logical state
            const isCurrent = d.id === node;
            const isInPath = path.includes(d.id);

            // Determine color
            if (isCurrent && type === 'goal_found') {
                gNode
                    .attr('fill', '#ffd700')
                    .attr('stroke', '#ffffff')
                    .attr('class', 'animate-gold-pulse'); // Tailwind animation class

            } else if (isCurrent && (type === 'visit' || type === 'depth_cutoff')) {
                gNode
                    .attr('fill', '#00f5ff')
                    .attr('stroke', '#ffffff')
                    .attr('class', 'animate-glow-pulse'); // Tailwind animation

                // Bumping transition to show visit physically
                gNode.transition().duration(200).attr('r', 20)
                    .transition().duration(200).attr('r', 16);

            } else if (isCurrent && type === 'backtrack') {
                gNode
                    .attr('fill', '#2a2a3a') // Greyish visited
                    .attr('stroke', '#1e3a5f');

            } else if (isInPath) {
                gNode
                    .attr('fill', '#39ff14') // Green
                    .attr('stroke', '#ffffff');

            } else {
                // Technically IDDFS revisits nodes. Nodes not currently active or in path
                // but visited in *previous* iterations or higher branches are typically marked visited.
                // For visual simplicity without storing a massive complex history set, we rely on the path.
                // A sophisticated tracer could color them #1a6b6b (teal) if visited in current iteration.
                // We will stick to the aesthetic unvisited by default except as acted on above.
                gNode
                    .attr('fill', '#1a2744')
                    .attr('stroke', '#1e3a5f');
            }
        });

    }, [currentStep]);

    return (
        <div className="panel col-span-1 lg:col-span-2 relative h-full min-h-[400px] overflow-hidden">
            {/* Container header overlaid */}
            <div className="absolute top-4 left-4 z-10 bg-bg-base/80 p-2 rounded border border-border-custom/50 backdrop-blur-sm">
                <h2 className="text-sm font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                    Graph Visualizer
                </h2>
            </div>

            <svg
                ref={d3Container}
                className="w-full h-full bg-bg-card/30 rounded"
                width="100%"
                height="100%"
            />
        </div>
    );
}
