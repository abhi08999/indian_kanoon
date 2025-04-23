'use client';

import { motion } from 'framer-motion';

export default function UserMessage({ content = '', darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end cursor-default"
    >
      <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${darkMode ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white rounded-br-none shadow-lg`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30"></div>
        <p className="relative z-10 whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}