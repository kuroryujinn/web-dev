# 🌲 IDDFS Visualizer

> *Watch a search algorithm think — one depth at a time.*

An interactive, browser-based visualization of **Iterative Deepening Depth-First Search** — an elegant algorithm that marries the memory efficiency of DFS with the optimality of BFS. Built to make the invisible mechanics of graph traversal not just visible, but beautiful.

---

## ✨ What is IDDFS?

Iterative Deepening Depth-First Search is one of those rare algorithms that feels like a magic trick. It plunges deep into a graph like DFS, yet systematically finds the shortest path like BFS — all while using only **O(d)** memory, where *d* is the depth of the solution.

The secret? It restarts. Over and over. Each iteration allows itself to go one level deeper, discarding everything it learned before — and somehow, this seemingly wasteful repetition leads to the optimal answer.

This visualizer lets you *see* exactly how that happens.

---

## 🎬 Demo

> Explore it live → **[Launch Visualizer](https://kuroryujinn.github.io/web-dev/iddfs-visualizer)**

---

## 🔍 Features

- **Step-by-step traversal** — watch the algorithm explore node by node, with full control over speed
- **Depth boundary visualization** — clearly see the depth limit expand with each new iteration
- **Backtracking animation** — observe how the algorithm unwinds its path and tries again
- **Custom graph input** — define your own nodes, edges, and target to test any scenario
- **Color-coded states** — instantly distinguish visited, frontier, and backtracked nodes
- **Iteration counter** — track exactly how many restarts it takes to find the goal

---

## 🧠 Algorithm at a Glance

```
for depth_limit = 0, 1, 2, ... :
    result = depth_limited_search(root, goal, depth_limit)
    if result found:
        return result
```

Simple. Profound. Surprisingly powerful.

---

## 🚀 Getting Started

No build tools. No dependencies. Just open and explore.

```bash
git clone https://github.com/kuroryujinn/web-dev.git
cd web-dev/iddfs-visualizer
open index.html
```

Or simply drag `index.html` into your browser.

---

## 🛠️ Built With

- **Vanilla JavaScript** — zero dependencies, pure logic
- **HTML5 Canvas / SVG** — smooth, expressive graph rendering
- **CSS animations** — fluid transitions that follow the algorithm's rhythm

---

## 📚 Learn More

- [IDDFS on Wikipedia](https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search)
- [Comparison of graph search algorithms](https://en.wikipedia.org/wiki/Graph_traversal)

---

## 🤝 Contributing

Got an idea to make the visualization more expressive? Found a quirk in the traversal? Pull requests are warmly welcome.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-idea`
3. Commit your changes: `git commit -m 'Add some magic'`
4. Push and open a PR

---

## 📄 License

MIT — free to use, learn from, and build upon.

---

<p align="center">
  <i>Sometimes the most elegant solution is the one that isn't afraid to start over.</i>
</p>
