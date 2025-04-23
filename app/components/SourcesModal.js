// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { FiX, FiExternalLink, FiArrowRight } from 'react-icons/fi';
// import { useEffect } from 'react';

// export default function SourcesModal({ sources, isOpen, onClose, darkMode }) {


//     // Lock body scroll and add class when modal is open
//     useEffect(() => {
//       if (isOpen) {
//         document.body.classList.add('modal-open');
//         document.body.style.overflow = 'hidden';
//       } else {
//         document.body.classList.remove('modal-open');
//         document.body.style.overflow = '';
//       }
  
//       return () => {
//         document.body.classList.remove('modal-open');
//         document.body.style.overflow = '';
//       };
//     }, [isOpen]);

//   return (
// <AnimatePresence mode="wait">
//       {isOpen && (
//         <>
//    <motion.div
//             key="modal-overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.3 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black z-[1000]"
//             onClick={onClose}
//           />
          
//               {/* Modal container - fixed to viewport */}
//               <motion.div
//             key="modal-content"
//             initial={{ opacity: 0, x: '100%' }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: '100%' }}
//             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//             className={`fixed top-0 right-0 h-full w-full max-w-md z-[1001] ${
//               darkMode ? 'bg-gray-800' : 'bg-white'
//             } shadow-2xl flex flex-col`}
//             style={{ 
//               marginTop: '74px', 
//               height: 'calc(100vh - 74px)',
//               isolation: 'isolate'
//             }}
//           >
//             <div className={`sticky top-0 p-4 border-b ${
//               darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
//             } flex items-center justify-between z-10`}>
//               <h3 className={`text-lg font-medium flex items-center ${
//                 darkMode ? 'text-white' : 'text-gray-900'
//               }`}>
//                 <FiExternalLink className="mr-2" />
//                 Sources ({sources.length})
//               </h3>
//               <button
//                 onClick={onClose}
//                 className={`cursor-pointer p-1.5 rounded-full ${
//                   darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
//                 } transition-colors`}
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>
            
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {sources.map((source, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={`p-4 rounded-xl ${
//                     darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
//                   } transition-colors border ${
//                     darkMode ? 'border-gray-700' : 'border-gray-200'
//                   }`}
//                 >
//                   <a
//                     href={source.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block"
//                   >
//                     <p className={`font-medium mb-2 ${
//                       darkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'
//                     }`}>
//                       {source.title}
//                     </p>
//                     <p className={`text-sm ${
//                       darkMode ? 'text-gray-300' : 'text-gray-600'
//                     }`}>
//                       {source.description}
//                     </p>
//                     <p className={`mt-2 text-xs ${
//                       darkMode ? 'text-gray-400' : 'text-gray-500'
//                     }`}>
//                       {source.site}
//                     </p>
//                   </a>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
  
//   );
// }

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

export default function SourcesModal({ sources, isOpen, onClose, darkMode }) {
  const contentRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate if content overflows and needs scrolling
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const contentEl = contentRef.current;
      const needsScroll = contentEl.scrollHeight > contentEl.clientHeight;
      contentEl.style.overflowY = needsScroll ? 'auto' : 'hidden';
    }
  }, [isOpen, sources]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[1000]"
            onClick={onClose}
          />
          
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed top-0 right-0 h-full w-full max-w-md z-[1001] ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl flex flex-col`}
            style={{ 
              marginTop: '74px', 
              height: 'calc(100vh - 200px)',
              isolation: 'isolate'
            }}
          >
            <div className={`sticky top-0 p-4 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } flex items-center justify-between z-10`}>
              <h3 className={`text-lg font-medium flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <FiExternalLink className="mr-2" />
                Sources ({sources.length})
              </h3>
              <button
                onClick={onClose}
                className={`cursor-pointer p-1.5 rounded-full ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                } transition-colors`}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div 
              ref={contentRef}
              className="flex-1 p-4 space-y-4 overflow-y-hidden" // Default to hidden
              style={{
                // Will be set to 'auto' by useEffect when needed
                overflowY: 'hidden'
              }}
            >
              {sources.map((source, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors border ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <p className={`font-medium mb-2 ${
                      darkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'
                    }`}>
                      {source.title}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {source.description}
                    </p>
                    <p className={`mt-2 text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {source.site}
                    </p>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}