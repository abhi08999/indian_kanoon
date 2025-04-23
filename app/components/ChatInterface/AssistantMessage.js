'use client';

import { motion } from 'framer-motion';
import { FiBook, FiMessageSquare, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import SourcesModal from '../SourcesModal';

export default function AssistantMessage({ 
  content = '', 
  isLegal = false, 
  webSources = [],
  darkMode = false
}) {

  const modalKey = webSources.map(s => s.url).join('-');
  const [showSources, setShowSources] = useState(false);

  // Clean the content to remove any "Additional Resources" sections
  const cleanContent = (text) => {
    // Remove "Additional Resources" section and anything after it
    const cleanedText = text.split('\nAdditional Resources:')[0];
    return cleanedText.split('\n').map((paragraph, i) => (
      <p key={i} className="mb-3 leading-relaxed">
        {paragraph || <br />}
      </p>
    ));
  };

  return (
    <div className="message-container">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start cursor-default relative z-10"
      >
        <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${
          isLegal 
            ? (darkMode ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-white border border-emerald-100') 
            : (darkMode ? 'bg-gray-800/90' : 'bg-white')
        } rounded-bl-none shadow-lg`}>
          
          <div className="flex items-start">
            <div className={`mr-3 mt-1 p-2 rounded-lg ${
              isLegal 
                ? (darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100') 
                : (darkMode ? 'bg-gray-700' : 'bg-gray-100')
            }`}>
              {isLegal ? (
                <FiBook className={`text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              ) : (
                <FiMessageSquare className={`text-lg ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              )}
            </div>
            
            <div className="flex-1">
              <div className="whitespace-pre-wrap mb-4">
                {cleanContent(content)}
              </div>

              {webSources.length > 0 && (
                <button
                  onClick={() => setShowSources(true)}
                  className={`cursor-pointer mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-400'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                  } transition-colors`}
                >
                  <FiExternalLink className="mr-1.5" />
                  View {webSources.length} source{webSources.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <SourcesModal 
        key={`sources-${webSources.map(s => s.url).join('-')}`}
        sources={webSources} 
        isOpen={showSources} 
        onClose={() => setShowSources(false)}
        darkMode={darkMode}
      />
    </div>
  );
}