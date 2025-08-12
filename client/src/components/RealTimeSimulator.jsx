import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RealTimeSimulator = ({ algorithm, processes, timeQuantum }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [processStates, setProcessStates] = useState({});
  const [readyQueue, setReadyQueue] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [cpuUtilization, setCpuUtilization] = useState(0);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [roundRobinQueue, setRoundRobinQueue] = useState([]);
  const intervalRef = useRef(null);

  // --- Refs for latest state ---
  const processStatesRef = useRef(processStates);
  const currentProcessRef = useRef(currentProcess);
  const currentTimeRef = useRef(currentTime);
  const roundRobinQueueRef = useRef(roundRobinQueue);
  const completedProcessesRef = useRef(completedProcesses);

  useEffect(() => { processStatesRef.current = processStates; }, [processStates]);
  useEffect(() => { currentProcessRef.current = currentProcess; }, [currentProcess]);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);
  useEffect(() => { roundRobinQueueRef.current = roundRobinQueue; }, [roundRobinQueue]);
  useEffect(() => { completedProcessesRef.current = completedProcesses; }, [completedProcesses]);

  // Process states: READY, RUNNING, WAITING, TERMINATED
  const initializeProcessStates = () => {
    const states = {};
    processes.forEach(process => {
      states[process.id] = {
        state: process.arrivalTime === 0 ? 'READY' : 'WAITING',
        remainingTime: process.burstTime,
        arrivalTime: process.arrivalTime,
        priority: process.priority,
        waitingTime: 0,
        responseTime: -1,
        timeInQueue: 0 // For Round Robin
      };
    });
    setProcessStates(states);
    setCompletedProcesses([]);
    setRoundRobinQueue([]);
  };

  const updateQueues = () => {
    const ready = [];
    const waiting = [];
    
    Object.entries(processStatesRef.current).forEach(([id, state]) => {
      if (state.state === 'READY') {
        ready.push({ id, ...state });
      } else if (state.state === 'WAITING' && currentTimeRef.current >= state.arrivalTime) {
        waiting.push({ id, ...state });
      }
    });

    setReadyQueue(ready);
    setWaitingQueue(waiting);
  };

  const selectNextProcess = () => {
    const available = readyQueue.concat(waitingQueue);
    
    if (available.length === 0) return null;

    switch (algorithm) {
      case 'FCFS':
        return available.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      
      case 'SJF':
        return available.sort((a, b) => a.remainingTime - b.remainingTime)[0];
      
      case 'SRTF':
        return available.sort((a, b) => a.remainingTime - b.remainingTime)[0];
      
      case 'PS-NP':
      case 'PS-P':
        return available.sort((a, b) => a.priority - b.priority)[0];
      
      case 'RR':
        // Round Robin logic
        if (roundRobinQueueRef.current.length > 0) {
          return roundRobinQueueRef.current[0];
        }
        return available[0];
      
      case 'HRRN':
        // Calculate response ratio for each process
        const withResponseRatio = available.map(process => ({
          ...process,
          responseRatio: (process.waitingTime + process.remainingTime) / process.remainingTime
        }));
        return withResponseRatio.sort((a, b) => b.responseRatio - a.responseRatio)[0];
      
      default:
        return available[0];
    }
  };

  // --- Main simulation logic, always using refs ---
  const executeStepRef = useRef();
  executeStepRef.current = () => {
    // Check for new arrivals
    const newStates = { ...processStatesRef.current };
    Object.entries(newStates).forEach(([id, state]) => {
      if (state.state === 'WAITING' && currentTimeRef.current >= state.arrivalTime) {
        state.state = 'READY';
        if (state.responseTime === -1) {
          state.responseTime = currentTimeRef.current - state.arrivalTime;
        }
      }
    });

    // Update waiting times for ready processes
    Object.values(newStates).forEach(process => {
      if (process.state === 'READY' && process.id !== currentProcessRef.current?.id) {
        process.waitingTime++;
      }
    });

    let nextCurrentProcess = currentProcessRef.current;
    let nextRoundRobinQueue = [...roundRobinQueueRef.current];
    let nextCompletedProcesses = [...completedProcessesRef.current];

    if (nextCurrentProcess) {
      // Execute current process
      const process = newStates[nextCurrentProcess.id];
      process.remainingTime--;
      process.timeInQueue++;
      if (process.remainingTime <= 0) {
        // Process completed
        process.state = 'TERMINATED';
        nextCompletedProcesses.push(nextCurrentProcess.id);
        nextCurrentProcess = null;
      } else if (algorithm === 'RR' && process.timeInQueue >= timeQuantum) {
        // Time quantum expired for Round Robin
        process.state = 'READY';
        process.timeInQueue = 0;
        nextRoundRobinQueue = [...nextRoundRobinQueue.slice(1), nextCurrentProcess];
        nextCurrentProcess = null;
      } else if (algorithm === 'SRTF' || algorithm === 'PS-P') {
        // Check if a higher priority process arrived
        const available = readyQueue.concat(waitingQueue);
        const shouldPreempt = available.some(p => {
          if (algorithm === 'SRTF') {
            return p.remainingTime < process.remainingTime;
          } else if (algorithm === 'PS-P') {
            return p.priority < process.priority;
          }
          return false;
        });
        if (shouldPreempt) {
          process.state = 'READY';
          nextCurrentProcess = null;
        }
      }
    } else {
      // Select new process
      const nextProcess = selectNextProcess();
      if (nextProcess) {
        newStates[nextProcess.id].state = 'RUNNING';
        newStates[nextProcess.id].timeInQueue = 0;
        nextCurrentProcess = nextProcess;
        // Update Round Robin queue
        if (algorithm === 'RR') {
          nextRoundRobinQueue = nextRoundRobinQueue.filter(p => p.id !== nextProcess.id);
        }
      }
    }

    setProcessStates(newStates);
    setCurrentProcess(nextCurrentProcess);
    setRoundRobinQueue(nextRoundRobinQueue);
    setCompletedProcesses(nextCompletedProcesses);
    setCurrentTime(prev => prev + 1);
    updateQueues();
    // Calculate CPU utilization
    const utilization = nextCurrentProcess ? 100 : 0;
    setCpuUtilization(utilization);
    // Add to execution history
    setExecutionHistory(prev => [...prev, {
      time: currentTimeRef.current,
      process: nextCurrentProcess?.id || 'IDLE',
      cpuUtilization: utilization
    }]);
    // Check if all processes are completed
    const allCompleted = Object.values(newStates).every(p => p.state === 'TERMINATED');
    if (allCompleted) {
      pauseSimulation();
    }
  };

  const startSimulation = () => {
    setIsRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      executeStepRef.current();
    }, speed);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSimulation = () => {
    pauseSimulation();
    setCurrentTime(0);
    setCurrentProcess(null);
    setExecutionHistory([]);
    setCpuUtilization(0);
    setCompletedProcesses([]);
    setRoundRobinQueue([]);
    initializeProcessStates();
  };

  const stepForward = () => {
    if (!isRunning) {
      executeStepRef.current();
    }
  };

  useEffect(() => {
    initializeProcessStates();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [processes]);

  useEffect(() => {
    updateQueues();
  }, [processStates, currentTime]);

  // Initialize Round Robin queue when processes change
  useEffect(() => {
    if (algorithm === 'RR') {
      const initialQueue = processes
        .filter(p => p.arrivalTime === 0)
        .map(p => ({ id: p.id, ...processStates[p.id] }));
      setRoundRobinQueue(initialQueue);
    }
  }, [processes, algorithm]);

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Real-Time Process Simulation</h2>
      
      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={isRunning ? pauseSimulation : startSimulation}
          className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={stepForward}
          disabled={isRunning}
          className="btn btn-secondary flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          <SkipForward className="h-4 w-4 mr-2" />
          Step
        </button>
        
        <button
          onClick={resetSimulation}
          className="btn btn-outline flex items-center px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-red-500"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </button>
        
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">Speed:</label>
          <input
            type="range"
            min="100"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-white text-sm">{speed}ms</span>
        </div>
      </div>

      {/* Current State Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Current Time</h3>
          <p className="text-3xl font-bold text-blue-300">{currentTime}</p>
        </div>
        
        <div className="bg-green-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">CPU Utilization</h3>
          <p className="text-3xl font-bold text-green-300">{cpuUtilization}%</p>
        </div>
        
        <div className="bg-purple-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Running Process</h3>
          <p className="text-3xl font-bold text-purple-300">
            {currentProcess ? currentProcess.id : 'IDLE'}
          </p>
        </div>
      </div>

      {/* Process States */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Process States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(processStates).map(([id, state]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-3 rounded-lg border-2 ${
                state.state === 'RUNNING' ? 'border-green-500 bg-green-900' :
                state.state === 'READY' ? 'border-yellow-500 bg-yellow-900' :
                state.state === 'WAITING' ? 'border-red-500 bg-red-900' :
                state.state === 'TERMINATED' ? 'border-gray-500 bg-gray-700' :
                'border-gray-500 bg-gray-800'
              }`}
            >
              <div className="font-bold text-white">{id}</div>
              <div className="text-sm text-gray-300">{state.state}</div>
              <div className="text-xs text-gray-400">
                Remaining: {state.remainingTime}
              </div>
              {state.waitingTime > 0 && (
                <div className="text-xs text-gray-400">
                  Wait: {state.waitingTime}
                </div>
              )}
              {algorithm === 'RR' && state.state === 'RUNNING' && (
                <div className="text-xs text-gray-400">
                  Time in Queue: {state.timeInQueue}/{timeQuantum}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Queue Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Ready Queue</h3>
          <div className="flex flex-wrap gap-2">
            {readyQueue.map((process, index) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
              >
                {process.id}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Waiting Queue</h3>
          <div className="flex flex-wrap gap-2">
            {waitingQueue.map((process, index) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
              >
                {process.id}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Round Robin Queue (if applicable) */}
      {algorithm === 'RR' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Round Robin Queue</h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {roundRobinQueue.map((process, index) => (
                <motion.div
                  key={process.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  {process.id}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Execution Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Execution Timeline</h3>
        <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {executionHistory.slice(-20).map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                  entry.process === 'IDLE' ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white'
                }`}
                title={`Time: ${entry.time}, Process: ${entry.process}`}
              >
                {entry.process === 'IDLE' ? '-' : entry.process}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Status */}
      {completedProcesses.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Completed Processes</h3>
          <div className="flex flex-wrap gap-2">
            {completedProcesses.map((processId, index) => (
              <motion.div
                key={processId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-700 text-white px-3 py-1 rounded-md text-sm"
              >
                {processId}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeSimulator; 