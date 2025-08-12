OS Scheduling Algorithms Visualizer
An interactive full-stack web application built to demonstrate, simulate, and evaluate classic CPU scheduling techniques. Tailored for learners and instructors, this tool offers dynamic Gantt chart animations, live simulation capabilities, and comparative analysis across multiple algorithms.

🔧 Key Highlights
Dynamic Visualization: Watch animated Gantt charts and explore detailed metrics for each scheduling strategy.

Side-by-Side Comparison: Execute several algorithms on the same process dataset and analyze performance differences.

Live Simulation Mode: Observe scheduling decisions unfold in real time, with live updates to process states and queues.

Editable Process Table: Add, modify, or delete processes with custom arrival times, burst durations, and priorities.

Algorithm Picker: Select from a range of preemptive and non-preemptive scheduling methods.

🧠 Algorithms Included
FCFS – First Come First Serve

SJF – Shortest Job First

SRTF – Shortest Remaining Time First

Priority Scheduling – Both Preemptive and Non-Preemptive

HRRN – Highest Response Ratio Next

Round Robin

🛠️ Technology Stack
Frontend: React (powered by Vite), styled with Tailwind CSS, enhanced with Framer Motion

Backend: Node.js with Express

API Design: RESTful, stateless, and easily extensible

🚀 Getting Started
Requirements
Node.js (version 16 or higher)

npm (Node Package Manager)

Setup Instructions
Clone the repository

```
git clone <https://github.com/mdk018/Schedulify.git>
cd os-scheduling-algorithms
```
Install dependencies

```
cd server
npm install
cd ../client
npm install
```
Start the backend server

```
cd ../server
npm start
```
Launch the frontend

```
cd ../client
npm run dev
```
Access the application Open your browser and navigate to http://localhost:5173

📁 Project Layout
```
os-scheduling-algorithms/
  ├── server/   # Backend logic and scheduling algorithm implementations
  └── client/   # Frontend interface, components, and pages
```
🧭 Application Overview
Dashboard: Entry point with navigation and overview.

Algorithm Visualizer: Input process data, choose an algorithm, and view execution timeline and stats.

Performance Comparison: Analyze multiple algorithms side by side.

Live Simulator: Step through scheduling logic interactively.
