"use client";

import { motion } from "framer-motion";
import { FiGithub, FiZap, FiTrendingUp, FiUsers, FiAward } from "react-icons/fi";

export const metadata = {
  title: 'ShepherdAI',
  description: 'A compassionate Christian conversational assistant',
}

const features = [
  { icon: <FiZap />, title: "Spirit-Led Insights", desc: "Wisdom-driven responses aligned with scripture." },
  { icon: <FiTrendingUp />, title: "Growth Focused", desc: "Tools to help you mature in your daily walk." },
  { icon: <FiUsers />, title: "Community First", desc: "Built for fellowship and shared encouragement." },
  { icon: <FiAward />, title: "Faithful Accuracy", desc: "Reliable guidance rooted in Christian values." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
          Guided by Faith. <br /> Powered by AI.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          ShepherdAI is your compassionate companion for scriptural insight, prayerful reflection, and spiritual growth.
        </p>
        
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
            Get Started
          </button>
          <a href="https://github.com" className="flex items-center gap-2 px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <FiGithub /> GitHub
          </a>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="p-8 rounded-3xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group"
          >
            <div className="text-3xl text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}