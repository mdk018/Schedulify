// algorithms/priorityNonPreemptive.js

export function priorityNonPreemptive(processesInput) {
    const processes = processesInput.map((p, idx) => ({ ...p, index: idx }));
    const n = processes.length;
  
    let currentTime = 0;
    let completed = 0;
  
    const ganttChart = [];
    const processStats = {};
    const isCompleted = Array(n).fill(false);
  
    // Initialize process stats
    processes.forEach((p) => {
      processStats[p.id] = {
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime: 0,
        turnaroundTime: 0,
        waitingTime: 0,
        priority: p.priority,
      };
    });
  
    while (completed < n) {
      // Get all available processes (arrived and not completed)
      const available = processes
        .filter((p, idx) => p.arrivalTime <= currentTime && !isCompleted[idx])
        .sort((a, b) => {
          // Sort by priority (lower number is higher priority), then arrivalTime
          if (a.priority === b.priority) {
            return a.arrivalTime - b.arrivalTime;
          }
          return a.priority - b.priority;
        });
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      // Pick highest priority process
      const current = available[0];
      const idx = current.index;
  
      const start = currentTime;
      const end = start + current.burstTime;
  
      // Update Gantt chart
      ganttChart.push({
        processId: current.id,
        startTime: start,
        endTime: end,
      });
  
      // Update stats
      processStats[current.id].completionTime = end;
      processStats[current.id].turnaroundTime = end - current.arrivalTime;
      processStats[current.id].waitingTime =
        processStats[current.id].turnaroundTime - current.burstTime;
  
      // Move time forward
      currentTime = end;
      isCompleted[idx] = true;
      completed++;
    }
  
    const statsArray = Object.values(processStats);
    const totalWT = statsArray.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTAT = statsArray.reduce((sum, p) => sum + p.turnaroundTime, 0);
  
    return {
      ganttChart,
      processStats: statsArray,
      averageWaitingTime: parseFloat((totalWT / n).toFixed(2)),
      averageTurnaroundTime: parseFloat((totalTAT / n).toFixed(2)),
    };
  }
  