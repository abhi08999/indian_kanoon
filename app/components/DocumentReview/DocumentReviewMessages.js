// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import DocumentMessage from './DocumentMessage';
// import DocumentUpload from './DocumentUpload';

// export default function DocumentReviewMessages({ 
//   messages, 
//   isLoading, 
//   darkMode, 
//   loadingMessage, 
//   messagesEndRef,
//   uploadedFile,
//   handleFileUpload,
//   isUploading
// }) {
//   return (
//     <div className="chat-container px-4">
//       {!uploadedFile && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="flex flex-col items-center justify-center h-full"
//         >
//           <DocumentUpload 
//             darkMode={darkMode} 
//             handleFileUpload={handleFileUpload} 
//             isUploading={isUploading} 
//           />
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className={`mt-8 max-w-md text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
//           >
//             <h3 className="text-lg font-medium mb-2">Analyze Legal Documents</h3>
//             <p className="text-sm">
//               Upload contracts, agreements, or legal documents to get instant analysis, 
//               summaries, and answers to your questions.
//             </p>
//           </motion.div>
//         </motion.div>
//       )}

//       {uploadedFile && (
//         <div key="messages-list" className="space-y-6">
//           {messages.length === 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50'} max-w-2xl mx-auto`}
//             >
//               <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-indigo-700'}`}>
//                 Document Ready for Analysis
//               </h3>
//               <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Ask questions about the document or request a summary to get started.
//               </p>
//             </motion.div>
//           )}

//           {messages.map((msg) => (
//             <div 
//               key={msg.id} 
//               className="relative z-0 max-w-7xl mx-auto"
//               style={{
//                 transform: 'none',
//                 opacity: 1
//               }}
//             >
//               <DocumentMessage 
//                 message={msg} 
//                 darkMode={darkMode} 
//               />
//             </div>
//           ))}
//         </div>
//       )}
      
//       {isLoading && (
//         <AnimatePresence>
//           <motion.div
//             key={`loading-${Date.now()}`}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="flex justify-start mb-6 relative z-0"
//           >
//             <div className={`max-w-3xl rounded-3xl rounded-bl-none px-6 py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//               <div className="flex items-center space-x-3">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={`dot-${Date.now()}-${i}`}
//                     className="w-2.5 h-2.5 rounded-full bg-indigo-400"
//                     animate={{ y: [0, -5, 0] }}
//                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
//                   />
//                 ))}
//                 <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   {loadingMessage}
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       )}
//       {/* <div  className="relative z-0 h-8" /> */}
//     </div>
//   );
// }