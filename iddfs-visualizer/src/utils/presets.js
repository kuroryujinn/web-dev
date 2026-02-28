export const PRESETS = {
    balancedTree: {
        nodes: [
            { id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" },
            { id: "F" }, { id: "G" }, { id: "H" }, { id: "I" }, { id: "J" },
            { id: "K" }, { id: "L" }, { id: "M" }, { id: "N" }, { id: "O" }
        ],
        links: [
            { source: "A", target: "B" }, { source: "A", target: "C" },
            { source: "B", target: "D" }, { source: "B", target: "E" },
            { source: "C", target: "F" }, { source: "C", target: "G" },
            { source: "D", target: "H" }, { source: "D", target: "I" },
            { source: "E", target: "J" }, { source: "E", target: "K" },
            { source: "F", target: "L" }, { source: "F", target: "M" },
            { source: "G", target: "N" }, { source: "G", target: "O" }
        ]
    },
    unbalancedTree: {
        nodes: [
            { id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" },
            { id: "F" }, { id: "G" }
        ],
        links: [
            { source: "A", target: "B" }, { source: "B", target: "C" },
            { source: "C", target: "D" }, { source: "D", target: "E" },
            { source: "A", target: "F" }, { source: "F", target: "G" }
        ]
    },
    cyclicGraph: {
        nodes: [
            { id: "A" }, { id: "B" }, { id: "C" }, { id: "D" },
            { id: "E" }, { id: "F" }, { id: "G" }
        ],
        links: [
            { source: "A", target: "B" }, { source: "B", target: "C" },
            { source: "C", target: "D" }, { source: "D", target: "A" },
            { source: "D", target: "E" }, { source: "E", target: "F" },
            { source: "F", target: "G" }, { source: "G", target: "C" }
        ]
    }
};
