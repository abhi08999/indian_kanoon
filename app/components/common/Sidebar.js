// app/components/common/Sidebar.js
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSearch, FiFileText, FiEdit3, FiMenu, FiX,FiGlobe, FiType } from 'react-icons/fi';
import { useDarkMode } from '../../../hooks/useDarkMode';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const { darkMode } = useDarkMode();

  const menuItems = [
    { id: 'chat', icon: <FiMessageSquare className="text-lg" />, label: 'Chat' },
    { id: 'judgment', icon: <FiSearch className="text-lg" />, label: 'Judgments' },
    { id: 'docReview', icon: <FiFileText className="text-lg" />, label: 'Doc Review' },
    { id: 'draft', icon: <FiEdit3 className="text-lg" />, label: 'Draft' },
    { id: 'translation', icon: <FiGlobe className="text-lg" />, label: 'Translation' },
    { id: 'typing', icon: <FiType className="text-lg" />, label: 'Typing' } 
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-xl ${darkMode ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-600'} shadow-lg hover:scale-105 transition-transform cursor-pointer`}
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 h-full w-64 z-40 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors cursor-pointer`}
              >
                <FiX size={18} />
              </button>
            </div>
            
            <div className="h-full flex flex-col pt-20 pb-4 px-4">
              <div className="flex-1 overflow-y-auto">
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${activeTab === item.id
                        ? `${darkMode ? 'bg-indigo-700/30 text-indigo-300' : 'bg-indigo-100/80 text-indigo-700'}`
                        : `${darkMode ? 'text-gray-400 hover:bg-gray-700/50 hover:text-indigo-300' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}`
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className={`mt-auto pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between px-4">
                  <div>
                    <h1 className="text-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-serif">
                      Indian Legal Assistant
                    </h1>
                    <p className={`text-[11px] text-center tracking-wider ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
                      POWERED BY OOUM AI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}