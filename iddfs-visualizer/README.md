# IDDFS Visualizer

An interactive, animated, step-by-step visual web application for the **Iterative Deepening Depth-First Search** (IDDFS) algorithm. Built with React, Vite, D3.js, and Tailwind CSS.

![IDDFS Visualizer Banner](https://via.placeholder.com/800x400.png?text=IDDFS+Visualizer)

## Features

- **Visual Step-by-Step Animation**: Watch the algorithm expand outwards iteration by iteration.
- **D3 Graph Rendering**: Smooth node physics and dynamic edge highlighting marking the active search path.
- **Live Pseudocode Tracing**: A synchronized display highlighting the exact line of IDDFS pseudocode currently executing.
- **Dynamic Stats**: Track the current depth limit, nodes visited, and execution status.
- **Graph Editor / Presets**: Load from standard layouts (Balanced Tree, Unbalanced, Cyclic, Random) or add your own custom nodes and edges.
- **Playback Controls**: Play, pause, step forward, step backward, or change the algorithm speed globally.
- **Responsive Dark Theme**: Modern, sci-fi inspired dark terminal aesthetic suitable for all device sizes.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- NPM

### Installation & Run

1. Clone this repository (or download it).
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The resulting files will be placed in the `dist/` directory.

## Tech Stack
- [React](https://reactjs.org/) (UI Components)
- [Vite](https://vitejs.dev/) (Build tool)
- [D3.js](https://d3js.org/) (Graph Physics and Rendering)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Lucide React](https://lucide.dev/) (Icons)

## How IDDFS Works
Iterative Deepening Depth-First Search combines the space-efficiency of Depth-First Search (DFS) with the completeness of Breadth-First Search (BFS). It repeatedly runs a depth-limited version of DFS, increasing the depth limit by one each iteration, until the goal is found. This visualizer aims to make that concept intuitive to grasp algorithmically.
