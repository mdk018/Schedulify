import React from 'react';
import { motion } from "framer-motion"; // fix: should be 'framer-motion'
import ProcessForm from './ProcessForm';
import { useScheduling } from '../SchedulingContext';

const Visualize = () => {
  const{setIsCompare} = useScheduling();
  setIsCompare(false);
  return (
    <div className="flex flex-col mt-7 px-4 items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-2xl"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Visualize Scheduling Algorithms
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Configure processes, select an algorithm, and visualize CPU scheduling with Gantt charts and performance metrics.
        </p>
      </motion.div>

      <ProcessForm/>
    </div>
  );
};

export default Visualize;
