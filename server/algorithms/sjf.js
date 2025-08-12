 
export function sjf(processesInput) {
    const processes = processesInput.map((p) => ({ ...p }));
    const n = processes.length;
    let currentTime = 0;
    let completed = 0;
  
    const ganttChart = [];
    const processStats = {};
    const isCompleted = Array(n).fill(false);
  
    processes.forEach((p) => {
      processStats[p.id] = {
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime: 0,
        turnaroundTime: 0,
        waitingTime: 0,
        priority: p.priority ?? null,
      };
    });
  
    while (completed < n) {
      const available = processes
        .map((p, idx) => ({ ...p, index: idx }))
        .filter((p, idx) => p.arrivalTime <= currentTime && !isCompleted[idx])
        .sort((a, b) => a.burstTime - b.burstTime);
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      const next = available[0];
      const idx = next.index;
  
      const start = currentTime;
      const end = start + next.burstTime;
      currentTime = end;
  
      // Gantt chart entry
      ganttChart.push({ processId: next.id, startTime: start, endTime: end });
  
      // Update stats
      processStats[next.id].completionTime = end;
      processStats[next.id].turnaroundTime = end - next.arrivalTime;
      processStats[next.id].waitingTime =
        processStats[next.id].turnaroundTime - next.burstTime;
  
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
  