// app/components/DocumentReview/DocumentReview.js

'use client';

import { useRef, useEffect, useState } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useDocReview } from '@/hooks/useDocReview';
import DocumentMessage from './DocumentMessage';
import DocumentChatInput from './DocumentChatInput';
import { FiFile, FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentReview() {
  const { darkMode } = useDarkMode();
  const { 
    messages, 
    isLoading, 
    isUploading,
    handleSubmit, 
    input, 
    setInput, 
    uploadedFile,
    handleFileUpload,
    removeFile
  } = useDocReview();
  
  const messagesEndRef = useRef(null);
  const [showFormatHint, setShowFormatHint] = useState(true);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (uploadedFile) {
      setShowFormatHint(false);
    }
  }, [messages, uploadedFile]);

  return (
    <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Bar */}
      <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {uploadedFile ? (
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <FiFile className={`mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {uploadedFile.name}
              </span>
            </div>
            <button
              onClick={removeFile}
              className={`cursor-pointer p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            >
              <FiX className="text-lg" />
            </button>
          </div>
        ) : (
          showFormatHint && (
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <FiUpload className={`mr-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </span>
              </div>
              <button
                onClick={() => setShowFormatHint(false)}
                className={`cursor-pointer p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                <FiX className="text-lg" />
              </button>
            </div>
          )
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <DocumentMessage 
              key={`msg-${index}`}
              message={msg} 
              darkMode={darkMode}
              isLoading={isLoading && index === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <DocumentChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isUploading={isUploading}
        darkMode={darkMode}
        handleSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        textareaRef={useRef(null)}
        uploadedFile={uploadedFile}
      />
    </div>
  );
}