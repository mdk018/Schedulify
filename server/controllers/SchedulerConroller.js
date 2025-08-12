import { sjf } from "../algorithms/sjf.js";
import { fcfs } from "../algorithms/fcfs.js";
import { priorityPreemptive } from "../algorithms/priorityPreemptive.js";
import { priorityNonPreemptive } from "../algorithms/priorityNonPreemptive.js";
import { hrrn } from "../algorithms/hrrn.js";
import { roundRobin } from "../algorithms/roundRobin.js";
import { srtf } from "../algorithms/srtf.js";

export const scheduleProcesses = (req, res) => {
  const { algorithm, processes, timeQuantum } = req.body;

  if (!algorithm || !processes || !Array.isArray(processes)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  switch (algorithm) {
    case "SJF":
      return res.json(sjf(processes));
    case "FCFS":
      return res.json(fcfs(processes))
    case "PS-P":
      return res.json(priorityPreemptive(processes))
    case "PS-NP":
      return res.json(priorityNonPreemptive(processes))
    case "HRRN":
      return res.json(hrrn(processes))
    case "RR":
      return res.json(roundRobin(processes ,timeQuantum)) 
    case "SRTF":
      return res.json(srtf(processes)) 
    default:
      return res.status(400).json({ error: "Unsupported algorithm" });
  }
};