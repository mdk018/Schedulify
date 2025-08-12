 

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Plus, RefreshCw, Trash, Loader2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GanttChart from "./GanttChart";
import AlgorithmSelector from "./AlgorithmSelector";
import RealTimeSimulator from "./RealTimeSimulator";

// Import your SchedulingContext hook
import { useScheduling } from "../SchedulingContext";

const ProcessForm = () => {
  const ganttRef = useRef(null);

  // Use context instead of local state
  const {
    processes,
    setProcesses,
    selectedAlgorithm,
    setSelectedAlgorithm,
    isButtonDisabled,
    setIsButtonDisabled,
    timeQuantum,
    setTimeQuantum,
    isCompare,
    setAlgorithmsData
  } = useScheduling();

  const [newProcess, setNewProcess] = useState({
    id: "P1",
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);

  // Update local newProcess id when processes change
  useEffect(() => {
    setNewProcess((prev) => ({
      ...prev,
      id: `P${processes.length + 1}`,
    }));

    // Disable run button if no processes
    setIsButtonDisabled(processes.length === 0);
  }, [processes, setIsButtonDisabled]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProcess((prev) => ({
      ...prev,
      [name]: name === "id" ? value : Math.max(0, parseInt(value) || 0),
    }));
  };

  const handleAddProcess = (e) => {
    e.preventDefault();
    const updatedProcesses = [...processes, newProcess];
    setProcesses(updatedProcesses);

    // Dispatch event if you still want
    window.dispatchEvent(
      new CustomEvent("processesUpdated", {
        detail: { processes: updatedProcesses },
      })
    );

    setNewProcess({
      id: `P${updatedProcesses.length + 1}`,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1,
    });
  };

  const handleReset = () => {
    setProcesses([]);
    setResult(null);
    setAlgorithmsData([]);
    setError(null);
    setNewProcess({ id: "P1", arrivalTime: 0, burstTime: 1, priority: 1 });

    // Dispatch event with empty array
    window.dispatchEvent(
      new CustomEvent("processesUpdated", {
        detail: { processes: [] },
      })
    );
  };

  const handleProcessChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = field === "id" ? value : parseInt(value) || 0;
    setProcesses(updated);
  };

const onRemoveProcess = (index) => {
  const updated = [...processes];
  updated.splice(index, 1);  // remove process first
  
  setProcesses(updated);  //here error i was getting

  if (updated.length === 0) {
    setResult(null);
    setAlgorithmsData([]);
    setError(null);
  }
};

  // Use selectedAlgorithm & setSelectedAlgorithm from context instead of local
  const algorithm = selectedAlgorithm;
  const setAlgorithm = setSelectedAlgorithm;

  const runScheduling = async () => {
    if (processes.length === 0) {
      setError("Please add at least one process.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowSimulator(false); // Hide simulator on new run
    try {
      const res = await axios.post("http://localhost:5000/api/schedule", {
        algorithm,
        processes,
        timeQuantum,
      });

      setResult(res.data);
    } catch (err) {
      setError("Failed to run scheduling. Please try again.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result && ganttRef.current) {
      ganttRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const isPriority = false; // you had this flag

  return (
    <div className="container mx-auto p-4 text-left">
      <div className="card p-6 mb-6 bg-gray-900 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-white">Process Configuration</h2>

        <form onSubmit={handleAddProcess} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            {["id", "arrivalTime", "burstTime", "priority"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-white mb-1">
                  {field === "id"
                    ? "Process ID"
                    : field === "arrivalTime"
                    ? "Arrival Time"
                    : field === "burstTime"
                    ? "Burst Time"
                    : "Priority"}
                </label>
                <input
                  type={field === "id" ? "text" : "number"}
                  name={field}
                  value={newProcess[field]}
                  onChange={handleInputChange}
                  min={field !== "id" ? "0" : undefined}
                  className="input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            <button
              type="submit"
              className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Process
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline flex items-center px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-red-500 transition"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Process ID</th>
                <th className="text-left py-2 px-3">Arrival Time</th>
                <th className="text-left py-2 px-3">Burst Time</th>
                {isPriority && <th className="text-left py-2 px-3">Priority</th>}
                <th className="text-left py-2 px-3">Priority</th>
                <th className="text-right py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No processes added yet.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {processes.map((process, index) => (
                    <motion.tr
                      key={`${process.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      {["id", "arrivalTime", "burstTime", "priority"].map((field) => (
                        <td key={field} className="py-3 px-3">
                          <input
                            type={field === "id" ? "text" : "number"}
                            value={process[field]}
                            onChange={(e) =>
                              handleProcessChange(index, field, e.target.value)
                            }
                            className="input w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min={field !== "id" ? "0" : undefined}
                          />
                        </td>
                      ))}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onRemoveProcess(index)}
                          className="text-red-600 hover:text-red-800 transition"
                          aria-label="Remove process"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Guidelines */}
      {!false && (
        <div className="card p-6 mb-6 bg-gray-900 rounded-lg shadow text-white">
          <h3 className="text-2xl font-bold mb-4">Algorithm Guidelines</h3>
          <div className="space-y-2">
            <p>
              <strong>FCFS:</strong> Simple but may cause long waiting times
              (Convoy Effect).
            </p>
            <p>
              <strong>SJF:</strong> Optimal for average waiting time, but suffers
              from starvation.
            </p>
            <p>
              <strong>SRTF:</strong> Preemptive SJF; better than SJF but still
              risks starvation.
            </p>
            <p>
              <strong>Priority:</strong> Good for time-critical processes, but can
              starve low-priority ones.
            </p>
            <p>
              <strong>Round Robin:</strong> Best for time-sharing systems, fair but
              can increase turnaround time.
            </p>
          </div>
        </div>
      )}

      {/* Algorithm Selector */}
      {!isCompare && (
        <AlgorithmSelector
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
        />
      )}

      {/* Run button */}
      {!isCompare && (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={runScheduling}
            disabled={isLoading || isButtonDisabled}
            className="btn btn-primary py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Scheduling
              </>
            )}
          </button>
        </div>
      )}

      {/* Gantt Chart Result */}
      {result && result.ganttChart?.length > 0 && (
        <motion.div
          ref={ganttRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GanttChart
            averageTurnaroundTime={result.averageTurnaroundTime}
            averageWaitingTime={result.averageWaitingTime}
            ganttChart={result.ganttChart}
            processStats={result.processStats}
          />

          {/* Show Run Real-Time Simulator button after results */}
          <div className="flex justify-center mt-6">
            <button
              className="btn btn-primary bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              onClick={() => setShowSimulator(true)}
            >
              Run Real-Time Simulator
            </button>
          </div>

          {/* Show RealTimeSimulator only if user clicks the button */}
          {showSimulator && (
            <RealTimeSimulator
              algorithm={algorithm}
              processes={processes}
              timeQuantum={timeQuantum}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProcessForm;
