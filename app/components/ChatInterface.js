
"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSend, 
  FiBook, 
  FiMessageSquare, 
  FiInfo, 
  FiSun, 
  FiMoon, 
  FiZap, 
  FiExternalLink, 
  FiSearch, 
  FiDownload, 
  FiX, 
  FiChevronRight, 
  FiClock,
  FiLayers,
  FiAward,
  FiFileText,
  FiPercent,
  FiArrowLeft,
  FiLoader,
  FiChevronLeft,
  FiChevronRight as FiChevronRightIcon,
  FiAlertCircle
} from 'react-icons/fi';

// Memoized User Message Component
const UserMessage = memo(({ content = '', darkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-end cursor-default"
  >
    <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${darkMode ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white rounded-br-none shadow-lg`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30"></div>
      <p className="relative z-10 whitespace-pre-wrap">{content}</p>
    </div>
  </motion.div>
));

// Memoized Assistant Message Component
const AssistantMessage = memo(({ 
  content = '', 
  isLegal = false, 
  metadata = {}, 
  darkMode,
  onRelatedDocSelect,
  onQuestionSelect
}) => {
  const formatLegalContent = (html) => {
    if (!html) return '';
    return html
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<a\b[^>]*>(.*?)<\/a>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*([^\*]+)\*\*/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  const formatTitle = (title) => {
    if (!title) return 'Legal Document';
    return title
      .replace(/<b>/g, '')
      .replace(/<\/b>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start cursor-default"
    >
      <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${
        isLegal ? (darkMode ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-white border border-emerald-100') 
        : (darkMode ? 'bg-gray-800/90' : 'bg-white')
      } rounded-bl-none shadow-lg`}>
        <div className="flex items-start">
          <div className={`mr-3 mt-1 p-2 rounded-lg ${
            isLegal ? (darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100') 
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
              {formatLegalContent(content).split('\n').map((paragraph, i) => (
                <p key={i} className="mb-3 leading-relaxed">
                  {paragraph || <br />}
                </p>
              ))}
            </div>

            {isLegal && metadata && (
              <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-start">
                  <FiInfo className={`mt-1 mr-2 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatTitle(metadata.title)}
                      </span>
                      {/* {metadata.url && (
                        <a 
                          href={metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-xs p-1 rounded hover:bg-gray-700/10 cursor-pointer"
                        >
                          <FiExternalLink className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                        </a>
                      )} */}
                    </div>
                    <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span className="font-semibold">Court:</span> {metadata.source || 'Not specified'}
                    </div>
                    {metadata.date && (
                      <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="font-semibold">Date:</span> {new Date(metadata.date).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const JudgmentCard = memo(({ 
  doc, 
  darkMode, 
  fetchJudgmentDetails,
  index 
}) => {
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
          <FiPercent className="mr-2" />
          <span className="font-medium">Quick Summary</span>
        </button>
      </div>
    </motion.div>
  );
});

const PDFPage = ({ content, pageNumber, totalPages, darkMode }) => {
  return (
    <div className={`relative ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-6 overflow-hidden`}
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '25mm',
        boxSizing: 'border-box',
        color: darkMode ? '#e5e7eb' : '#111827'
      }}
    >
      <div 
        style={{
          fontFamily: "'Georgia', 'Times New Roman', 'Times', 'serif'",
          fontSize: '12pt',
          lineHeight: '1.8',
          textAlign: 'justify',
          hyphens: 'auto'
        }}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      
      <div 
        className={`absolute bottom-5 right-5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        style={{ fontFamily: "'Arial', sans-serif" }}
      >
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  );
};

const JudgmentDetailsModal = memo(({ 
  judgment, 
  darkMode, 
  onClose,
  onBack,
  isGeneratingSummary,
  summaryContent
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const contentRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    if (!judgment?.doc) return;

    const content = judgment.doc;
    const wordsPerPage = 800;
    const words = content.split(' ');
    const totalPages = Math.ceil(words.length / wordsPerPage);
    
    const newPages = [];
    for (let i = 0; i < totalPages; i++) {
      const start = i * wordsPerPage;
      const end = start + wordsPerPage;
      const pageContent = words.slice(start, end).join(' ');
      newPages.push(pageContent);
    }
    
    setPages(newPages);
    setCurrentPage(1);
  }, [judgment]);

  const handleDownloadPDF = async () => {
    setShowDownloadAlert(true);
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setTimeout(() => setShowDownloadAlert(false), 3000);
    }, 1500);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-y-auto`}
      ref={contentRef}
    >
      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
              >
                <FiArrowLeft className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                Judgment Details
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'bg-indigo-100 hover:bg-indigo-200'} transition-colors cursor-pointer ${isDownloading ? 'opacity-70' : ''}`}
              >
                {isDownloading ? (
                  <FiLoader className="mr-2 animate-spin" />
                ) : (
                  <FiDownload className="mr-2" />
                )}
                <span className='text-sm'>Download PDF</span>
              </button>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
              >
                <FiX className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Alert */}
      <AnimatePresence>
        {showDownloadAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${darkMode ? 'bg-amber-900/80 text-amber-100' : 'bg-amber-100 text-amber-800'}`}
          >
            <FiAlertCircle className="mr-2" />
            <span>PDF download feature will be available soon</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Info */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">Court:</span> {judgment.docsource || 'Not specified'}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium">Date:</span> {formatDate(judgment.publishdate)}
            </div>
            {judgment.citation && (
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Citation:</span> {judgment.citation}
              </div>
            )}
          </div>
          <h1 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            {judgment.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center py-8">
        {pages.length > 0 && (
          <PDFPage 
            content={pages[currentPage - 1]} 
            pageNumber={currentPage} 
            totalPages={pages.length} 
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {pages.length > 1 && (
        <div className={`sticky bottom-0 left-0 right-0 py-3 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <div className="max-w-7xl mx-auto flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <FiChevronLeft className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Page {currentPage} of {pages.length}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(pages.length, currentPage + 1))}
              disabled={currentPage === pages.length}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${currentPage === pages.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <FiChevronRightIcon className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
});

const SummaryModal = memo(({ 
  isOpen, 
  onClose, 
  darkMode, 
  title, 
  metadata, 
  content, 
  keyPoints, 
  isLoading 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative max-w-4xl w-full mx-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl overflow-hidden`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    {title || 'Relevance Summary'}
                  </h3>
                  {metadata && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                        {metadata.court}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                        {formatDate(metadata.date)}
                      </span>
                      {metadata.citation && (
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          {metadata.citation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
                >
                  <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className={`mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                  >
                    <FiLoader className="text-2xl" />
                  </motion.div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generating summary...</p>
                </div>
              ) : (
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} max-h-[70vh] overflow-y-auto`}>
                  <div className="prose max-w-none">
                    {content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                  {keyPoints && keyPoints.length > 0 && (
                    <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-indigo-50'}`}>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Key Points:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

const AnalyzingPopup = ({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-sm`}
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative max-w-md w-full mx-4 p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl text-center`}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { 
              repeat: Infinity, 
              duration: 2, 
              ease: "linear" 
            },
            scale: { 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }
          }}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}
        >
          <FiSearch className={`text-3xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </motion.div>
        
        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
          Analyzing Legal Database
        </h3>
        
        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Searching through thousands of judgments to find the most relevant cases...
        </p>
        
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2
              }}
              className={`w-3 h-3 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function LegalAssistant() {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome-message',
      role: 'assistant', 
      content: 'Hello! I am OOUM AI, your specialized assistant for Indian legal matters.',
      isLegal: false,
      source: 'ooum'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [judgmentSearchQuery, setJudgmentSearchQuery] = useState('');
  const [judgmentResults, setJudgmentResults] = useState(null);
  const [selectedJudgment, setSelectedJudgment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [summaryModal, setSummaryModal] = useState({ 
    open: false, 
    content: '',
    type: 'details',
    title: '',
    metadata: null,
    keyPoints: []
  });
  const [viewMode, setViewMode] = useState('list');
  const searchInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchResultsRef = useRef(null);

  const isAboutOOUM = useCallback((text) => {
    const ooumKeywords = [
      'who are you', 'what are you', 'your name', 
      'which ai', 'what technology', 'what model',
      'what system', 'ooum', 'who made you'
    ];
    return ooumKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }, []);

  const messageList = useMemo(() => messages, [messages]);

  useEffect(() => {
    if (judgmentResults && searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [judgmentResults]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const scrollToSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current.focus();
    }
  };

  const handlePopularSearchClick = (query) => {
    setJudgmentSearchQuery(query);
    setActiveTab('judgment');
    setTimeout(() => {
      scrollToSearchInput();
    }, 100);
  };

  const getLoadingMessage = useCallback((inputText) => {
    if (!inputText) return "Processing your request...";
    if (isAboutOOUM(inputText)) return "Getting OOUM AI information...";
    if (inputText.toLowerCase().includes('legal') || 
        inputText.toLowerCase().includes('law') ||
        inputText.toLowerCase().includes('act') ||
        inputText.toLowerCase().includes('section')) {
      return "Searching legal databases...";
    }
    return "Generating response...";
  }, [isAboutOOUM]);

  const handleRelatedDocSelect = useCallback(async (docId) => {
    if (!docId) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('/api/search', { 
        docId: docId
      });
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.error 
          ? `Error: ${response.data.error}`
          : response.data.response || 'Document content not available',
        isLegal: true,
        source: 'indiankanoon',
        metadata: response.data.metadata,
        relatedQs: response.data.relatedQs || [],
        categories: response.data.categories || []
      }]);
    } catch (error) {
      console.error('Document load error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Failed to load document. Please try again later.',
        isLegal: false,
        source: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    setIsLoading(true);
    const userMessage = { 
      id: crypto.randomUUID(),
      role: 'user', 
      content: input,
      isLegal: null,
      source: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
  
    try {
      const response = await axios.post('/api/search', { query: input });
  
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.response,
        isLegal: response.data.isLegal,
        source: response.data.source,
        metadata: response.data.metadata || null
        // NO judgmentResults update here!
      }]);
  
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Service unavailable. Please try again later.',
        isLegal: false,
        source: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);
  const handleQuestionSelect = useCallback((question) => {
    setInput(question);
    setActiveTab('chat');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, []);
  
  const handleJudgmentSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!judgmentSearchQuery.trim()) return;
    
    setIsAnalyzing(true);
    setJudgmentResults(null);
    setSelectedJudgment(null);
    setViewMode('list');
    
    try {
      const response = await axios.post('/api/judgment-search', {
        query: judgmentSearchQuery
      });
      
      setJudgmentResults(response.data);
    } catch (error) {
      console.error('Judgment search error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [judgmentSearchQuery]);

  const fetchJudgmentDetails = useCallback(async (docId, type = 'details') => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/judgment-details', { 
        docId: docId 
      });
      
      if (type === 'details') {
        setSelectedJudgment(response.data);
        setViewMode('detail');
      } else {
        setIsGeneratingSummary(true);
        setSummaryModal({
          open: true,
          content: '',
          type: 'relevance',
          title: response.data.title,
          metadata: {
            date: response.data.publishdate,
            court: response.data.docsource,
            citation: response.data.citation
          },
          keyPoints: []
        });
        
        const summaryResponse = await axios.post('/api/generate-summary', {
          title: response.data.title,
          content: response.data.doc.substring(0, 3000)
        });
        
        setSummaryModal(prev => ({
          ...prev,
          content: summaryResponse.data.summary,
          keyPoints: summaryResponse.data.keyPoints || []
        }));
        setSummaryContent(summaryResponse.data.summary);
      }
    } catch (error) {
      console.error('Error fetching judgment details:', error);
      setSummaryModal({
        open: true,
        content: 'Failed to load judgment details. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingSummary(false);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg shadow-lg`}
      >
        <div className="max-w-[98%] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => {
                setActiveTab('chat');
                setViewMode('list');
              }}
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
                onClick={() => {
                  setActiveTab('chat');
                  setViewMode('list');
                }}
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
                onClick={() => {
                  setActiveTab('judgment');
                  setViewMode('list');
                  setTimeout(() => {
                    scrollToSearchInput();
                  }, 100);
                }}
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

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'} transition-colors cursor-pointer`}
              >
                {darkMode ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="pt-28 pb-40 px-6 w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'chat' ? (
          <>
            {messageList.map((msg) => (
              <div key={msg.id} className="mb-6 relative z-0 max-w-7xl mx-auto">
                {msg.role === 'user' ? (
                  <UserMessage 
                    content={msg.content} 
                    darkMode={darkMode}
                  />
                ) : (
                  <AssistantMessage 
                    content={msg.content} 
                    isLegal={msg.isLegal} 
                    metadata={msg.metadata}
                    darkMode={darkMode}
                    onRelatedDocSelect={handleRelatedDocSelect}
                    onQuestionSelect={handleQuestionSelect}
                  />
                )}
              </div>
            ))}
            
            {isLoading && (
              <AnimatePresence>
                <motion.div
                  key={`loading-${Date.now()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start mb-6 relative z-0"
                >
                  <div className={`max-w-3xl rounded-3xl rounded-bl-none px-6 py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm`}>
                    <div className="flex items-center space-x-3">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`dot-${Date.now()}-${i}`}
                          className="w-2.5 h-2.5 rounded-full bg-indigo-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                      <span className="text-sm">
                        {getLoadingMessage(input)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} className="relative z-0" />
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            {viewMode === 'list' ? (
              <>
                {/* Judgment Search Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-2xl ${darkMode ? 'bg-gray-800/70' : 'bg-white'} shadow-lg mb-8`}
                >
                  <div className={`p-8 md:p-12 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800/70 to-gray-900/50' : 'bg-gradient-to-br from-white to-gray-50'} shadow-lg mb-8`}>
                    <div className="flex flex-col items-center text-center">
                      <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`text-3xl font-bold mb-3 bg-gradient-to-r ${darkMode ? 'from-indigo-300 to-emerald-300' : 'from-indigo-600 to-emerald-600'} bg-clip-text text-transparent font-serif`}
                      >
                        Indian Legal Judgment Search
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        Search through comprehensive database of OOUM AI judgments
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                        className="w-full max-w-2xl"
                        ref={searchInputRef}
                      >
                        <form onSubmit={handleJudgmentSearch} className="relative">
                          <input
                            type="text"
                            value={judgmentSearchQuery}
                            onChange={(e) => setJudgmentSearchQuery(e.target.value)}
                            placeholder="Search by case name, citation, or legal principle..."
                            className={`w-full px-5 py-4 pr-16 rounded-xl ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-indigo-300'} focus:outline-none transition-all duration-200 shadow-md font-medium`}
                          />
                          <button
                            type="submit"
                            disabled={isAnalyzing}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-3 rounded-lg ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition-colors cursor-pointer shadow-md`}
                          >
                            {isAnalyzing ? (
                              <FiLoader className="h-5 w-5 animate-spin" />
                            ) : (
                              <FiSearch className="h-5 w-5" />
                            )}
                          </button>
                        </form>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        <span>Try: </span>
                        <button
                          onClick={() => handlePopularSearchClick('Landmark constitutional cases')}
                          className={`mx-1 px-3 py-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700/50 text-indigo-300' : 'hover:bg-gray-200 text-indigo-600'} transition-colors cursor-pointer`}
                        >
                          Landmark cases
                        </button>
                        <span className="mx-1">•</span>
                        <button
                          onClick={() => handlePopularSearchClick('Section 498A IPC')}
                          className={`mx-1 px-3 py-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700/50 text-indigo-300' : 'hover:bg-gray-200 text-indigo-600'} transition-colors cursor-pointer`}
                        >
                          IPC sections
                        </button>
                        <span className="mx-1">•</span>
                        <button
                          onClick={() => handlePopularSearchClick('Right to Privacy after 2017')}
                          className={`mx-1 px-3 py-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700/50 text-indigo-300' : 'hover:bg-gray-200 text-indigo-600'} transition-colors cursor-pointer`}
                        >
                          Fundamental rights
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Analyzing Popup */}
                <AnimatePresence>
                  {isAnalyzing && !judgmentResults && (
                    <AnalyzingPopup darkMode={darkMode} />
                  )}
                </AnimatePresence>

                {/* Search Results */}
                {judgmentResults ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      ref={searchResultsRef}
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50'} flex items-center justify-between mb-6 shadow-md`}
                    >
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                          {judgmentResults.found} judgments found
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
                          Showing {judgmentResults.docs.length} most relevant results
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setJudgmentResults(null);
                          setJudgmentSearchQuery('');
                          scrollToSearchInput();
                        }}
                        className={`text-sm px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-indigo-100'} transition-colors flex items-center cursor-pointer shadow-sm`}
                      >
                        <FiX className="mr-1" /> Clear Results
                      </button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                    >
                      {judgmentResults.docs.map((doc, index) => (
                        <JudgmentCard
                          key={doc.tid}
                          doc={doc}
                          darkMode={darkMode}
                          fetchJudgmentDetails={fetchJudgmentDetails}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  </>
                ) : !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800/70 to-gray-900/50' : 'bg-gradient-to-br from-indigo-50 to-white'} shadow-lg`}
                  >
                    <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'} flex items-center gap-2 justify-center font-serif`}>
                      <FiZap className={`${darkMode ? 'text-amber-300' : 'text-amber-500'}`} />
                      Popular Legal Searches
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { query: "Landmark constitutional cases", category: "Constitutional Law", icon: <FiAward /> },
                        { query: "Recent property dispute judgments", category: "Property Law", icon: <FiLayers /> },
                        { query: "Section 498A IPC cases 2023", category: "Criminal Law", icon: <FiFileText /> },
                        { query: "Consumer protection judgments", category: "Consumer Law", icon: <FiInfo /> },
                        { query: "Environmental law cases", category: "Environmental Law", icon: <FiInfo /> },
                        { query: "Right to Privacy Supreme Court", category: "Fundamental Rights", icon: <FiAward /> },
                        { query: "Bail conditions in NDPS cases", category: "Criminal Law", icon: <FiFileText /> },
                        { query: "Arbitration awards enforcement", category: "Commercial Law", icon: <FiLayers /> }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ y: -5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-indigo-100'} border ${darkMode ? 'border-gray-600' : 'border-indigo-200'} transition-all shadow-sm`}
                          onClick={() => handlePopularSearchClick(item.query)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-600'} shadow-sm`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{item.query}</p>
                              <span className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${darkMode ? 'bg-gray-600/50 text-gray-300' : 'bg-indigo-100 text-indigo-600/80'}`}>{item.category}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <JudgmentDetailsModal
                judgment={selectedJudgment}
                darkMode={darkMode}
                onClose={() => {
                  setSelectedJudgment(null);
                  setViewMode('list');
                  setTimeout(() => {
                    scrollToSearchInput();
                  }, 100);
                }}
                onBack={() => {
                  setViewMode('list');
                  setTimeout(() => {
                    scrollToSearchInput();
                  }, 100);
                }}
                isGeneratingSummary={isGeneratingSummary}
                summaryContent={summaryContent}
              />
            )}
          </div>
        )}

        {/* Summary Modal */}
        <SummaryModal
          isOpen={summaryModal.open}
          onClose={() => setSummaryModal({ open: false, content: '' })}
          darkMode={darkMode}
          title={summaryModal.title}
          metadata={summaryModal.metadata}
          content={summaryModal.content}
          keyPoints={summaryModal.keyPoints}
          isLoading={isGeneratingSummary}
        />
      </div>

      {/* Footer with Input Area (only shown in chat mode) */}
      {activeTab === 'chat' && (
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
      )}
    </div>
  );
}