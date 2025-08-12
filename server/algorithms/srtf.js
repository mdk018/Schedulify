
export function srtf(processesInput) {
    const processes = processesInput.map((p) => ({ ...p }));
    const n = processes.length;
    let currentTime = 0;
    let completed = 0;
  
    const ganttChart = [];
    const processStats = {};
    const remainingTime = {};
    const isCompleted = Array(n).fill(false);
    const lastProcess = { id: null, start: null };
  
    processes.forEach((p) => {
      remainingTime[p.id] = p.burstTime;
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
      // Get available processes
      const available = processes
        .map((p, idx) => ({ ...p, index: idx }))
        .filter((p, idx) => p.arrivalTime <= currentTime && remainingTime[p.id] > 0)
        .sort((a, b) => {
          if (remainingTime[a.id] === remainingTime[b.id]) {
            return a.arrivalTime - b.arrivalTime;
          }
          return remainingTime[a.id] - remainingTime[b.id];
        });
  
      // If no process is available, jump to the next one that arrives
      if (available.length === 0) {
        const futureArrival = processes
          .filter((p) => remainingTime[p.id] > 0 && p.arrivalTime > currentTime)
          .map((p) => p.arrivalTime);
  
        if (futureArrival.length > 0) {
          currentTime = Math.min(...futureArrival);
        } else {
          break; // All processes completed
        }
  
        continue;
      }
  
      const current = available[0];
  
      if (lastProcess.id !== current.id) {
        // If context switch happens, push last process's segment
        if (lastProcess.id !== null) {
          ganttChart.push({
            processId: lastProcess.id,
            startTime: lastProcess.start,
            endTime: currentTime,
          });
        }
        lastProcess.id = current.id;
        lastProcess.start = currentTime;
      }
  
      // Execute process for 1 time unit
      remainingTime[current.id]--;
      currentTime++;
  
      // If process is completed
      if (remainingTime[current.id] === 0) {
        isCompleted[current.index] = true;
        completed++;
  
        // Close the last Gantt entry
        ganttChart.push({
          processId: current.id,
          startTime: lastProcess.start,
          endTime: currentTime,
        });
        lastProcess.id = null;
        lastProcess.start = null;
  
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
  
  // Sample test
  const processes = [
    { id: 'P1', arrivalTime: 0, burstTime: 7 },
    { id: 'P2', arrivalTime: 2, burstTime: 4 },
    { id: 'P3', arrivalTime: 4, burstTime: 1 },
    { id: 'P4', arrivalTime: 5, burstTime: 4 },
  ];
  
  const result = srtf(processes);
//   console.log(result);
  