import React from 'react'
import Card from '../components/Card'
import { Clock2 } from 'lucide-react'
import { motion } from "framer-motion"

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">OS Process Scheduler Visualizer</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Understand CPU scheduling algorithms through interactive visualizations
          </p>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card
            title="Visualize Algorithms"
            description="See how different scheduling algorithms distribute CPU time among processes with animated Gantt charts and detailed metrics."
            button_text="Start Visualizing"
            path="/visualize"
            image={null}
          />
          <Card
            title="Compare Performance"
            description="Compare multiple scheduling algorithms side by side to understand their strengths, weaknesses, and optimal use cases."
            button_text="Compare Algorithms"
            path="/compare"
            image={null}
          />
          <Card
            title="Real-Time Simulator Engine"
            description="Step through scheduling algorithms in real time, watch process states change, and interactively control the simulation engine."
            button_text="Real-Time Simulator"
            path="/realtime-simulator"
            image={null}
          />
        </div>
      </motion.section>

      {/* Algorithms Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Supported Algorithms</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "First Come First Serve (FCFS)",
              description: "Simple non-preemptive algorithm that executes processes in order of arrival",
            },
            {
              name: "Shortest Job First (SJF)",
              description: "Non-preemptive algorithm that selects the process with the smallest burst time",
            },
            {
              name: "Shortest Remaining Time First (SRTF)",
              description: "Preemptive version of SJF that always executes the process with the least remaining time",
            },
            {
              name: "Round Robin (RR)",
              description: "Time-sharing algorithm that allocates a fixed time quantum to each process in a circular queue",
            },
            {
              name: "Priority Scheduling",
              description: "Both preemptive and non-preemptive versions that schedule based on priority values",
            },
            {
              name: "More Coming Soon",
              description: "Additional algorithms and variants will be added in future updates",
            },
          ].map((algo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-5 rounded-lg  shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-3">
                <Clock2 className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold text-lg">{algo.name}</h3>
              </div>
              <p className="text-text-tertiary">{algo.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Home