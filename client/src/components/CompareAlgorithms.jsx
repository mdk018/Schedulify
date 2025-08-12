
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ProcessForm from "./ProcessForm";
import { useScheduling } from "../SchedulingContext"; // Adjust path

const algorithmsList = [
  { id: "FCFS", label: "First Come First Serve (FCFS) - Non-preemptive" },
  { id: "SJF", label: "Shortest Job First (SJF) - Non-preemptive" },
  { id: "PS-NP", label: "Priority Scheduling - Non-preemptive" },
  { id: "HRRN", label: "Highest Response Ratio Next (HRRN) - Non-preemptive" },
  { id: "SRTF", label: "Shortest Remaining Time First (SRTF) - Preemptive" },
  { id: "RR", label: "Round Robin (RR) - Preemptive" },
  { id: "PS-P", label: "Priority Scheduling - Preemptive" },
];

const CompareAlgorithms = () => {
  const { processes, selectedAlgorithms, setSelectedAlgorithms , setIsCompare ,algorithmsData,setAlgorithmsData} = useScheduling();
  
  const compareReff = useRef(null);
  setIsCompare(true);

  const handleCheckboxChange = (id) => {
    setSelectedAlgorithms((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const runCompare = async () => {
    const result = [];
    const timeQuantum = 2;

    for (let algo of selectedAlgorithms) {
      try {
        const res = await axios.post("http://localhost:5000/api/schedule", {
          algorithm: algo,
          processes,
          timeQuantum,
        });

        result.push({
          algo,
          averageWaitingTime: res.data.averageWaitingTime,
          averageTurnaroundTime: res.data.averageTurnaroundTime,
        });
      } catch (error) {
        console.error(`Error running algorithm ${algo}:`, error);
      }
    }
    setAlgorithmsData(result);
  };

  useEffect(() => {
    if (algorithmsData.length && compareReff.current) {
      compareReff.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [algorithmsData]);

  return (
    <div className="p-4">
      <div className="flex flex-col mt-7 px-4 items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-2xl"
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Compare Scheduling Algorithms
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Configure processes, select algorithms, and compare performance metrics.
          </p>
        </motion.div>
      </div>

      <ProcessForm isCompare={true} />

      <div className="container mx-auto p-4">
        <div className="card p-6 mb-6 bg-gray-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Select Algorithms to Compare</h2>
          <form className="flex flex-col gap-3">
            {algorithmsList.map(({ id, label }) => (
              <div key={id} className="flex flex-row gap-3 items-center">
                <input
                  type="checkbox"
                  id={id}
                  checked={selectedAlgorithms.includes(id)}
                  onChange={() => handleCheckboxChange(id)}
                  className="checkbox checkbox-accent"
                />
                <label htmlFor={id} className="cursor-pointer select-none">
                  {label}
                </label>
              </div>
            ))}
          </form>
        </div>

        <div className="card p-6 mb-6 bg-gray-900 rounded-lg shadow">
          <strong className="block mb-2">Selected Algorithms:</strong>
          {selectedAlgorithms.length > 0 ? (
            <ul className="list-disc pl-5">
              {selectedAlgorithms.map((id) => (
                <li key={id}>
                  {algorithmsList.find((algo) => algo.id === id)?.label || id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No algorithms selected</p>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button
          disabled={processes.length === 0 || selectedAlgorithms.length === 0}
          className={`p-2 ml-9 rounded-2xl cursor-pointer ${
            processes.length === 0 || selectedAlgorithms.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={runCompare}
        >
          Compare
        </button>
      </div>

      <div className="card max-w-7xl mx-auto mt-6 p-6 mb-6 bg-gray-900 rounded-lg shadow">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {algorithmsData.map((algorithm) => {
            const algoLabel =
              algorithmsList.find((item) => item.id === algorithm.algo)?.label ||
              algorithm.algo;

            return (
              <motion.div
                key={algorithm.algo}
                ref={compareReff}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300">
                  <div className="text-lg font-bold text-green-400 mb-2">{algoLabel}</div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Avg. Waiting Time</span>
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded-md">
                      {algorithm.averageWaitingTime.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Avg. Turnaround Time</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md">
                      {algorithm.averageTurnaroundTime.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareAlgorithms;