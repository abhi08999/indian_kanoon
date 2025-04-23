'use client';

import { motion } from 'framer-motion';
import { FiSend, FiZap } from 'react-icons/fi';

export default function ChatInput({
  input,
  setInput,
  isLoading,
  darkMode,
  handleSubmit,
  textareaRef
}) {
  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`fixed bottom-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className={`flex items-end rounded-2xl p-1 ${darkMode ? 'bg-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500/30' : 'bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300'} transition-all duration-300 shadow-md`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'OOUM AI is thinking...' : 'Ask about Indian law or general queries...'}
            className={`flex-1 bg-transparent border-0 px-4 py-3 focus:outline-none resize-none ${darkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-800'}`}
            disabled={isLoading}
            rows={1}
            style={{ minHeight: '60px', maxHeight: '150px' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`p-3 rounded-full m-1 ${isLoading 
              ? `${darkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-not-allowed`
              : `${darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} shadow-md cursor-pointer`
            } text-white transition-all`}
            disabled={isLoading || !input.trim()}
          >
            <FiSend className="h-5 w-5" />
          </motion.button>
        </form>
        <div className={`flex items-center justify-between mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex items-center">
            <FiZap className="mr-1.5" />
            <span>Powered by OOUM AI</span>
          </div>
          <div>
            {isLoading ? 'Processing...' : 'Press Enter to send, Shift+Enter for new line'}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}