
const AlgorithmSelector = ({algorithm,setAlgorithm, timeQuantum , setTimeQuantum}) => {
  const handleAlgorithmChange = (e) => {
    const selected = e.target.value;
    setAlgorithm(selected);
    // console.log("Selected:", selected);
  };

  const handleTimeQuantumChange = (e) => {
    const quantum = parseInt(e.target.value) || 1;
    setTimeQuantum(quantum);
    // console.log("Time Quantum:", quantum);
  };
  

  return (
    <div className="card p-6 mb-6  bg-gray-900  rounded-lg shadow">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Scheduling Algorithm</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="algorithm"
              className="block text-sm text-left font-medium text-text-secondary mb-2"
            >
              Select Algorithm
            </label>

            <select
              id="algorithm"
              value={algorithm}
              onChange={handleAlgorithmChange}
              className="input w-full"
            >
              <option value="">-- Choose --</option>
              {/* non preemptive */}
              <option value="FCFS">First Come First Serve (FCFS) - Non-preemptive </option>
              <option value="SJF">
                Shortest Job First (SJF) - Non-preemptive
              </option>
               <option value="PS-NP">
                Priority Scheduling - Non-preemptive
              </option>
              <option value="HRRN">
                Highest Response Ratio Next (HRRN) -- Non-preemptive 
              </option>
                {/* preemptive */}
              <option value="SRTF">
                Shortest Remaining Time First (SRTF) - Preemptive  
              </option>
              <option value="RR">Round Robin (RR) - Preemptive </option>
             
              <option value="PS-P">Priority Scheduling - Preemptive</option>
            </select>
          </div>


          {algorithm === "RR" && (
            <div>
              <label
                htmlFor="timeQuantum"
                className="block text-sm font-medium text-text-secondary mb-1"
              >
                Time Quantum
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="timeQuantum"
                  value={timeQuantum}
                  onChange={handleTimeQuantumChange}
                  className="input w-full"
                  min="1"
                  required
                />
                <span className="ml-2 text-text-tertiary">units</span>
              </div>
            </div>
          )}
        </div>


        <div className="p-3 bg-foreground rounded-md ">
          <h3 className="text-sm font-medium text-text-secondary mb-4 mt-3 text-left">
            Algorithm Description
          </h3>
          <p className="text-sm text-text-tertiary text-left">
            {getAlgorithmDescription(algorithm)}
          </p>
        </div>
        
        
      </div>
    </div>
  );
};

const getAlgorithmDescription = (algorithm) => {
  switch (algorithm) {
    case "FCFS":
      return "First Come First Serve (FCFS) executes processes in the order they arrive in the ready queue.";
    case "SJF":
      return "Shortest Job First (SJF) selects the process with the smallest burst time. Non-preemptive version.";
    case "SRTF":
      return "Shortest Remaining Time First (SRTF) is the preemptive version of SJF.";
    case "RR":
      return "Round Robin (RR) allocates a fixed time quantum to each process in a cyclic order.";
    case "PS-NP":
      return "Non-preemptive Priority Scheduling runs the highest priority process to completion.";
    case "PS-P":
      return "Preemptive Priority Scheduling always runs the highest priority process, preempting current one.";
    default:
      return "Select an algorithm to see its description.";
  }
};

export default AlgorithmSelector;
