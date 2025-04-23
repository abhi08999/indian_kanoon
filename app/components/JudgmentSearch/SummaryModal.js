// // 'use client';

// // import { motion, AnimatePresence } from 'framer-motion';
// // import { FiX, FiLoader } from 'react-icons/fi';

// // export default function SummaryModal({ 
// //   isOpen, 
// //   onClose, 
// //   darkMode, 
// //   title, 
// //   metadata, 
// //   content, 
// //   keyPoints,
// //   isLoading 
// // }) {
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'Date not available';
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('en-IN', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric'
// //     });
// //   };

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
// //           <motion.div
// //             initial={{ opacity: 0, scale: 0.9 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             exit={{ opacity: 0, scale: 0.9 }}
// //             className={`relative max-w-4xl w-full mx-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl overflow-hidden`}
// //           >
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <div>
// //                   <h3 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
// //                     {title || 'Relevance Summary'}
// //                   </h3>
// //                   {metadata && (
// //                     <div className="flex flex-wrap gap-2 mt-2">
// //                       <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
// //                         {metadata.court}
// //                       </span>
// //                       <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
// //                         {formatDate(metadata.date)}
// //                       </span>
// //                       {metadata.citation && (
// //                         <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
// //                           {metadata.citation}
// //                         </span>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //                 <button 
// //                   onClick={onClose}
// //                   className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
// //                 >
// //                   <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
// //                 </button>
// //               </div>
              
// //               {isLoading ? (
// //                 <div className="flex flex-col items-center justify-center py-8">
// //                   <motion.div
// //                     animate={{ rotate: 360 }}
// //                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
// //                     className={`mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
// //                   >
// //                     <FiLoader className="text-2xl" />
// //                   </motion.div>
// //                   <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Generating summary...</p>
// //                 </div>
// //               ) : (
// //                 <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} max-h-[70vh] overflow-y-auto`}>
// //                   <div className="prose max-w-none">
// //                     {content.split('\n').map((paragraph, i) => (
// //                       <p key={i} className="mb-3">{paragraph}</p>
// //                     ))}
// //                   </div>
// //                   {keyPoints && keyPoints.length > 0 && (
// //                     <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-indigo-50'}`}>
// //                       <h4 className={`font-medium mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Key Points:</h4>
// //                       <ul className="list-disc pl-5 space-y-1">
// //                         {keyPoints.map((point, i) => (
// //                           <li key={i}>{point}</li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </motion.div>
// //         </div>
// //       )}
// //     </AnimatePresence>
// //   );
// // }

// // SummaryModal.js
// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { FiX, FiLoader } from 'react-icons/fi';

// export default function SummaryModal({ 
//   isOpen, 
//   onClose, 
//   darkMode, 
//   title, 
//   metadata, 
//   content, 
//   keyPoints,
//   isLoading 
// }) {
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date not available';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.95 }}
//             transition={{ type: 'spring', damping: 25, stiffness: 400 }}
//             className={`relative max-w-4xl w-full mx-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl overflow-hidden`}
//           >
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className={`text-xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
//                     {title || 'Relevance Summary'}
//                   </h3>
//                   {metadata && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
//                         {metadata.court}
//                       </span>
//                       <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
//                         {formatDate(metadata.date)}
//                       </span>
//                       {metadata.citation && (
//                         <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-700'}`}>
//                           {metadata.citation}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <button 
//                   onClick={onClose}
//                   className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}
//                 >
//                   <FiX className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
//                 </button>
//               </div>
              
//               {isLoading ? (
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex flex-col items-center justify-center py-12"
//                 >
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                     className={`mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
//                   >
//                     <FiLoader className="text-3xl" />
//                   </motion.div>
//                   <motion.p 
//                     initial={{ y: 5 }}
//                     animate={{ y: 0 }}
//                     transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
//                     className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}
//                   >
//                     Generating summary...
//                   </motion.p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} max-h-[70vh] overflow-y-auto`}
//                 >
//                   <div className="prose max-w-none">
//                     {content.split('\n').map((paragraph, i) => (
//                       <p key={i} className="mb-3">{paragraph}</p>
//                     ))}
//                   </div>
//                   {keyPoints && keyPoints.length > 0 && (
//                     <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-indigo-50'}`}>
//                       <h4 className={`font-medium mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Key Points:</h4>
//                       <ul className="list-disc pl-5 space-y-1">
//                         {keyPoints.map((point, i) => (
//                           <li key={i}>{point}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLoader, FiBookmark, FiCalendar, FiHash, FiFileText, FiAward } from 'react-icons/fi';

export default function SummaryModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  title, 
  metadata, 
  content, 
  isLoading 
}) {
  const formatDate = (dateString) => {
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
  };

  const formatCaseTitle = (title) => {
    if (!title) return 'Case Title Not Available';
    const parts = title.split(' vs ');
    if (parts.length === 2) {
      return (
        <>
          <span className="font-medium">{parts[0].trim()}</span>
          <span className="mx-2 text-gray-500 font-normal">vs</span>
          <span className="font-medium">{parts[1].trim()}</span>
        </>
      );
    }
    return title;
  };

  const renderSection = (section, index) => {
    if (!section) return null;
    
    // Special handling for CASE TITLE
    if (section.startsWith('CASE TITLE')) {
      const titleContent = section.includes(':') 
        ? section.split(':')[1].trim()
        : section.replace('CASE TITLE', '').trim();
      
      return (
        <div key={`section-${index}`} className="mb-8 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-4 ${darkMode ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <FiAward className="mr-2" />
            <span className="text-sm font-medium tracking-wider">CASE TITLE</span>
          </div>
          <h2 className={`text-2xl font-serif font-bold leading-tight ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {formatCaseTitle(titleContent)}
          </h2>
        </div>
      );
    }

    const [heading, ...points] = section.split('\n');
    const hasColon = heading.includes(':');
    const cleanHeading = hasColon ? heading.split(':')[0] : heading;

    // Select icon based on section type
    const getSectionIcon = () => {
      switch(cleanHeading.trim()) {
        case 'KEY DETAILS': return <FiBookmark className={`mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />;
        case 'LEGAL PROVISIONS': return <FiFileText className={`mr-3 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />;
        case 'ISSUES CONSIDERED': return <FiHash className={`mr-3 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />;
        default: return <FiFileText className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />;
      }
    };

    return (
      <div key={`section-${index}`} className="mb-8 last:mb-0">
        {/* Section Heading */}
        <div className={`flex items-center mb-4 pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          {getSectionIcon()}
          <h3 className={`
            text-lg font-medium font-sans 
            ${darkMode ? 'text-gray-200' : 'text-gray-800'}
          `}>
            {cleanHeading}
          </h3>
        </div>
        
        {/* Section Content */}
        <div className="space-y-3 pl-1">
          {points.filter(p => p.trim()).map((point, i) => (
            <div key={`point-${i}`} className="flex items-start">
              {point.startsWith('•') && (
                <span className={`mt-1 mr-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
              )}
              <p className={`
                text-[18px] leading-relaxed font-[Noto]
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}
              `}>
                {point.startsWith('•') ? point.substring(1).trim() : point}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative max-w-3xl w-full mx-4 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}
          >
            {/* Header */}
            <div className={`px-8 py-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-700'} mb-3`}>
                    <FiBookmark className="mr-2" />
                    <span className="text-sm font-medium tracking-wide">LEGAL SUMMARY</span>
                  </div>
                  {metadata && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className={`flex items-center px-3 py-1.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                        <FiCalendar className="mr-2" />
                        {formatDate(metadata.date)}
                      </div>
                      <div className={`flex items-center px-3 py-1.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                        <FiHash className="mr-2" />
                        {metadata.caseNo ? `Case No: ${metadata.caseNo}` : 'Case No: Not Available'}
                      </div>
                      {metadata.court && (
                        <div className={`flex items-center px-3 py-1.5 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                          <FiAward className="mr-2" />
                          {metadata.court}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className={`cursor-pointer p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                  aria-label="Close modal"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className={`mb-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  <FiLoader className="text-3xl" />
                </motion.div>
                <motion.p 
                  initial={{ y: 5 }}
                  animate={{ y: 0 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium tracking-wide`}
                >
                  Analyzing judgment...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-h-[65vh] overflow-y-auto`}
              >
                <div className="legal-summary space-y-8">
                  {content.split('\n\n').map((section, index) => renderSection(section, index))}
                </div>
              </motion.div>
            )}
            
            {/* Footer */}
            <div className={`px-8 py-4 border-t text-xs ${darkMode ? 'border-gray-800 bg-gray-900 text-gray-500' : 'border-gray-100 bg-gray-50 text-gray-400'} flex items-center`}>
              <FiFileText className="mr-2 flex-shrink-0" />
              <span className="text-xs font-[Calibri]">Legal summary generated by OOUM AI. Verify with original documents.</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}