'use client';

import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDarkMode } from '../../../hooks/useDarkMode';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleDarkMode}
      className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'} transition-colors cursor-pointer`}
    >
      {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
    </motion.button>
  );
}