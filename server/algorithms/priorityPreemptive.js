// algorithms/priority.js

export function priorityPreemptive(processesInput) {
    const processes = processesInput.map((p, idx) => ({
      ...p,
      remainingTime: p.burstTime,
      index: idx,
    }));
  
    const n = processes.length;
    let currentTime = 0;
    let completed = 0;
  
    const ganttChart = [];
    const processStats = {};
    const isCompleted = Array(n).fill(false);
    let lastProcessId = null;
  
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
      // Get available processes that have arrived and are not completed
      const available = processes
        .filter((p, idx) => p.arrivalTime <= currentTime && !isCompleted[idx])
        .sort((a, b) => {
          if (a.priority === b.priority) {
            return a.arrivalTime - b.arrivalTime;
          }
          return a.priority - b.priority; // Lower number = higher priority
        });
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      const current = available[0];
      current.remainingTime--;
  
      if (
        ganttChart.length === 0 ||
        lastProcessId !== current.id
      ) {
        // Start new Gantt block
        ganttChart.push({
          processId: current.id,
          startTime: currentTime,
          endTime: currentTime + 1,
        });
      } else {
        // Extend last Gantt block
        ganttChart[ganttChart.length - 1].endTime++;
      }
  
      lastProcessId = current.id;
      currentTime++;
  
      if (current.remainingTime === 0) {
        const idx = current.index;
        isCompleted[idx] = true;
        completed++;
  
        processStats[current.id].completionTime = currentTime;
        processStats[current.id].turnaroundTime =
          currentTime - current.arrivalTime;
        processStats[current.id].waitingTime =
          processStats[current.id].turnaroundTime - current.burstTime;
      }
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
  