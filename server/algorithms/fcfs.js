// algorithms/fcfs.js

export function fcfs(processesInput) {
    const processes = processesInput
      .map((p) => ({ ...p }))
      .sort((a, b) => a.arrivalTime - b.arrivalTime); // Sort by arrival time
  
    const n = processes.length;
    let currentTime = 0;
  
    const ganttChart = [];
    const processStats = {};
  
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
  
    for (const process of processes) {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const endTime = startTime + process.burstTime;
      currentTime = endTime;
  
      // Gantt chart entry
      ganttChart.push({
        processId: process.id,
        startTime,
        endTime,
      });
  
      // Update process stats
      const stats = processStats[process.id];
      stats.completionTime = endTime;
      stats.turnaroundTime = endTime - process.arrivalTime;
      stats.waitingTime = stats.turnaroundTime - process.burstTime;
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
  