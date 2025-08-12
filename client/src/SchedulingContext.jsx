import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const SchedulingContext = createContext();

// Provider component
export const SchedulingProvider = ({ children }) => {
  const [processes, setProcesses] = useState(() => {
    // Initialize from localStorage if exists, else empty array
    const stored = localStorage.getItem("processes");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(() => {
    const stored = localStorage.getItem("selectedAlgorithm");
    return stored || "FCFS"; // default algorithm
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Sync changes to localStorage
  useEffect(() => {
    localStorage.setItem("processes", JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem("selectedAlgorithm", selectedAlgorithm);
  }, [selectedAlgorithm]);

 

   const [selectedAlgorithms, setSelectedAlgorithms] = useState(() => {
    const stored = localStorage.getItem("selectedAlgorithms");
    return stored ? JSON.parse(stored) : [];
  });

  const [algorithmsData, setAlgorithmsData] = useState([]);


  const[isCompare,setIsCompare] = useState(false);

  return (
    <SchedulingContext.Provider
      value={{
        processes,
        setProcesses,
        selectedAlgorithm,
        setSelectedAlgorithm,
        selectedAlgorithms,
        setSelectedAlgorithms,
        isButtonDisabled,
        setIsButtonDisabled,
        isCompare,
        setIsCompare,
        algorithmsData,
        setAlgorithmsData
      }}
    >
      {children}
    </SchedulingContext.Provider>
  );
};

// Custom hook for easier access
export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error("useScheduling must be used within a SchedulingProvider");
  }
  return context;
};
