export function hrrn(processesInput) {
    const processes = processesInput.map(p => ({ ...p }));
    const n = processes.length;
    let currentTime = 0;
    let completed = 0;
  
    const ganttChart = [];
    const processStats = {};
    const isCompleted = Array(n).fill(false);
  
    processes.forEach(p => {
      processStats[p.id] = {
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        completionTime: 0,
        turnaroundTime: 0,
        waitingTime: 0,
      };
    });
  
    while (completed < n) {
      // Get all processes that have arrived and are not completed
      const available = processes
        .map((p, idx) => ({ ...p, index: idx }))
        .filter(p => p.arrivalTime <= currentTime && !isCompleted[p.index]);
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      // Calculate response ratio for each available process
      available.forEach(p => {
        const waitingTime = currentTime - p.arrivalTime;
        p.responseRatio = (waitingTime + p.burstTime) / p.burstTime;
      });
  
      // Select process with highest response ratio
      available.sort((a, b) => b.responseRatio - a.responseRatio);
      const next = available[0];
      const idx = next.index;
  
      const start = currentTime;
      const end = start + next.burstTime;
      currentTime = end;
  
      ganttChart.push({ processId: next.id, startTime: start, endTime: end });
  
      processStats[next.id].completionTime = end;
      processStats[next.id].turnaroundTime = end - next.arrivalTime;
      processStats[next.id].waitingTime = processStats[next.id].turnaroundTime - next.burstTime;
  
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
  