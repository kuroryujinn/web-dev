import { useState, useCallback } from 'react';
import { PRESETS } from '../utils/presets';

export function useGraphEditor(initialGraph = PRESETS.balancedTree) {
    const [graph, setGraph] = useState(initialGraph);

    const addNode = useCallback((name) => {
        if (!name || name.trim() === "") return;
        const cleanName = name.trim();

        setGraph(prev => {
            if (prev.nodes.find(n => n.id === cleanName)) return prev;
            return {
                ...prev,
                nodes: [...prev.nodes, { id: cleanName }]
            };
        });
    }, []);

    const removeNode = useCallback((name) => {
        setGraph(prev => ({
            nodes: prev.nodes.filter(n => n.id !== name),
            links: prev.links.filter(l => l.source !== name && l.target !== name && l.source.id !== name && l.target.id !== name)
        }));
    }, []);

    const addEdge = useCallback((source, target) => {
        if (source === target) return;
        setGraph(prev => {
            // Avoid duplicate edges
            const edgeExists = prev.links.some(l =>
                (l.source === source || l.source?.id === source) &&
                (l.target === target || l.target?.id === target)
            );
            if (edgeExists) return prev;

            return {
                ...prev,
                links: [...prev.links, { source, target }]
            };
        });
    }, []);

    const removeEdge = useCallback((source, target) => {
        setGraph(prev => ({
            ...prev,
            links: prev.links.filter(l =>
                !((l.source === source || l.source?.id === source) &&
                    (l.target === target || l.target?.id === target))
            )
        }));
    }, []);

    const loadPreset = useCallback((presetName) => {
        if (PRESETS[presetName]) {
            // Create a deep copy to ensure reference changes and reset D3 simulation properly later
            const presetData = JSON.parse(JSON.stringify(PRESETS[presetName]));
            setGraph(presetData);
        }
    }, []);

    return {
        graph,
        setGraph,
        addNode,
        removeNode,
        addEdge,
        removeEdge,
        loadPreset
    };
}
