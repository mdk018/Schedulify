# OS Scheduling Algorithms Visualizer

A full-stack web application to **visualize, simulate, and compare classic CPU scheduling algorithms**. Designed for students and educators, this tool provides interactive Gantt charts, real-time simulation, and side-by-side algorithm comparison.

---

## Features

- **Visualize Algorithms**: Animated Gantt charts and detailed process statistics for each scheduling algorithm.
- **Compare Performance**: Run multiple algorithms on the same process set and compare their metrics.
- **Real-Time Simulator**: Step through scheduling decisions in real time, watching process states and queues update live.
- **Interactive Process Table**: Add, edit, and remove processes with custom arrival, burst, and priority values.
- **Algorithm Selector**: Choose from a variety of preemptive and non-preemptive scheduling algorithms.

---

## Supported Algorithms

- **FCFS** (First Come First Serve)
- **SJF** (Shortest Job First)
- **SRTF** (Shortest Remaining Time First)
- **Priority Scheduling** (Preemptive & Non-Preemptive)
- **HRRN** (Highest Response Ratio Next)
- **Round Robin**

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **API**: RESTful, stateless, easy to extend

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd os-scheduling-algorithms
   ```

2. **Install dependencies:**
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

3. **Run the backend:**
   ```bash
   cd ../server
   npm start
   ```

4. **Run the frontend:**
   ```bash
   cd ../client
   npm run dev
   ```

5. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
os-scheduling-algorithms/
  ├── server/   # Express backend, scheduling algorithms
  └── client/   # React frontend, UI components, pages
```

---

## Usage

- **Home**: Overview and navigation.
- **Visualize Algorithms**: Input processes, select an algorithm, and view the Gantt chart and stats.
- **Compare Performance**: Compare multiple algorithms side by side.
- **Real-Time Simulator**: Step through scheduling decisions interactively.

-------
