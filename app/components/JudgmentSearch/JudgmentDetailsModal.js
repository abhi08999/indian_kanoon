// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import PropTypes from 'prop-types';
// import { 
//   FiArrowLeft, 
//   FiDownload, 
//   FiX, 
//   FiChevronLeft, 
//   FiChevronRight, 
//   FiAlertCircle,
//   FiLoader,
//   FiPercent,
//   FiFileText
// } from 'react-icons/fi';

// import SummaryModal from './SummaryModal';

// // Utility function to clean judgment text
// const formatJudgmentContent = (html) => {
//   if (!html) return '';
  
//   // Create temporary element to parse HTML
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = html;

//   // Process legal citations (links to other documents)
//   const citations = tempDiv.querySelectorAll('a[href^="/doc/"]');
//   citations.forEach(citation => {
//     const span = document.createElement('span');
//     span.className = 'legal-citation';
//     span.textContent = citation.textContent;
//     citation.replaceWith(span);
//   });

//   // Replace paragraphs with line breaks
//   const paragraphs = tempDiv.querySelectorAll('p');
//   paragraphs.forEach(p => {
//     p.insertAdjacentHTML('afterend', '<br><br>');
//     p.remove();
//   });

//   // Remove remaining HTML tags but preserve content
//   let text = tempDiv.innerHTML
//     .replace(/<br\s*\/?>/gi, '\n')
//     .replace(/<\/?[^>]+(>|$)/g, '')
//     .replace(/&nbsp;/g, ' ')
//     .replace(/&quot;/g, '"')
//     .replace(/&amp;/g, '&')
//     .replace(/&lt;/g, '<')
//     .replace(/&gt;/g, '>')
//     .replace(/\n{3,}/g, '\n\n');

//   return text.trim();
// };

// export default function JudgmentDetailsModal({ 
//   judgment, 
//   darkMode, 
//   onClose,
//   onBack
// }) {
//   // State management
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pages, setPages] = useState([]);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [showDownloadAlert, setShowDownloadAlert] = useState(false);
//   const [isInitializing, setIsInitializing] = useState(true);
//   const [summaryModal, setSummaryModal] = useState({
//     open: false,
//     content: '',
//     isLoading: false,
//     keyPoints: [],
//     title: '',
//     metadata: null
//   });
//   const contentRef = useRef(null);

//   // Safe defaults for judgment data
//   const safeJudgment = judgment || {
//     title: 'Document Not Available',
//     docsource: 'Unknown Court',
//     publishdate: new Date().toISOString(),
//     citation: 'N/A',
//     doc: 'The requested document could not be loaded. Please try again later.'
//   };

//   // Format date for display
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return 'Date not available';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric'
//       });
//     } catch {
//       return 'Invalid date';
//     }
//   }, []);

//   // Initialize document pages
//   useEffect(() => {
//     const initializeDocument = () => {
//       try {
//         if (!safeJudgment?.doc) {
//           setPages(['Document content not available']);
//           return;
//         }
        
//         const content = safeJudgment.doc;
//         const wordsPerPage = 800;
//         const words = content.split(' ');
//         const totalPages = Math.ceil(words.length / wordsPerPage);
        
//         const newPages = [];
//         for (let i = 0; i < totalPages; i++) {
//           const start = i * wordsPerPage;
//           const end = start + wordsPerPage;
//           const pageContent = words.slice(start, end).join(' ');
//           newPages.push(pageContent);
//         }
        
//         setPages(newPages);
//         setCurrentPage(1);
//       } catch (error) {
//         console.error('Error initializing document:', error);
//         setPages(['Error loading document content']);
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     initializeDocument();
//   }, [safeJudgment]);

//   // Reset scroll on page change
//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [currentPage]);

//   // Handle PDF download (mock)
//   const handleDownloadPDF = useCallback(async () => {
//     setShowDownloadAlert(true);
//     setIsDownloading(true);
//     setTimeout(() => {
//       setIsDownloading(false);
//       setTimeout(() => setShowDownloadAlert(false), 3000);
//     }, 1500);
//   }, []);

//   // Handle page navigation
//   const handlePageChange = useCallback((newPage) => {
//     setCurrentPage(Math.max(1, Math.min(pages.length, newPage)));
//   }, [pages.length]);

//   // Generate document summary
//   const handleGenerateSummary = useCallback(async () => {
//     try {
//       // Set loading state
//       setSummaryModal({
//         open: true,
//         content: '',
//         isLoading: true,
//         keyPoints: [],
//         title: safeJudgment.title,
//         metadata: {
//           date: safeJudgment.publishdate,
//           court: safeJudgment.docsource,
//           citation: safeJudgment.citation
//         }
//       });

//       // API call to generate summary
//       const response = await axios.post('/api/generate-summary', {
//         title: safeJudgment.title,
//         content: safeJudgment.doc.substring(0, 3000)
//       });

//       // Update with results
//       setSummaryModal(prev => ({
//         ...prev,
//         content: response.data?.summary || 'No summary content available',
//         isLoading: false,
//         keyPoints: response.data?.keyPoints || []
//       }));
//     } catch (error) {
//       console.error('Summary generation failed:', error);
//       setSummaryModal(prev => ({
//         ...prev,
//         content: 'Failed to generate summary. Please try again later.',
//         isLoading: false
//       }));
//     }
//   }, [safeJudgment]);

//   return (
//     <>
//       {/* Main Modal Container */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className={`fixed inset-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} overflow-y-auto`}
//         ref={contentRef}
//       >
//         {/* Header */}
//         <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
//           <div className="max-w-7xl mx-auto px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <button 
//                   onClick={onBack}
//                   className={` cursor-pointer p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
//                   aria-label="Back to list"
//                 >
//                   <FiArrowLeft size={20} />
//                 </button>
//                 <h2 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
//                   Judgment Details
//                 </h2>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={handleDownloadPDF}
//                   disabled={isDownloading}
//                   className={`cursor-pointer flex items-center px-4 py-2 rounded-lg ${
//                     darkMode 
//                       ? 'bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200' 
//                       : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
//                   } transition-colors ${isDownloading ? 'opacity-70' : ''}`}
//                 >
//                   {isDownloading ? (
//                     <FiLoader className="mr-2 animate-spin" />
//                   ) : (
//                     <FiDownload className="mr-2" />
//                   )}
//                   <span className='text-sm'>Download PDF</span>
//                 </button>
//                 <button 
//                   onClick={onClose}
//                   className={` cursor-pointer p-2 rounded-full ${
//                     darkMode 
//                       ? 'hover:bg-gray-700 text-gray-300' 
//                       : 'hover:bg-gray-100 text-gray-600'
//                   } transition-colors`}
//                   aria-label="Close"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Download Alert */}
//         <AnimatePresence>
//           {showDownloadAlert && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
//                 darkMode 
//                   ? 'bg-amber-900/80 text-amber-100' 
//                   : 'bg-amber-100 text-amber-800'
//               }`}
//             >
//               <FiAlertCircle className="mr-2" />
//               <span>PDF download feature will be available soon</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Document Info */}
//        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-wrap items-center gap-4">
//             <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               <span className="font-medium">Court:</span> {judgment.docsource || 'Not specified'}
//             </div>
//             <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               <span className="font-medium">Date:</span> {formatDate(safeJudgment.publishdate)}
//             </div>
//             {safeJudgment.citation && (
//               <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 <span className="font-medium">Citation:</span> {safeJudgment.citation}
//               </div>
//             )}
//           </div>
//           <h1 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
//             {safeJudgment.title}
//           </h1>
//         </div>
//       </div>

//         {/* Document Content */}
//         {isInitializing ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="flex flex-col items-center">
//               <FiLoader className={`animate-spin text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-2`} />
//               <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading document...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center py-8">
//             {pages.length > 0 && (
//               <div 
//                 className={`relative ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-lg mb-6 overflow-hidden document-container`}
//                 style={{
//                   width: '210mm',
//                   minHeight: '297mm',
//                   padding: '25mm',
//                   boxSizing: 'border-box'
//                 }}
//               >
//                 <div 
//                   style={{
//                     fontFamily: "'Georgia', 'Times New Roman', 'Times', 'serif'",
//                     fontSize: '12pt',
//                     lineHeight: '1.8',
//                     textAlign: 'justify',
//                     hyphens: 'auto',
//                     whiteSpace: 'pre-line'
//                   }}
//                   dangerouslySetInnerHTML={{ 
//                     __html: formatJudgmentContent(pages[currentPage - 1]) 
//                   }}
//                 />
                
//                 <div 
//                   className={`absolute bottom-5 right-5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
//                   style={{ fontFamily: "'Arial', sans-serif" }}
//                 >
//                   Page {currentPage} of {pages.length}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination Controls */}
//         {pages.length > 1 && (
//           <div className={`sticky bottom-0 left-0 right-0 py-3 ${
//             darkMode 
//               ? 'bg-gray-800/90 border-t border-gray-700' 
//               : 'bg-white/90 border-t border-gray-200'
//           } backdrop-blur-sm shadow-lg`}>
//             <div className="max-w-7xl mx-auto flex justify-center items-center space-x-4">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`p-2 rounded-full ${
//                   darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
//                 } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//                 aria-label="Previous page"
//               >
//                 <FiChevronLeft className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//               </button>
//               <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 Page {currentPage} of {pages.length}
//               </span>
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === pages.length}
//                 className={`p-2 rounded-full ${
//                   darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
//                 } ${currentPage === pages.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//                 aria-label="Next page"
//               >
//                 <FiChevronRight className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
//               </button>
//             </div>
//           </div>
//         )}
//       </motion.div>

//       {/* Summary Modal */}
//       <SummaryModal
//         isOpen={summaryModal.open}
//         onClose={() => setSummaryModal(prev => ({ ...prev, open: false }))}
//         darkMode={darkMode}
//         title={summaryModal.title}
//         metadata={summaryModal.metadata}
//         content={summaryModal.content}
//         keyPoints={summaryModal.keyPoints}
//         isLoading={summaryModal.isLoading}
//       />

//       {/* Add these styles to your CSS file */}
//       <style jsx global>{`
//         .legal-citation {
//           color: ${darkMode ? '#818cf8' : '#4f46e5'};
//           font-weight: 500;
//           text-decoration: underline;
//           cursor: pointer;
//         }
//         .document-container {
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//         }
//       `}</style>
//     </>
//   );
// }

// // Prop type validation
// JudgmentDetailsModal.propTypes = {
//   judgment: PropTypes.shape({
//     title: PropTypes.string,
//     docsource: PropTypes.string,
//     publishdate: PropTypes.string,
//     citation: PropTypes.string,
//     doc: PropTypes.string
//   }),
//   darkMode: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onBack: PropTypes.func.isRequired
// };

// // Default props
// JudgmentDetailsModal.defaultProps = {
//   judgment: null
// };

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PropTypes from 'prop-types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiAlertCircle,
  FiLoader,
  FiPercent,
  FiFileText
} from 'react-icons/fi';

import SummaryModal from './SummaryModal';

// Utility function to clean judgment text
const formatJudgmentContent = (html) => {
  if (!html) return '';
  
  // Create temporary element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Process legal citations (links to other documents)
  const citations = tempDiv.querySelectorAll('a[href^="/doc/"]');
  citations.forEach(citation => {
    const span = document.createElement('span');
    span.className = 'legal-citation';
    span.textContent = citation.textContent;
    citation.replaceWith(span);
  });

  // Replace paragraphs with line breaks
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.insertAdjacentHTML('afterend', '<br><br>');
    p.remove();
  });

  // Remove remaining HTML tags but preserve content
  let text = tempDiv.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n');

  return text.trim();
};

export default function JudgmentDetailsModal({ 
  judgment, 
  darkMode, 
  onClose,
  onBack
}) {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [summaryModal, setSummaryModal] = useState({
    open: false,
    content: '',
    isLoading: false,
    keyPoints: [],
    title: '',
    metadata: null
  });
  const contentRef = useRef(null);
  const pdfContentRef = useRef(null);

  // Safe defaults for judgment data
  const safeJudgment = judgment || {
    title: 'Document Not Available',
    docsource: 'Unknown Court',
    publishdate: new Date().toISOString(),
    citation: 'N/A',
    doc: 'The requested document could not be loaded. Please try again later.'
  };

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }, []);

  // Initialize document pages
  useEffect(() => {
    const initializeDocument = () => {
      try {
        if (!safeJudgment?.doc) {
          setPages(['Document content not available']);
          return;
        }
        
        const content = safeJudgment.doc;
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
      } catch (error) {
        console.error('Error initializing document:', error);
        setPages(['Error loading document content']);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDocument();
  }, [safeJudgment]);

  // Reset scroll on page change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Handle PDF download
  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add title page
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(safeJudgment.title, 105, 40, { align: 'center', maxWidth: 180 });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Court: ${safeJudgment.docsource || 'Not specified'}`, 105, 60, { align: 'center' });
      doc.text(`Date: ${formatDate(safeJudgment.publishdate)}`, 105, 70, { align: 'center' });
      if (safeJudgment.citation) {
        doc.text(`Citation: ${safeJudgment.citation}`, 105, 80, { align: 'center' });
      }

      // Add content pages
      doc.addPage();
      let yPosition = 20;
      let pageCount = 1;

      doc.setFontSize(12);
      doc.setFont('times', 'normal');
      
      // Split the content into lines that fit the PDF page
      const lines = doc.splitTextToSize(formatJudgmentContent(safeJudgment.doc), 180);
      
      for (let i = 0; i < lines.length; i++) {
        if (yPosition > 270) { // Check if we need a new page
          doc.addPage();
          yPosition = 20;
          pageCount++;
        }
        
        doc.text(lines[i], 15, yPosition);
        yPosition += 7; // Line height
      }

      // Add page numbers
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
      }

      // Save the PDF
      doc.save(`${safeJudgment.title.substring(0, 50)}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowDownloadAlert(true);
      setTimeout(() => setShowDownloadAlert(false), 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [safeJudgment, formatDate]);

  // Handle page navigation
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(Math.max(1, Math.min(pages.length, newPage)));
  }, [pages.length]);

  // Generate document summary
  const handleGenerateSummary = useCallback(async () => {
    try {
      // Set loading state
      setSummaryModal({
        open: true,
        content: '',
        isLoading: true,
        keyPoints: [],
        title: safeJudgment.title,
        metadata: {
          date: safeJudgment.publishdate,
          court: safeJudgment.docsource,
          citation: safeJudgment.citation
        }
      });

      // API call to generate summary
      const response = await axios.post('/api/generate-summary', {
        title: safeJudgment.title,
        content: safeJudgment.doc.substring(0, 3000)
      });

      // Update with results
      setSummaryModal(prev => ({
        ...prev,
        content: response.data?.summary || 'No summary content available',
        isLoading: false,
        keyPoints: response.data?.keyPoints || []
      }));
    } catch (error) {
      console.error('Summary generation failed:', error);
      setSummaryModal(prev => ({
        ...prev,
        content: 'Failed to generate summary. Please try again later.',
        isLoading: false
      }));
    }
  }, [safeJudgment]);

  return (
    <>
      {/* Main Modal Container */}
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
                  className={` cursor-pointer p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                  aria-label="Back to list"
                >
                  <FiArrowLeft size={20} />
                </button>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  Judgment Details
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={`cursor-pointer flex items-center px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-200' 
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                  } transition-colors ${isDownloading ? 'opacity-70' : ''}`}
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
                  className={` cursor-pointer p-2 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  } transition-colors`}
                  aria-label="Close"
                >
                  <FiX size={20} />
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
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
                darkMode 
                  ? 'bg-amber-900/80 text-amber-100' 
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <FiAlertCircle className="mr-2" />
              <span>Error generating PDF. Please try again.</span>
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
              <span className="font-medium">Date:</span> {formatDate(safeJudgment.publishdate)}
            </div>
            {safeJudgment.citation && (
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className="font-medium">Citation:</span> {safeJudgment.citation}
              </div>
            )}
          </div>
          <h1 className={`text-2xl font-bold mt-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            {safeJudgment.title}
          </h1>
        </div>
      </div>

        {/* Document Content */}
        {isInitializing ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <FiLoader className={`animate-spin text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mb-2`} />
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading document...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            {pages.length > 0 && (
              <div 
                className={`relative ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-lg mb-6 overflow-hidden document-container`}
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '25mm',
                  boxSizing: 'border-box'
                }}
                ref={pdfContentRef}
              >
                <div 
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', 'Times', 'serif'",
                    fontSize: '12pt',
                    lineHeight: '1.8',
                    textAlign: 'justify',
                    hyphens: 'auto',
                    whiteSpace: 'pre-line'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatJudgmentContent(pages[currentPage - 1]) 
                  }}
                />
                
                <div 
                  className={`absolute bottom-5 right-5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  style={{ fontFamily: "'Arial', sans-serif" }}
                >
                  Page {currentPage} of {pages.length}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {pages.length > 1 && (
          <div className={`sticky bottom-0 left-0 right-0 py-3 ${
            darkMode 
              ? 'bg-gray-800/90 border-t border-gray-700' 
              : 'bg-white/90 border-t border-gray-200'
          } backdrop-blur-sm shadow-lg`}>
            <div className="max-w-7xl mx-auto flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label="Previous page"
              >
                <FiChevronLeft className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Page {currentPage} of {pages.length}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pages.length}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } ${currentPage === pages.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label="Next page"
              >
                <FiChevronRight className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Modal */}
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

      {/* Add these styles to your CSS file */}
      <style jsx global>{`
        .legal-citation {
          color: ${darkMode ? '#818cf8' : '#4f46e5'};
          font-weight: 500;
          text-decoration: underline;
          cursor: pointer;
        }
        .document-container {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </>
  );
}

// Prop type validation
JudgmentDetailsModal.propTypes = {
  judgment: PropTypes.shape({
    title: PropTypes.string,
    docsource: PropTypes.string,
    publishdate: PropTypes.string,
    citation: PropTypes.string,
    doc: PropTypes.string
  }),
  darkMode: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

// Default props
JudgmentDetailsModal.defaultProps = {
  judgment: null
};