/**
 * Fetches the IDDFS stepwise log from the Python backend.
 */
export async function runIDDFS(graph, startNode, goalNode, maxDepth) {
    try {
        const response = await fetch('/api/iddfs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                graph,
                startNode,
                goalNode,
                maxDepth
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const steps = await response.json();
        return steps;
    } catch (error) {
        console.error("Failed to fetch IDDFS logic from backend:", error);
        alert("Error running IDDFS. Ensure the Python backend is running on port 8000.");
        return [];
    }
}

/**
 * Fetches a newly generated random graph from the Python backend.
 */
export async function generateGraph(numNodes) {
    try {
        const response = await fetch('/api/generate-graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numNodes })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to generate graph:", error);
        alert("Error generating graph. Ensure the Python backend is running on port 8000.");
        return null;
    }
}
