'use client';

import { motion } from 'framer-motion';
import { FiClock, FiFileText, FiPercent } from 'react-icons/fi';
import { MdOutlineQuickreply } from "react-icons/md";

export default function JudgmentCard({ 
  doc, 
  darkMode, 
  fetchJudgmentDetails,
  index 
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const cleanHtmlContent = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const formatTitle = (title) => {
    if (!title) return 'Untitled Case';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = title;
    return tempDiv.textContent || tempDiv.innerText || 'Untitled Case';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/60' : 'bg-gradient-to-br from-white to-gray-50'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer transition-all duration-200 font-sans`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'} leading-snug font-serif`}>
              {formatTitle(doc.title)}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <div className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <FiClock className="mr-1" /> {formatDate(doc.publishdate)}
              </div>
              {doc.citation && (
                <div className={`text-xs flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FiFileText className="mr-1" /> {doc.citation}
                </div>
              )}
            </div>
          </div>
          <div className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} whitespace-nowrap`}>
            {doc.docsource || 'Court not specified'}
          </div>
        </div>

        {doc.headline && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'} text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-4 leading-relaxed`}>
            {cleanHtmlContent(doc.headline)}
          </div>
        )}
      </div>

      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-5 py-3 flex justify-between bg-gradient-to-r ${darkMode ? 'from-gray-800/50 to-gray-800/30' : 'from-gray-50 to-gray-100'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            fetchJudgmentDetails(doc.tid, 'details');
          }}
          className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'} transition-colors cursor-pointer shadow-sm`}
        >
          <FiFileText className="mr-2" />
          <span className="font-medium">View Details</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            fetchJudgmentDetails(doc.tid, 'relevance');
          }}
          className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-200' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'} transition-colors cursor-pointer shadow-sm`}
        >
          <MdOutlineQuickreply className="mr-2" />
          <span className="font-medium">Quick Summary</span>
        </button>
      </div>
    </motion.div>
  );
}