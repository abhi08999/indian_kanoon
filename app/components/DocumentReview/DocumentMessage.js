'use client';

import { motion } from 'framer-motion';
import { FiCopy, FiLoader } from 'react-icons/fi';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function DocumentMessage({ message, darkMode, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`relative max-w-[85%] rounded-xl ${message.role === 'user' 
          ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} rounded-br-none`
          : `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-bl-none shadow-sm`
        } px-4 py-3 ${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`}
      >
        {message.role === 'assistant' && !isLoading && (
          <CopyToClipboard text={message.content} onCopy={handleCopy}>
            <button
              className={`cursor-pointer absolute -top-3 -right-3 p-2 rounded-full ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
              } transition-all`}
              title="Copy to clipboard"
            >
              <FiCopy className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
          </CopyToClipboard>
        )}

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`absolute -top-8 right-0 px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
          >
            Copied!
          </motion.div>
        )}

        {message.role === 'user' ? (
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-white'}`}>
            {message.content}
          </p>
        ) : isLoading ? (
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiLoader className="animate-spin mr-2" />
            Analyzing document...
          </div>
        ) : (
          <Markdown
            remarkPlugins={[remarkGfm]}
            className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
          >
            {message.content}
          </Markdown>
        )}
      </div>
    </motion.div>
  );
}