// app/components/common/Header.js
'use client';

import { motion } from 'framer-motion';
import { FiBook } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useDarkMode } from '../../../hooks/useDarkMode';

export default function Header({ sidebarOpen }) {
  const { darkMode } = useDarkMode();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-30 ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-lg shadow-sm`}
      style={{ 
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'
      }}
    >
      <div className="max-w-[98%] mx-auto px-6 py-4 transition-all duration-300">
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className={`flex items-center space-x-4 ${sidebarOpen ? '' : 'ml-10'}`}
          >
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} shadow-sm`}>
              <FiBook className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-serif">
                Indian Legal Research Assistant
              </h1>
            </div>
          </motion.div>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}