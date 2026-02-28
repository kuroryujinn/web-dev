import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Union

app = FastAPI()

# Enable CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str

class Link(BaseModel):
    source: Union[str, Dict]
    target: Union[str, Dict]

class GraphData(BaseModel):
    nodes: List[Node]
    links: List[Link]

class IDDFSRequest(BaseModel):
    graph: GraphData
    startNode: str
    goalNode: str
    maxDepth: int

class GenerateGraphRequest(BaseModel):
    numNodes: int

@app.post("/api/generate-graph")
def generate_random_graph(req: GenerateGraphRequest):
    num_nodes = max(2, min(req.numNodes, 50)) # Cap at 50 for visual sanity
    
    # Generate alphabetical or numbered node names
    nodes = []
    for i in range(num_nodes):
        if num_nodes <= 26:
            nodes.append({"id": chr(65 + i)}) # A, B, C...
        else:
            nodes.append({"id": str(i+1)})
            
    links = []
    # Create a guaranteed spanning tree first so graph is connected
    unvisited = [n["id"] for n in nodes]
    visited = [unvisited.pop(0)]
    
    while unvisited:
        new_node = unvisited.pop(random.randrange(len(unvisited)))
        hook_node = random.choice(visited)
        links.append({"source": hook_node, "target": new_node})
        visited.append(new_node)
        
    # Add some random extra edges
    extra_edges = random.randint(0, num_nodes // 2)
    for _ in range(extra_edges):
        u = random.choice(nodes)["id"]
        v = random.choice(nodes)["id"]
        if u != v:
            # avoid explicit immediate duplicates
            exists = any((l["source"] == u and l["target"] == v) or (l["source"] == v and l["target"] == u) for l in links)
            if not exists:
                links.append({"source": u, "target": v})
                
    return {
        "nodes": nodes,
        "links": links
    }

@app.post("/api/iddfs")
def run_iddfs_endpoint(req: IDDFSRequest):
    # Replicate the core IDDFS engine from JS but in Python
    # Build Adj list
    adj = {node.id: [] for node in req.graph.nodes}
    for link in req.graph.links:
        src = link.source if isinstance(link.source, str) else link.source.get('id')
        tgt = link.target if isinstance(link.target, str) else link.target.get('id')
        if src in adj and tgt in adj:
            adj[src].append(tgt)
            
    # Sort for deterministic output
    for node_id in adj:
        adj[node_id].sort()
        
    steps = []
    global_found = False
    
    def dls(current_node, goal_node, limit, current_depth_limit, current_path):
        nonlocal steps
        new_path = current_path + [current_node]
        depth = current_depth_limit - limit
        
        # Line 10: visit first check
        steps.append({
            "type": "visit",
            "node": current_node,
            "depth": depth,
            "depthLimit": current_depth_limit,
            "path": new_path,
            "pseudocodeLine": 10
        })
        
        # Line 11: goal check
        steps.append({
            "type": "visit",
            "node": current_node,
            "depth": depth,
            "depthLimit": current_depth_limit,
            "path": new_path,
            "pseudocodeLine": 11
        })
        
        if current_node == goal_node:
            steps.append({
                "type": "goal_found",
                "node": current_node,
                "depth": depth,
                "depthLimit": current_depth_limit,
                "path": new_path,
                "pseudocodeLine": 5
            })
            return "FOUND"
            
        # Line 12: depth cutoff check
        steps.append({
            "type": "depth_cutoff",
            "node": current_node,
            "depth": depth,
            "depthLimit": current_depth_limit,
            "path": new_path,
            "pseudocodeLine": 12
        })
        
        if limit <= 0:
            steps.append({
                "type": "backtrack",
                "node": current_node,
                "depth": depth,
                "depthLimit": current_depth_limit,
                "path": current_path,
                "pseudocodeLine": 16
            })
            return "CUTOFF"
            
        cutoff_occurred = False
        for neighbor in adj.get(current_node, []):
            if neighbor not in current_path:
                result = dls(neighbor, goal_node, limit - 1, current_depth_limit, new_path)
                if result == "FOUND":
                    return "FOUND"
                elif result == "CUTOFF":
                    cutoff_occurred = True
                    
        steps.append({
            "type": "backtrack",
            "node": current_node,
            "depth": depth,
            "depthLimit": current_depth_limit,
            "path": current_path,
            "pseudocodeLine": 16
        })
        return "CUTOFF" if cutoff_occurred else "NOT_FOUND"

    for depth_limit in range(req.maxDepth + 1):
        steps.append({
            "type": "new_iteration",
            "node": req.startNode,
            "depth": 0,
            "depthLimit": depth_limit,
            "path": [],
            "pseudocodeLine": 2
        })
        
        res = dls(req.startNode, req.goalNode, depth_limit, depth_limit, [])
        if res == "FOUND":
            global_found = True
            break
            
    return steps

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
