// app/components/common/Header.js
'use client';

import { motion } from 'framer-motion';
import { FiBook, FiMessageSquare, FiSearch, FiFileText } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function Header({ activeTab, setActiveTab }) {
  const { darkMode } = useDarkMode();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg shadow-lg"
    >
      <div className="max-w-[98%] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => setActiveTab('chat')}
          >
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} shadow-sm`}>
              <FiBook className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-serif">
                Indian Legal Research Assistant
              </h1>
              <p className={`text-xs tracking-wider ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
                POWERED BY OOUM AI
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`relative px-4 py-2 rounded-lg transition-all ${activeTab === 'chat' 
                ? `${darkMode ? 'bg-indigo-700/30 text-indigo-300' : 'bg-indigo-100/80 text-indigo-700'} shadow-inner`
                : `${darkMode ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
              } cursor-pointer`}
            >
              <div className="flex items-center">
                <FiMessageSquare className="mr-2 text-lg" />
                <span className="font-medium">Chat</span>
              </div>
              {activeTab === 'chat' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className={`absolute inset-x-0 -bottom-1 h-0.5 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('judgment')}
              className={`relative px-4 py-2 rounded-lg transition-all ${activeTab === 'judgment' 
                ? `${darkMode ? 'bg-indigo-700/30 text-indigo-300' : 'bg-indigo-100/80 text-indigo-700'} shadow-inner`
                : `${darkMode ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
              } cursor-pointer`}
            >
              <div className="flex items-center">
                <FiSearch className="mr-2 text-lg" />
                <span className="font-medium">Judgments</span>
              </div>
              {activeTab === 'judgment' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className={`absolute inset-x-0 -bottom-1 h-0.5 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab('docReview')}
              className={`relative px-4 py-2 rounded-lg transition-all ${activeTab === 'docReview' 
                ? `${darkMode ? 'bg-indigo-700/30 text-indigo-300' : 'bg-indigo-100/80 text-indigo-700'} shadow-inner`
                : `${darkMode ? 'text-gray-400 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`
              } cursor-pointer`}
            >
              <div className="flex items-center">
                <FiFileText className="mr-2 text-lg" />
                <span className="font-medium">Doc Review</span>
              </div>
              {activeTab === 'docReview' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className={`absolute inset-x-0 -bottom-1 h-0.5 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}
                />
              )}
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}