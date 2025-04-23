'use client';

import { motion } from 'framer-motion';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useJudgmentSearch } from '@/hooks/useJudgmentSearch';
import JudgmentCard from './JudgmentCard';
import JudgmentDetailsModal from './JudgmentDetailsModal';
import AnalyzingPopup from './AnalyzingPopup'
import SummaryModal from './SummaryModal';
import { FiZap, FiX, FiAward, FiLayers, FiFileText, FiInfo,FiSearch } from 'react-icons/fi';

export default function JudgmentSearch() {
  const { darkMode } = useDarkMode();
  const {
    judgmentSearchQuery,
    setJudgmentSearchQuery,
    judgmentResults,
    setJudgmentResults,
    isAnalyzing,
    selectedJudgment,
    viewMode,
    setViewMode,
    handleJudgmentSearch,
    fetchJudgmentDetails,
    scrollToSearchInput,
    searchInputRef,
    searchResultsRef,
    setSelectedJudgment,
    summaryModal,
    setSummaryModal
  } = useJudgmentSearch();

  const handlePopularSearchClick = (query) => {
    setJudgmentSearchQuery(query);
    setTimeout(() => {
      scrollToSearchInput();
    }, 100);
  };

  return (
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
                        <span className="loading loading-spinner loading-sm"></span>
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
          {isAnalyzing && !judgmentResults && (
            <AnalyzingPopup darkMode={darkMode} />
          )}

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
        />
      )}
       <SummaryModal
        isOpen={summaryModal.open}
        onClose={() => setSummaryModal(prev => ({ ...prev, open: false }))}
        darkMode={darkMode}
        title={summaryModal.title}
        metadata={summaryModal.metadata}
        content={summaryModal.content}
        keyPoints={summaryModal.keyPoints}
        isLoading={summaryModal.isLoading}
      />
    </div>
  );
}