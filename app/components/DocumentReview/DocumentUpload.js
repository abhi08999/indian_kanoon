// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { FiUpload, FiFile, FiAlertCircle } from 'react-icons/fi';
// import { useRef,useState } from 'react';

// export default function DocumentUpload({ darkMode, handleFileUpload, isUploading }) {
//   const fileInputRef = useRef(null);
//   const [dragActive, setDragActive] = useState(false);
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setError('File size exceeds 10MB limit');
//         return;
//       }
//       setError(null);
//       handleFileUpload(file);
//     }
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (file.size > 10 * 1024 * 1024) {
//         setError('File size exceeds 10MB limit');
//         return;
//       }
//       setError(null);
//       handleFileUpload(file);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//       className={`mx-auto w-full max-w-2xl rounded-xl p-8 text-center border-2 border-dashed ${darkMode 
//         ? dragActive ? 'border-indigo-500 bg-gray-800/30' : 'border-gray-700 bg-gray-800/50' 
//         : dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'
//       } shadow-lg transition-colors duration-200`}
//       onDragEnter={handleDrag}
//       onDragLeave={handleDrag}
//       onDragOver={handleDrag}
//       onDrop={handleDrop}
//     >
//       <div className="flex flex-col items-center justify-center space-y-4">
//         <motion.div
//           animate={{ 
//             scale: dragActive ? 1.05 : 1,
//             y: dragActive ? -5 : 0
//           }}
//           transition={{ type: 'spring', stiffness: 400, damping: 20 }}
//         >
//           <FiUpload className={`text-4xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//         </motion.div>
        
//         <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//           {dragActive ? 'Drop your document here' : 'Upload Legal Document'}
//         </h3>
        
//         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
//           Drag and drop your file here or click to browse. Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
//         </p>
        
//         <motion.button
//   onClick={() => fileInputRef.current?.click()}
//   disabled={isUploading}
//   className={`mt-4 px-6 py-3 rounded-lg font-medium transition-all flex items-center ${darkMode 
//     ? 'bg-indigo-700 hover:bg-indigo-600 text-white' 
//     : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
//   } ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
//   whileHover={!isUploading ? { scale: 1.03 } : {}}
//   whileTap={!isUploading ? { scale: 0.98 } : {}}
// >
//           {isUploading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Uploading...
//             </>
//           ) : (
//             <>
//               <FiFile className="mr-2" />
//               Select File
//             </>
//           )}
//         </motion.button>
        
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept=".pdf,.doc,.docx,.txt"
//           className="hidden"
//           disabled={isUploading}
//         />
        
//         {error && (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`flex items-center mt-2 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}
//           >
//             <FiAlertCircle className="mr-1" />
//             {error}
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// }