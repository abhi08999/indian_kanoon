// app/components/Typing/Typing.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiFileText, FiX, FiCheck } from 'react-icons/fi';

export default function Typing() {
  const { darkMode } = useDarkMode();
  const [text, setText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('12');
  const [lineHeight, setLineHeight] = useState('2');
  const [alignment, setAlignment] = useState('left');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const outputRef = useRef(null);

  const fonts = [
    'Times New Roman',
    'Arial',
    'Calibri',
    'Georgia',
    'Verdana',
    'Courier New'
  ];

  const formatText = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const formatted = text;
      setFormattedText(formatted);
      setIsProcessing(false);
    }, 500);
  };

  const clearAll = () => {
    setText('');
    setFormattedText('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `document-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    const adjustHeights = () => {
      const textarea = textareaRef.current;
      const output = outputRef.current;
      
      if (textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 200), 600);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = newHeight >= 600 ? 'auto' : 'hidden';
      }
      
      if (output) {
        output.style.height = 'auto';
        const newHeight = Math.min(Math.max(output.scrollHeight, 200), 600);
        output.style.height = `${newHeight}px`;
        output.style.overflowY = newHeight >= 600 ? 'auto' : 'hidden';
      }
    };

    adjustHeights();
    window.addEventListener('resize', adjustHeights);
    return () => window.removeEventListener('resize', adjustHeights);
  }, [text, formattedText, fontSize, lineHeight]);

  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className={`text-2xl font-bold mb-8 text-center ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
          Document Typing & Formatting
        </h2>
        
        {/* Formatting Controls */}
        <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Font Family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border cursor-pointer`}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border cursor-pointer`}
            >
              {[10, 11, 12, 13, 14, 16, 18, 20, 22, 24].map((size) => (
                <option key={size} value={size}>{size} pt</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Line Spacing
            </label>
            <select
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border cursor-pointer`}
            >
              <option value="1">Single</option>
              <option value="1.15">1.15</option>
              <option value="1.5">1.5</option>
              <option value="2">Double</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Text Alignment
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['left', 'center', 'right', 'justify'].map((align) => (
                <motion.button
                  key={align}
                  onClick={() => setAlignment(align)}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded text-xs ${alignment === align 
                    ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white' 
                    : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors cursor-pointer`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Input Section */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
            <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Type Here
            </h3>
            <div className="min-h-[200px] max-h-[600px] overflow-auto">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing your content here..."
                className={`w-full min-h-[200px] p-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'} rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'} resize-none cursor-text`}
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  textAlign: alignment
                }}
              />
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearAll}
                disabled={!text.trim() && !formattedText}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } ${!text.trim() && !formattedText ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-colors`}
              >
                <FiX className="h-4 w-4" />
                Clear All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={formatText}
                disabled={!text.trim() || isProcessing}
                className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                  !text.trim() || isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                } transition-colors`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Formatting...
                  </>
                ) : (
                  <>
                    <FiFileText className="h-4 w-4" />
                    Format Text
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Output Section */}
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} flex-1`}>
            <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Formatted Document
            </h3>
            <div className="min-h-[200px] max-h-[600px] overflow-auto">
              <div
                ref={outputRef}
                className={`w-full min-h-[200px] p-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'} rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'} cursor-text`}
                style={{
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  whiteSpace: 'pre-wrap',
                  textAlign: alignment
                }}
              >
                {formattedText || (
                  <div className={`h-full flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="text-center">
                      <FiFileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Your formatted document will appear here</p>
                      <p className="text-sm mt-1">Adjust settings and click "Format Text"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={copyToClipboard}
                disabled={!formattedText}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !formattedText 
                    ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} cursor-not-allowed`
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer`
                } transition-colors`}
              >
                {copied ? <FiCheck className="h-4 w-4 text-green-500" /> : <FiCopy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadText}
                disabled={!formattedText}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !formattedText 
                    ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} cursor-not-allowed`
                    : `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} cursor-pointer`
                } transition-colors`}
              >
                <FiDownload className="h-4 w-4" />
                Download
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}