
import React from "react";
import { motion } from "framer-motion";

// Helper function to generate distinct colors
const generateColors = (count) => {
  const colors = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360;
    colors.push(`hsl(${hue}, 70%, 65%)`);
  }

  return colors;
};

const GanttChart = ({
  averageTurnaroundTime,
  averageWaitingTime,
  ganttChart,
  processStats,
}) => {
  // Map each unique process ID to a unique color
  const processIds = [...new Set(ganttChart.map(item => item.processId))];
  const colors = generateColors(processIds.length);
  const colorMap = {};
  processIds.forEach((id, index) => {
    colorMap[id] = colors[index];
  });

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-6 text-white">CPU Scheduling Summary</h2>

      {/* Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Average Turnaround Time</p>
          <p className="text-2xl font-bold text-blue-800">{averageTurnaroundTime?.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Average Waiting Time</p>
          <p className="text-2xl font-bold text-green-800">{averageWaitingTime?.toFixed(2)}</p>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Gantt Chart</h3>
        <div className="flex items-center space-x-1 overflow-x-auto p-4 bg-gray-950 rounded-lg">
          {ganttChart.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center min-w-max"
            >
              <div
                className="px-4 py-2 rounded-md text-white font-medium shadow-sm"
                style={{ backgroundColor: colorMap[entry.processId] }}
              >
                {entry.processId}
              </div>
              <div className="text-xs text-white mt-1 flex justify-between w-full">
                <span>{entry.startTime}</span>
                <span>{entry.endTime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Process Stats Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4  text-white">Process Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-900">
              <tr>
                <th className="border px-4 py-2 text-left">Process ID</th>
                <th className="border px-4 py-2 text-left">Arrival Time</th>
                <th className="border px-4 py-2 text-left">Burst Time</th>
                <th className="border px-4 py-2 text-left">Completion Time</th>
                <th className="border px-4 py-2 text-left">Turnaround Time</th>
                <th className="border px-4 py-2 text-left">Waiting Time</th>
              </tr>
            </thead>
            <tbody>
              {processStats.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 hover:text-black">
                  <td className="border px-4 py-2">{p.id}</td>
                  <td className="border px-4 py-2">{p.arrivalTime}</td>
                  <td className="border px-4 py-2">{p.burstTime}</td>
                  <td className="border px-4 py-2">{p.completionTime}</td>
                  <td className="border px-4 py-2">{p.turnaroundTime}</td>
                  <td className="border px-4 py-2">{p.waitingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;


