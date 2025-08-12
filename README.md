# ⏳ OS Scheduling Algorithms Visualizer

An **interactive full-stack web application** built to **demonstrate, simulate, and evaluate** classic CPU scheduling techniques.  
Tailored for **learners** and **instructors**, this tool offers **dynamic Gantt chart animations**, **live simulations**, and **side-by-side performance comparisons**.

---

## 🔧 Key Highlights
- 🎯 **Dynamic Visualization** – Animated Gantt charts with detailed metrics for each scheduling strategy.  
- 📊 **Side-by-Side Comparison** – Execute multiple algorithms on the same process dataset and compare performance.  
- ⏱ **Live Simulation Mode** – Watch scheduling decisions unfold in real-time with process state updates.  
- 📝 **Editable Process Table** – Add, modify, or delete processes with custom arrival times, burst durations, and priorities.  
- 🎛 **Algorithm Picker** – Choose from a range of preemptive and non-preemptive scheduling methods.  

---

## 🧠 Algorithms Included
- **FCFS** – First Come First Serve  
- **SJF** – Shortest Job First  
- **SRTF** – Shortest Remaining Time First  
- **Priority Scheduling** – Preemptive & Non-Preemptive  
- **HRRN** – Highest Response Ratio Next  
- **Round Robin**  

---

## 🛠 Technology Stack
**Frontend:** React (Vite) • Tailwind CSS • Framer Motion  
**Backend:** Node.js • Express  
**API:** RESTful, stateless, easily extensible  

---

## 🚀 Getting Started

### Requirements
- **Node.js** (v16+)
- **npm** (Node Package Manager)

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/mdk018/Schedulify.git
cd os-scheduling-algorithms

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Start the backend server
cd ../server
npm start

# Launch the frontend
cd ../client
npm run dev
