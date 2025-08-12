// algorithms/roundRobin.js

export function roundRobin(processesInput, timeQuantum) {
    const processes = processesInput.map((p) => ({ ...p }));
    const n = processes.length;
    const queue = [];
  
    const ganttChart = [];
    const processStats = {};
    const remainingBurstTimes = {};
    const arrived = Array(n).fill(false);
  
    let currentTime = 0;
    let completed = 0;
  
    processes.forEach((p) => {
      remainingBurstTimes[p.id] = p.burstTime;
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
  
    // Sort by arrival time initially
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    // Add the first arriving process(es) to the queue
    let i = 0;
    while (i < n && processes[i].arrivalTime <= currentTime) {
      queue.push(processes[i]);
      arrived[i] = true;
      i++;
    }
  
    while (completed < n) {
      if (queue.length === 0) {
        currentTime++;
        while (i < n && processes[i].arrivalTime <= currentTime) {
          queue.push(processes[i]);
          arrived[i] = true;
          i++;
        }
        continue;
      }
  
      const current = queue.shift();
      const execTime = Math.min(timeQuantum, remainingBurstTimes[current.id]);
      const startTime = currentTime;
      const endTime = startTime + execTime;
      currentTime = endTime;
      remainingBurstTimes[current.id] -= execTime;
  
      // Gantt chart entry
      ganttChart.push({
        processId: current.id,
        startTime,
        endTime,
      });
  
      // Add newly arrived processes to the queue
      while (i < n && processes[i].arrivalTime <= currentTime) {
        if (!arrived[i]) {
          queue.push(processes[i]);
          arrived[i] = true;
        }
        i++;
      }
  
      // If the process is not yet finished, push it back to the queue
      if (remainingBurstTimes[current.id] > 0) {
        queue.push(current);
      } else {
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
  
   