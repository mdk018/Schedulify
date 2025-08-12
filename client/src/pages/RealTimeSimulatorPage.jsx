import React from "react";
import RealTimeSimulator from "../components/RealTimeSimulator";
import { useScheduling } from "../SchedulingContext";
import AlgorithmSelector from "../components/AlgorithmSelector";

const RealTimeSimulatorPage = () => {
  const {
    processes,
    setProcesses,
    selectedAlgorithm,
    setSelectedAlgorithm,
    timeQuantum,
    setTimeQuantum,
  } = useScheduling();

  // Table row handlers (adapted from ProcessForm)
  const handleProcessChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = field === "id" ? value : parseInt(value) || 0;
    setProcesses(updated);
  };

  const handleAddProcess = (e) => {
    e.preventDefault();
    setProcesses([
      ...processes,
      {
        id: `P${processes.length + 1}`,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
      },
    ]);
  };

  const handleRemoveProcess = (index) => {
    const updated = [...processes];
    updated.splice(index, 1);
    setProcesses(updated);
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Real-Time Simulator Engine</h1>
      {/* Algorithm Selector */}
      <AlgorithmSelector
        algorithm={selectedAlgorithm}
        setAlgorithm={setSelectedAlgorithm}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
      />
      {/* Process Table */}
      <div className="card p-6 mb-6 bg-gray-900 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-white">Process Configuration</h2>
        <form onSubmit={handleAddProcess} className="mb-6">
          <button
            type="submit"
            className="btn btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Process
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="text-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Process ID</th>
                <th className="text-left py-2 px-3">Arrival Time</th>
                <th className="text-left py-2 px-3">Burst Time</th>
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
                processes.map((process, index) => (
                  <tr key={`${process.id}-${index}`} className="border-b border-gray-200 hover:bg-gray-100">
                    {["id", "arrivalTime", "burstTime", "priority"].map((field) => (
                      <td key={field} className="py-3 px-3">
                        <input
                          type={field === "id" ? "text" : "number"}
                          value={process[field]}
                          onChange={(e) => handleProcessChange(index, field, e.target.value)}
                          className="input w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min={field !== "id" ? "0" : undefined}
                        />
                      </td>
                    ))}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveProcess(index)}
                        className="text-red-600 hover:text-red-800 transition"
                        aria-label="Remove process"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Simulator */}
      <RealTimeSimulator
        algorithm={selectedAlgorithm}
        processes={processes}
        timeQuantum={timeQuantum || 2}
      />
    </div>
  );
};

export default RealTimeSimulatorPage; 