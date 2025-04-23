'use client';

import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

export default function AnalyzingPopup({ darkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-sm`}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative max-w-md w-full mx-4 p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center`}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { 
              repeat: Infinity, 
              duration: 2, 
              ease: "linear" 
            },
            scale: { 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }
          }}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}
        >
          <FiSearch className={`text-3xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </motion.div>
        
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
          Analyzing Legal Database
        </h3>
        
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Searching through thousands of judgments to find the most relevant cases...
        </p>
        
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2
              }}
              className={`w-3 h-3 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}