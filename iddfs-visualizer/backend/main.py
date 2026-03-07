import random
import heapq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Union, Optional

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
    weight: Optional[float] = 1.0

class GraphData(BaseModel):
    nodes: List[Node]
    links: List[Link]

class AlgorithmRequest(BaseModel):
    algorithm: Optional[str] = "IDDFS"
    graph: GraphData
    startNode: str
    goalNode: str
    maxDepth: Optional[int] = 4

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
        weight = random.randint(1, 10)
        links.append({"source": hook_node, "target": new_node, "weight": weight})
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
                weight = random.randint(1, 10)
                links.append({"source": u, "target": v, "weight": weight})
                
    return {
        "nodes": nodes,
        "links": links
    }

def run_iddfs(req: AlgorithmRequest):
    adj = {node.id: [] for node in req.graph.nodes}
    for link in req.graph.links:
        src = link.source if isinstance(link.source, str) else link.source.get('id')
        tgt = link.target if isinstance(link.target, str) else link.target.get('id')
        if src in adj and tgt in adj:
            adj[src].append(tgt)
            
    for node_id in adj:
        adj[node_id].sort()
        
    steps = []
    global_found = False
    
    def dls(current_node, goal_node, limit, current_depth_limit, current_path):
        nonlocal steps
        new_path = current_path + [current_node]
        depth = current_depth_limit - limit
        
        steps.append({"type": "visit", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": new_path, "pseudocodeLine": 10})
        steps.append({"type": "visit", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": new_path, "pseudocodeLine": 11})
        
        if current_node == goal_node:
            steps.append({"type": "goal_found", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": new_path, "pseudocodeLine": 5})
            return "FOUND"
            
        steps.append({"type": "depth_cutoff", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": new_path, "pseudocodeLine": 12})
        
        if limit <= 0:
            steps.append({"type": "backtrack", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": current_path, "pseudocodeLine": 16})
            return "CUTOFF"
            
        cutoff_occurred = False
        for neighbor in adj.get(current_node, []):
            if neighbor not in current_path:
                result = dls(neighbor, goal_node, limit - 1, current_depth_limit, new_path)
                if result == "FOUND":
                    return "FOUND"
                elif result == "CUTOFF":
                    cutoff_occurred = True
                    
        steps.append({"type": "backtrack", "node": current_node, "depth": depth, "depthLimit": current_depth_limit, "path": current_path, "pseudocodeLine": 16})
        return "CUTOFF" if cutoff_occurred else "NOT_FOUND"

    max_d = req.maxDepth if getattr(req, "maxDepth", None) is not None else 4
    for depth_limit in range(max_d + 1):
        steps.append({"type": "new_iteration", "node": req.startNode, "depth": 0, "depthLimit": depth_limit, "path": [], "pseudocodeLine": 2})
        
        res = dls(req.startNode, req.goalNode, depth_limit, depth_limit, [])
        if res == "FOUND":
            global_found = True
            break
            
    return steps

def run_bfs(req: AlgorithmRequest):
    adj = {node.id: [] for node in req.graph.nodes}
    for link in req.graph.links:
        src = link.source if isinstance(link.source, str) else link.source.get('id')
        tgt = link.target if isinstance(link.target, str) else link.target.get('id')
        if src in adj and tgt in adj:
            adj[src].append(tgt)
            
    for node_id in adj:
        adj[node_id].sort()
        
    steps = []
    queue = [(req.startNode, [req.startNode])]
    visited = {req.startNode}

    steps.append({"type": "new_iteration", "node": req.startNode, "path": [], "pseudocodeLine": 1})
    
    while queue:
        current_node, current_path = queue.pop(0)
        
        steps.append({"type": "visit", "node": current_node, "path": current_path, "pseudocodeLine": 5})
        
        if current_node == req.goalNode:
            steps.append({"type": "goal_found", "node": current_node, "path": current_path, "pseudocodeLine": 6})
            return steps
            
        for neighbor in adj.get(current_node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                steps.append({"type": "visit", "node": neighbor, "path": current_path + [neighbor], "pseudocodeLine": 8})
                queue.append((neighbor, current_path + [neighbor]))
                
    return steps

def run_dfs(req: AlgorithmRequest):
    adj = {node.id: [] for node in req.graph.nodes}
    for link in req.graph.links:
        src = link.source if isinstance(link.source, str) else link.source.get('id')
        tgt = link.target if isinstance(link.target, str) else link.target.get('id')
        if src in adj and tgt in adj:
            adj[src].append(tgt)
            
    for node_id in adj:
        adj[node_id].sort()
        
    steps = []
    
    def dfs_recursive(current_node, current_path):
        new_path = current_path + [current_node]
        
        steps.append({"type": "visit", "node": current_node, "path": new_path, "pseudocodeLine": 3})
        
        if current_node == req.goalNode:
            steps.append({"type": "goal_found", "node": current_node, "path": new_path, "pseudocodeLine": 4})
            return True
            
        for neighbor in adj.get(current_node, []):
            if neighbor not in new_path:
                if dfs_recursive(neighbor, new_path):
                    return True
                    
        steps.append({"type": "backtrack", "node": current_node, "path": current_path, "pseudocodeLine": 8})
        return False
        
    dfs_recursive(req.startNode, [])
    return steps

def run_dijkstra(req: AlgorithmRequest):
    adj = {node.id: [] for node in req.graph.nodes}
    for link in req.graph.links:
        src = link.source if isinstance(link.source, str) else link.source.get('id')
        tgt = link.target if isinstance(link.target, str) else link.target.get('id')
        weight = link.weight if hasattr(link, 'weight') and link.weight is not None else 1.0
        if src in adj and tgt in adj:
            adj[src].append((tgt, weight))
            
    steps = []
    
    pq = [(0, req.startNode, [req.startNode])]
    distances = {node.id: float('inf') for node in req.graph.nodes}
    distances[req.startNode] = 0
    visited = set()
    
    while pq:
        dist, current_node, current_path = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        visited.add(current_node)
        
        steps.append({"type": "visit", "node": current_node, "path": current_path, "dist": dist, "pseudocodeLine": 6})
        
        if current_node == req.goalNode:
            steps.append({"type": "goal_found", "node": current_node, "path": current_path, "pseudocodeLine": 7})
            return steps
            
        for neighbor, weight in adj.get(current_node, []):
            if neighbor not in visited:
                new_dist = dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    steps.append({"type": "visit", "node": neighbor, "path": current_path + [neighbor], "pseudocodeLine": 11})
                    heapq.heappush(pq, (new_dist, neighbor, current_path + [neighbor]))
                    
    return steps


@app.post("/api/run-algorithm")
def run_algorithm_endpoint(req: AlgorithmRequest):
    algo = req.algorithm.upper()
    if algo == "BFS":
        return run_bfs(req)
    elif algo == "DFS":
        return run_dfs(req)
    elif algo == "DIJKSTRA":
        return run_dijkstra(req)
    else:
        return run_iddfs(req)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
