"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiBook, FiMessageSquare, FiInfo, FiSun, FiMoon, FiZap, FiExternalLink, FiSearch, FiDownload, FiX } from 'react-icons/fi';

// ... (keep all your existing memoized components: UserMessage, AssistantMessage)

export default function LegalAssistant() {
  // ... (keep all your existing state declarations until activeTab)

  const [judgmentSearchQuery, setJudgmentSearchQuery] = useState('');
  const [judgmentResults, setJudgmentResults] = useState(null);
  const [selectedJudgment, setSelectedJudgment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summaryModal, setSummaryModal] = useState({ open: false, content: '' });
  const [pdfUrl, setPdfUrl] = useState('');

  // ... (keep all your existing helper functions until handleJudgmentSearch)

  const handleJudgmentSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!judgmentSearchQuery.trim()) return;
    
    setIsAnalyzing(true);
    setJudgmentResults(null);
    setSelectedJudgment(null);
    
    try {
      const response = await axios.post('/api/judgment-search', {
        query: judgmentSearchQuery
      });
      
      setJudgmentResults(response.data);
      
      // Show initial message in chat
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Found ${response.data.docs.length} judgments matching "${judgmentSearchQuery}". You can view them in the Judgments tab.`,
        isLegal: true,
        source: 'judgment-search'
      }]);
    } catch (error) {
      console.error('Judgment search error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Failed to search judgments. Please try again later.',
        isLegal: false,
        source: 'error'
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [judgmentSearchQuery]);

  const fetchJudgmentDetails = useCallback(async (docId) => {
    setIsAnalyzing(true);
    try {
      const response = await axios.get(`/api/judgment-details?docId=${docId}`);
      setSelectedJudgment(response.data);
      setPdfUrl(`https://indiankanoon.org/doc/${docId}/print/`);
    } catch (error) {
      console.error('Error fetching judgment details:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateSummary = useCallback(async (docId, title, content) => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post('/api/generate-summary', {
        title,
        content: content.substring(0, 3000) // Limit content to avoid too large payloads
      });
      
      setSummaryModal({
        open: true,
        content: response.data.summary
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryModal({
        open: true,
        content: 'Failed to generate summary. Please try again later.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const cleanHtmlContent = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
      {/* ... (keep your existing header and main content area until the activeTab condition) */}

      {activeTab === 'chat' ? (
        // ... (keep your existing chat UI)
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          {/* Judgment Search UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl px-4"
          >
            {/* Search Form */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'} shadow-lg mb-6`}>
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center p-3 rounded-full ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'} mb-3`}>
                  <FiSearch className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                </div>
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} mb-1`}>
                  Judgment Search
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Find Indian court judgments by case name, citation, or legal principles
                </p>
              </div>

              <form onSubmit={handleJudgmentSearch} className="mb-6">
                <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
                  <input
                    type="text"
                    value={judgmentSearchQuery}
                    onChange={(e) => setJudgmentSearchQuery(e.target.value)}
                    placeholder="Ex: 'Right to Privacy cases after 2017'"
                    className={`w-full px-6 py-4 bg-transparent focus:outline-none ${
                      darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
                    }`}
                  />
                  <button 
                    type="submit"
                    className={`px-4 flex items-center ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition-colors`}
                    disabled={isAnalyzing}
                  >
                    <FiSearch className="text-lg" />
                    <span className="ml-2 hidden sm:inline">Search</span>
                  </button>
                </div>
              </form>

              {/* Quick Tips */}
              <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`flex items-center text-sm font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  <FiZap className="mr-2" />
                  Quick Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Include specific years (2020-2023)",
                    "Use sections (IPC 302, Article 21)",
                    "Combine keywords precisely",
                    "Try landmark case names"
                  ].map((tip, i) => (
                    <div 
                      key={i} 
                      className={`flex items-start p-2 rounded-md ${darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-indigo-50 hover:bg-indigo-100'} transition-colors`}
                    >
                      <span className={`inline-block mr-2 mt-0.5 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'}`}></span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Loading State */}
            <AnimatePresence>
              {isAnalyzing && !judgmentResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/70' : 'bg-white'} shadow-lg mb-6 flex flex-col items-center justify-center`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-indigo-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                  <h3 className={`text-xl font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} mb-2`}>
                    Analyzing Legal Database
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                    Searching through thousands of judgments to find the most relevant cases...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Judgment Results */}
            {judgmentResults && (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50'} flex items-center justify-between`}>
                  <h3 className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Showing {judgmentResults.docs.length} of {judgmentResults.found} judgments
                  </h3>
                  <button 
                    onClick={() => {
                      setJudgmentResults(null);
                      setJudgmentSearchQuery('');
                    }}
                    className={`text-sm px-3 py-1 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-indigo-100'} transition-colors`}
                  >
                    New Search
                  </button>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Content Area */}
                  <div className="space-y-4">
                    {judgmentResults.docs.map((doc, index) => (
                      <motion.div
                        key={doc.tid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-white hover:bg-indigo-50'} border ${darkMode ? 'border-gray-700' : 'border-indigo-100'} shadow-sm transition-all cursor-pointer`}
                        onClick={() => fetchJudgmentDetails(doc.tid)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-lg font-medium mb-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                              {doc.title || 'Untitled Case'}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                {doc.docsource || 'Court not specified'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                {formatDate(doc.publishdate)}
                              </span>
                              {doc.citation && (
                                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                  {doc.citation}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                generateSummary(doc.tid, doc.title, doc.headline || '');
                              }}
                              className={`p-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 hover:bg-emerald-900/50' : 'bg-emerald-100 hover:bg-emerald-200'} transition-colors`}
                              title="Relevance Summary"
                            >
                              <FiInfo className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                            </button>
                          </div>
                        </div>
                        {doc.headline && (
                          <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                            {cleanHtmlContent(doc.headline)}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Judgment Detail Panel */}
                  <div className={`sticky top-28 h-[calc(100vh-180px)] overflow-y-auto ${darkMode ? 'bg-gray-800/70' : 'bg-white'} rounded-xl shadow-lg p-5`}>
                    {selectedJudgment ? (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'} mb-1`}>
                              {selectedJudgment.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                {selectedJudgment.docsource}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                {formatDate(selectedJudgment.publishdate)}
                              </span>
                              {selectedJudgment.citation && (
                                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
                                  {selectedJudgment.citation}
                                </span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedJudgment(null)}
                            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                          </button>
                        </div>

                        <div className="flex space-x-3 mb-4">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 'bg-indigo-100 hover:bg-indigo-200'} transition-colors`}
                          >
                            <FiDownload className="mr-2" />
                            <span>Download PDF</span>
                          </a>
                          <button
                            onClick={() => generateSummary(selectedJudgment.tid, selectedJudgment.title, selectedJudgment.doc)}
                            className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-emerald-900/30 hover:bg-emerald-900/50' : 'bg-emerald-100 hover:bg-emerald-200'} transition-colors`}
                          >
                            <FiInfo className="mr-2" />
                            <span>Relevance Summary</span>
                          </button>
                        </div>

                        <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} text-sm`}>
                          <div dangerouslySetInnerHTML={{ __html: selectedJudgment.doc }} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FiBook className={`text-4xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {judgmentResults.docs.length > 0 ? 'Select a judgment to view details' : 'No judgments found'}
                        </h3>
                        <p className={`text-sm text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {judgmentResults.docs.length > 0 
                            ? 'Click on any judgment from the list to read the full text here.' 
                            : 'Try refining your search query or use different keywords.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Searches */}
            {!judgmentResults && (
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/70' : 'bg-indigo-50'} shadow-lg`}>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  Popular Searches
                </h3>
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <div className="space-y-3">
                    {[
                      { query: "Landmark constitutional cases", category: "Constitutional Law" },
                      { query: "Recent property dispute judgments", category: "Property Law" },
                      { query: "Section 498A IPC cases 2023", category: "Criminal Law" },
                      { query: "Consumer protection judgments", category: "Consumer Law" },
                      { query: "Environmental law cases", category: "Environmental Law" },
                      { query: "Right to Privacy Supreme Court", category: "Fundamental Rights" },
                      { query: "Bail conditions in NDPS cases", category: "Criminal Law" },
                      { query: "Arbitration awards enforcement", category: "Commercial Law" },
                      { query: "Recent labor law judgments", category: "Labor Law" },
                      { query: "Medical negligence cases", category: "Tort Law" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ x: 5 }}
                        className={`p-3 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-indigo-100'} border ${darkMode ? 'border-gray-600' : 'border-indigo-200'} transition-all`}
                        onClick={() => {
                          setJudgmentSearchQuery(item.query);
                          setActiveTab('chat');
                        }}
                      >
                        <div className="flex items-start">
                          <FiSearch className={`mt-1 mr-3 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                          <div>
                            <p className={`text-md font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{item.query}</p>
                            <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>{item.category}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Summary Modal */}
      <AnimatePresence>
        {summaryModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative max-w-2xl w-full mx-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Case Summary
                  </h3>
                  <button 
                    onClick={() => setSummaryModal({ open: false, content: '' })}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                  </button>
                </div>
                <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                  {summaryModal.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-3">{paragraph}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ... (keep your existing footer) */}
    </div>
  );
}