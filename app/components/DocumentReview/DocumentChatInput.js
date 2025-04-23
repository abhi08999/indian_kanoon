'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiUpload, FiZap } from 'react-icons/fi';

export default function DocumentChatInput({
  input,
  setInput,
  isLoading,
  isUploading,
  darkMode,
  handleSubmit,
  handleFileUpload,
  textareaRef,
  uploadedFile
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`fixed bottom-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} shadow-2xl`}
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <form onSubmit={handleSubmit} className={`flex items-end rounded-2xl p-1 ${darkMode ? 'bg-gray-800/50 focus-within:ring-2 focus-within:ring-indigo-500/30' : 'bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300'} transition-all duration-300 shadow-md`}>
          {!uploadedFile && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                disabled={isUploading}
              />
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full m-1 ${darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Upload document"
              >
                {isUploading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiUpload className="h-5 w-5" />
                )}
              </motion.button>
            </>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isLoading ? 'Analyzing document...' : 
              uploadedFile ? 'Ask about this document...' : 
              'Upload a document to begin analysis'
            }
            className={`flex-1 bg-transparent border-0 px-4 py-3 focus:outline-none resize-none ${darkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-800'}`}
            disabled={isLoading || !uploadedFile}
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
            className={`p-3 rounded-full m-1 ${isLoading || !uploadedFile
              ? `${darkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-not-allowed`
              : `${darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} shadow-md cursor-pointer`
            } text-white transition-all`}
            disabled={isLoading || !input.trim() || !uploadedFile}
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
            {isUploading ? 'Uploading document...' : 
             isLoading ? 'Processing...' : 
             'Press Enter to send, Shift+Enter for new line'}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}