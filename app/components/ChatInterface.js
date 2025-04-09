// "use client";

// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiSend, FiBook, FiMessageSquare, FiInfo, FiSun, FiMoon, FiZap, FiExternalLink } from 'react-icons/fi';

// export default function ChatInterface() {
//     const [messages, setMessages] = useState([
//         { 
//             id: crypto.randomUUID(),
//             role: 'assistant', 
//             content: 'Hello! I am OOUM AI, specializing in Indian legal matters and general queries. How may I assist you today?',
//             isLegal: false,
//             source: 'ooum'
//         }
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [darkMode, setDarkMode] = useState(false);
//     const [showDarkModeTooltip, setShowDarkModeTooltip] = useState(false);
//     const textareaRef = useRef(null);
//     const messagesEndRef = useRef(null);

//     // Auto-resize textarea
//     useEffect(() => {
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';
//             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//         }
//     }, [input]);

//     // Auto-scroll to bottom
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const isAboutOOUM = (text) => {
//         const ooumKeywords = [
//             'who are you', 'what are you', 'your name', 
//             'which ai', 'what technology', 'what model',
//             'what system', 'ooum', 'who made you'
//         ];
//         return ooumKeywords.some(keyword => 
//             text.toLowerCase().includes(keyword)
//         );
//     };

//     const getLoadingMessage = (inputText) => {
//         if (!inputText) return "Processing your request...";
//         if (isAboutOOUM(inputText)) return "Getting OOUM AI information...";
//         if (inputText.toLowerCase().includes('legal') || 
//             inputText.toLowerCase().includes('law') ||
//             inputText.toLowerCase().includes('act') ||
//             inputText.toLowerCase().includes('section')) {
//             return "Searching legal databases...";
//         }
//         return "Generating response...";
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         setIsLoading(true);
//         const userMessage = { 
//             id: crypto.randomUUID(),
//             role: 'user', 
//             content: input,
//             isLegal: null,
//             source: 'user'
//         };
//         setMessages(prev => [...prev, userMessage]);
//         setInput('');

//         try {
//             const response = await axios.post('/api/search', { 
//                 query: input,
//                // chatHistory: messages.filter(m => m.role === 'user').slice(-3) 
//             });

//             const assistantMessage = {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: response.data.error 
//                     ? `Sorry, I encountered an error: ${response.data.error}`
//                     : response.data.response || response.data.content,
//                 isLegal: response.data.isLegal || false,
//                 source: response.data.source || 'unknown',
//                 ...(response.data.isLegal && {
//                     metadata: {
//                         title: response.data.title,
//                         docid: response.data.docid,
//                         court: response.data.court,
//                         date: response.data.date,
//                         citations: response.data.citations || "Not specified"
//                     }
//                 })
//             };
            
//             setMessages(prev => [...prev, assistantMessage]);
//         } catch (error) {
//             console.error('Error:', error);
//             setMessages(prev => [...prev, {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: 'Sorry, I encountered an error. Please try again later.',
//                 isLegal: false,
//                 source: 'error'
//             }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const UserMessage = ({ content }) => (
//         <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//             className="flex justify-end"
//         >
//             <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${darkMode ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white rounded-br-none shadow-lg`}>
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30"></div>
//                 <p className="relative z-10 whitespace-pre-wrap">{content}</p>
//             </div>
//         </motion.div>
//     );

//     const AssistantMessage = ({ content, isLegal, metadata, source }) => (
//         <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//             className="flex justify-start"
//         >
//             <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${isLegal ? (darkMode ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-white border border-emerald-100') : (darkMode ? 'bg-gray-800/90' : 'bg-white')} rounded-bl-none shadow-lg`}>
//                 {isLegal && (
//                     <div className={`absolute top-0 left-0 w-3 h-3 rounded-br-full ${darkMode ? 'bg-emerald-500/50' : 'bg-emerald-400/50'}`}></div>
//                 )}
                
//                 <div className="flex items-start">
//                     <div className={`mr-3 mt-1 p-2 rounded-lg ${isLegal ? (darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100') : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}>
//                         {isLegal ? (
//                             <FiBook className={`text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
//                         ) : (
//                             <FiMessageSquare className={`text-lg ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
//                         )}
//                     </div>
//                     <div className="flex-1">
//                         {content.split('\n').map((paragraph, i) => (
//                             <p key={i} className="mb-3 leading-relaxed whitespace-pre-wrap">{paragraph}</p>
//                         ))}
                        
//                         {metadata && (
//                             <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
//                                 <div className="flex items-start">
//                                     <FiInfo className={`mt-1 mr-2 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
//                                     <div>
//                                         <div className="flex items-center">
//                                             <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{metadata.title}</span>
//                                             <a 
//                                                 href={`https://indiankanoon.org/doc/${metadata.docid}/`} 
//                                                 target="_blank" 
//                                                 rel="noopener noreferrer"
//                                                 className="ml-2 text-xs p-1 rounded hover:bg-gray-700/10"
//                                             >
//                                                 <FiExternalLink className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
//                                             </a>
//                                         </div>
//                                         <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                             <span className="font-semibold">Court:</span> {metadata.court}
//                                         </div>
//                                         <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                             <span className="font-semibold">Source:</span> {source === 'indiankanoon' ? 'Indian Kanoon' : 'OOUM AI'}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );

//     return (
//         <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
//             {/* Header */}
//             <motion.header 
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border-b`}
//             >
//                 <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//                     <motion.div 
//                         whileHover={{ scale: 1.02 }}
//                         className="flex items-center space-x-3"
//                     >
//                         <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} shadow-sm`}>
//                             <FiBook className={`text-xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
//                             Indian Legal Research Assistant
//                             </h1>
//                             <p className={`text-xs tracking-wider ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
//                                 POWERED BY OOUM AI
//                             </p>
//                         </div>
//                     </motion.div>

//                     <div 
//                         className="relative"
//                         onMouseEnter={() => setShowDarkModeTooltip(true)}
//                         onMouseLeave={() => setShowDarkModeTooltip(false)}
//                     >
//                         <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => setDarkMode(!darkMode)}
//                             className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'} transition-colors`}
//                         >
//                             {darkMode ? <FiSun /> : <FiMoon />}
//                         </motion.button>
                        
//                         <AnimatePresence>
//                             {showDarkModeTooltip && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 5 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: 5 }}
//                                     className={`absolute right-0 top-full mt-2 px-3 py-1 rounded-md text-xs w-[140px] text-center ${darkMode ? 'bg-gray-700 text-amber-300' : 'bg-indigo-100 text-indigo-600'}`}
//                                 >
//                                     {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </motion.header>

//             {/* Chat Container */}
//             <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
//                 <AnimatePresence>
//                     {messages.map((msg) => (
//                         <div key={msg.id} className="mb-6">
//                             {msg.role === 'user' ? (
//                                 <UserMessage content={msg.content} />
//                             ) : (
//                                 <AssistantMessage 
//                                     content={msg.content} 
//                                     isLegal={msg.isLegal} 
//                                     metadata={msg.metadata}
//                                     source={msg.source}
//                                 />
//                             )}
//                         </div>
//                     ))}
                    
//                     {isLoading && (
//                         <motion.div
//                             key={`loading-${Date.now()}`}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="flex justify-start mb-6"
//                         >
//                             <div className={`max-w-3xl rounded-3xl rounded-bl-none px-6 py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm`}>
//                                 <div className="flex items-center space-x-3">
//                                     {[...Array(3)].map((_, i) => (
//                                         <motion.div
//                                             key={`dot-${Date.now()}-${i}`}
//                                             className="w-2.5 h-2.5 rounded-full bg-indigo-400"
//                                             animate={{ y: [0, -5, 0] }}
//                                             transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
//                                         />
//                                     ))}
//                                     <span className="text-sm">
//                                         {getLoadingMessage(input)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </AnimatePresence>
//             </div>

//             {/* Input Area */}
//             <motion.footer 
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}
//             >
//                 <div className="max-w-4xl mx-auto px-6 py-4">
//                     <form onSubmit={handleSubmit} className={`flex items-end rounded-2xl p-1 ${darkMode ? 'bg-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500/30' : 'bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300'} transition-all duration-300`}>
//                         <textarea
//                             ref={textareaRef}
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder={isLoading ? 'OOUM AI is thinking...' : 'Ask about Indian law or general queries...'}
//                             className={`flex-1 bg-transparent border-0 px-4 py-3 focus:outline-none resize-none ${darkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-800'}`}
//                             disabled={isLoading}
//                             rows={1}
//                             style={{ minHeight: '60px', maxHeight: '150px' }}
//                         />
//                         <motion.button
//                             whileTap={{ scale: 0.95 }}
//                             type="submit"
//                             className={`p-3 rounded-full m-1 ${isLoading 
//                                 ? `${darkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-not-allowed`
//                                 : `${darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} shadow-md`
//                             } text-white transition-all`}
//                             disabled={isLoading || !input.trim()}
//                         >
//                             <FiSend className="h-5 w-5" />
//                         </motion.button>
//                     </form>
//                     <div className={`flex items-center justify-between mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//                         <div className="flex items-center">
//                             <FiZap className="mr-1.5" />
//                             <span>Powered by OOUM AI</span>
//                         </div>
//                         <div>
//                             {isLoading ? 'Processing...' : 'Shift+Enter for new line'}
//                         </div>
//                     </div>
//                 </div>
//             </motion.footer>
//         </div>
//     );
// }

// "use client";

// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiSend, FiBook, FiMessageSquare, FiInfo, FiSun, FiMoon, FiZap, FiExternalLink } from 'react-icons/fi';

// export default function ChatInterface() {
//     const [messages, setMessages] = useState([
//         { 
//             id: crypto.randomUUID(),
//             role: 'assistant', 
//             content: 'Hello! I am OOUM AI, a specialized assistant for Indian legal matters and general queries.',
//             isLegal: false,
//             source: 'ooum'
//         }
//     ]);
//     const [input, setInput] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [darkMode, setDarkMode] = useState(false);
//     const [showDarkModeTooltip, setShowDarkModeTooltip] = useState(false);
//     const textareaRef = useRef(null);
//     const messagesEndRef = useRef(null);

//     // Auto-resize textarea
//     useEffect(() => {
//         if (textareaRef.current) {
//             textareaRef.current.style.height = 'auto';
//             textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//         }
//     }, [input]);

//     // Auto-scroll to bottom
//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [messages]);

//     const isAboutOOUM = (text) => {
//         const ooumKeywords = [
//             'who are you', 'what are you', 'your name', 
//             'which ai', 'what technology', 'what model',
//             'what system', 'ooum', 'who made you'
//         ];
//         return ooumKeywords.some(keyword => 
//             text.toLowerCase().includes(keyword)
//         );
//     };

//     const getLoadingMessage = (inputText) => {
//         if (!inputText) return "Processing your request...";
//         if (isAboutOOUM(inputText)) return "Getting OOUM AI information...";
//         if (inputText.toLowerCase().includes('legal') || 
//             inputText.toLowerCase().includes('law') ||
//             inputText.toLowerCase().includes('act') ||
//             inputText.toLowerCase().includes('section')) {
//             return "Searching legal databases...";
//         }
//         return "Generating response...";
//     };

//     const handleRelatedDocSelect = async (docId) => {
//         if (!docId) return;
        
//         setIsLoading(true);
//         try {
//             const response = await axios.post('/api/search', { 
//                 docId: docId
//             });
            
//             const assistantMessage = {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: response.data.error 
//                     ? `Error: ${response.data.error}`
//                     : response.data.response || 'Document content not available',
//                 isLegal: true,
//                 source: 'indiankanoon',
//                 metadata: response.data.metadata,
//                 relatedQs: response.data.relatedQs || [],
//                 categories: response.data.categories || []
//             };
            
//             setMessages(prev => [...prev, assistantMessage]);
//         } catch (error) {
//             console.error('Document load error:', error);
//             setMessages(prev => [...prev, {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: 'Failed to load document. Please try again later.',
//                 isLegal: false,
//                 source: 'error'
//             }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         setIsLoading(true);
//         const userMessage = { 
//             id: crypto.randomUUID(),
//             role: 'user', 
//             content: input,
//             isLegal: null,
//             source: 'user'
//         };
//         setMessages(prev => [...prev, userMessage]);
//         setInput('');

//         try {
//             const response = await axios.post('/api/search', { 
//                 query: input,
//             });

//             const assistantMessage = {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: response.data.error 
//                     ? `Error: ${response.data.error}`
//                     : response.data.response || 'No response content',
//                 isLegal: response.data.isLegal || false,
//                 source: response.data.source || 'unknown',
//                 ...(response.data.isLegal && {
//                     metadata: response.data.metadata || {},
//                     filters: response.data.filters || [],
//                     relatedDocs: response.data.relatedDocs || []
//                 })
//             };
            
//             setMessages(prev => [...prev, assistantMessage]);
//         } catch (error) {
//             console.error('API Error:', error);
//             setMessages(prev => [...prev, {
//                 id: crypto.randomUUID(),
//                 role: 'assistant',
//                 content: error.response?.data?.error || 
//                         'Service unavailable. Please try again later.',
//                 isLegal: false,
//                 source: 'error'
//             }]);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const UserMessage = React.memo(({ content = '', darkMode }) => (
//         <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.3 }}
//             className="flex justify-end"
//         >
//             <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${darkMode ? 'bg-indigo-600/90' : 'bg-indigo-600'} text-white rounded-br-none shadow-lg`}>
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30"></div>
//                 <p className="relative z-10 whitespace-pre-wrap">{content}</p>
//             </div>
//         </motion.div>
//     ));

//     const AssistantMessage = ({ 
//         content = '', 
//         isLegal = false, 
//         metadata = {}, 
//         source = 'unknown',
//         filters = [],
//         relatedDocs = [],
//         relatedQs = [],
//         categories = []
//     }) => {
//         // Enhanced HTML cleaning and formatting function
//         const formatLegalContent = (html) => {
//             if (!html) return '';
            
//             // Replace HTML tags with appropriate formatting
//             let formatted = html
//                 .replace(/<b>/g, '**')  // Convert bold tags to markdown-style
//                 .replace(/<\/b>/g, '**')
//                 .replace(/<a\b[^>]*>(.*?)<\/a>/g, '$1') // Remove links but keep text
//                 .replace(/<[^>]+>/g, '') // Remove all remaining HTML tags
//                 .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold formatting (or keep if you want)
//                 .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
//                 .replace(/&quot;/g, '"')   // Decode HTML entities
//                 .replace(/&amp;/g, '&')
//                 .replace(/&lt;/g, '<')
//                 .replace(/&gt;/g, '>')
//                 .trim();
    
//             // Format section headers and numbers
//             formatted = formatted.replace(
//                 /(\bSECTION\b|\bSection\b|\bSections\b|\bArticle\b|\bART\.\b|\bArt\.\b)\s*(\d+[A-Za-z]*)/g,
//                 '$1 $2:'
//             );
    
//             // Format IPC sections specifically
//             formatted = formatted.replace(
//                 /(\bIPC\b|\bIndian Penal Code\b)\s*(Section\s*)?(\d+[A-Za-z]*)/g,
//                 'Indian Penal Code, Section $3:'
//             );
    
//             // Add proper spacing after periods if missing
//             formatted = formatted.replace(/\.([A-Za-z])/g, '. $1');
    
//             return formatted;
//         };
    
//         // Format the document title properly
//         const formatTitle = (title) => {
//             if (!title) return 'Legal Document';
//             return title
//                 .replace(/<b>/g, '')
//                 .replace(/<\/b>/g, '')
//                 .replace(/\s+/g, ' ')
//                 .trim();
//         };
    
//         // Format the snippet/preview text
//         const formatSnippet = (snippet) => {
//             if (!snippet) return 'No content available';
//             return snippet
//                 .replace(/<b>/g, '')
//                 .replace(/<\/b>/g, '')
//                 .replace(/\.\.\./g, '…')
//                 .replace(/\s+/g, ' ')
//                 .trim();
//         };
    
//         return (
//             <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="flex justify-start"
//             >
//                 <div className={`max-w-3xl rounded-3xl px-6 py-4 relative overflow-hidden ${
//                     isLegal ? (darkMode ? 'bg-emerald-900/20 border border-emerald-800/50' : 'bg-white border border-emerald-100') 
//                     : (darkMode ? 'bg-gray-800/90' : 'bg-white')
//                 } rounded-bl-none shadow-lg`}>
                    
//                     <div className="flex items-start">
//                         <div className={`mr-3 mt-1 p-2 rounded-lg ${
//                             isLegal ? (darkMode ? 'bg-emerald-900/40' : 'bg-emerald-100') 
//                             : (darkMode ? 'bg-gray-700' : 'bg-gray-100')
//                         }`}>
//                             {isLegal ? (
//                                 <FiBook className={`text-lg ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
//                             ) : (
//                                 <FiMessageSquare className={`text-lg ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
//                             )}
//                         </div>
                        
//                         <div className="flex-1">
//                             {/* Main content with proper formatting */}
//                             <div className="whitespace-pre-wrap mb-4">
//                                 {formatLegalContent(content).split('\n').map((paragraph, i) => (
//                                     <p key={i} className="mb-3 leading-relaxed">
//                                         {paragraph || <br />}
//                                     </p>
//                                 ))}
//                             </div>
    
//                             {/* Metadata section */}
//                             {isLegal && metadata && (
//                                 <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
//                                     <div className="flex items-start">
//                                         <FiInfo className={`mt-1 mr-2 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
//                                         <div>
//                                             <div className="flex items-center">
//                                                 <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                                                     {formatTitle(metadata.title)}
//                                                 </span>
//                                                 {metadata.url && (
//                                                     <a 
//                                                         href={metadata.url} 
//                                                         target="_blank" 
//                                                         rel="noopener noreferrer"
//                                                         className="ml-2 text-xs p-1 rounded hover:bg-gray-700/10"
//                                                     >
//                                                         <FiExternalLink className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
//                                                     </a>
//                                                 )}
//                                             </div>
//                                             <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                                 <span className="font-semibold">Court:</span> {metadata.source || 'Not specified'}
//                                             </div>
//                                             {metadata.date && (
//                                                 <div className={`mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                                     <span className="font-semibold">Date:</span> {new Date(metadata.date).toLocaleDateString('en-IN')}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
    
//                             {/* Related documents with proper formatting */}
//                             {isLegal && relatedDocs.length > 0 && (
//                                 <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
//                                     <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Related documents:</h4>
//                                     <div className="space-y-2">
//                                         {relatedDocs.slice(0, 3).map((doc, i) => (
//                                             <div 
//                                                 key={i} 
//                                                 onClick={() => handleRelatedDocSelect(doc.id)}
//                                                 className={`p-2 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}`}
//                                             >
//                                                 <div className="flex items-start">
//                                                     <FiBook className={`mt-1 mr-2 flex-shrink-0 ${darkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
//                                                     <div>
//                                                         <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
//                                                             {formatTitle(doc.title)}
//                                                         </p>
//                                                         <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                             {formatSnippet(doc.snippet)}
//                                                         </p>
//                                                         <div className="flex items-center mt-1 text-xs">
//                                                             <span className={`mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//                                                                 {doc.source || 'Unknown source'}
//                                                             </span>
//                                                             {doc.date && (
//                                                                 <span className={`mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//                                                                     {new Date(doc.date).toLocaleDateString('en-IN')}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
    
//     {isLegal && relatedQs.length > 0 && (
//                                 <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
//                                     <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                                         Related Legal Questions:
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                         {relatedQs.slice(0, 5).map((q, i) => (
//                                             <button
//                                                 key={i}
//                                                 onClick={() => setInput(q.value)}
//                                                 className={`text-xs px-3 py-1 rounded-full ${
//                                                     darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-300' 
//                                                     : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
//                                                 } transition-colors`}
//                                             >
//                                                 {q.value}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {isLegal && categories.length > 0 && (
//                                 <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
//                                     <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                                         Legal Categories:
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                         {categories.slice(0, 5).map((cat, i) => (
//                                             <span 
//                                                 key={i}
//                                                 className={`text-xs px-3 py-1 rounded-full ${
//                                                     darkMode ? 'bg-gray-700 text-emerald-300' 
//                                                     : 'bg-gray-100 text-emerald-600'
//                                                 }`}
//                                             >
//                                                 {cat.value}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         );
//     };
//     return (
//         <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
//             {/* Header */}
//             <motion.header 
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border-b`}
//             >
//                 <div className="max-w-[98%] mx-auto px-6 py-3 flex items-center justify-between">
//                     <motion.div 
//                         whileHover={{ scale: 1.02 }}
//                         className="flex items-center space-x-3"
//                     >
//                         <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} shadow-sm`}>
//                             <FiBook className={`text-xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
//                             Indian Legal Research Assistant
//                             </h1>
//                             <p className={`text-xs tracking-wider ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
//                                 POWERED BY OOUM AI
//                             </p>
//                         </div>
//                     </motion.div>

//                     <div 
//                         className="relative"
//                         onMouseEnter={() => setShowDarkModeTooltip(true)}
//                         onMouseLeave={() => setShowDarkModeTooltip(false)}
//                     >
//                         <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => setDarkMode(!darkMode)}
//                             className={`cursor-pointer p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'} transition-colors`}
//                         >
//                             {darkMode ? <FiSun /> : <FiMoon />}
//                         </motion.button>
                        
//                         <AnimatePresence>
//                             {showDarkModeTooltip && (
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 5 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: 5 }}
//                                     className={`absolute right-0 top-full mt-2 px-3 py-1 rounded-md text-xs w-[140px] text-center ${darkMode ? 'bg-gray-700 text-amber-300' : 'bg-indigo-100 text-indigo-600'}`}
//                                 >
//                                     {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </div>
//                 </div>
//             </motion.header>

//             {/* Chat Container */}
//             <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
//                 <AnimatePresence>
//                     {messages.map((msg) => (
//                         <div key={msg.id} className="mb-6">
//                             {msg.role === 'user' ? (
//                                 <UserMessage content={msg.content} />
//                             ) : (
//                                 <AssistantMessage 
//                                     content={msg.content} 
//                                     isLegal={msg.isLegal} 
//                                     metadata={msg.metadata}
//                                     source={msg.source}
//                                     filters={msg.filters}
//                                     relatedDocs={msg.relatedDocs}
//                                     relatedQs={msg.relatedQs}
//                                     categories={msg.categories}
//                                 />
//                             )}
//                         </div>
//                     ))}
                    
//                     {isLoading && (
//                         <motion.div
//                             key={`loading-${Date.now()}`}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             className="flex justify-start mb-6"
//                         >
//                             <div className={`max-w-3xl rounded-3xl rounded-bl-none px-6 py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm`}>
//                                 <div className="flex items-center space-x-3">
//                                     {[...Array(3)].map((_, i) => (
//                                         <motion.div
//                                             key={`dot-${Date.now()}-${i}`}
//                                             className="w-2.5 h-2.5 rounded-full bg-indigo-400"
//                                             animate={{ y: [0, -5, 0] }}
//                                             transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
//                                         />
//                                     ))}
//                                     <span className="text-sm">
//                                         {getLoadingMessage(input)}
//                                     </span>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </AnimatePresence>
//             </div>

//             {/* Input Area */}
//             <motion.footer 
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}
//             >
//                 <div className="max-w-4xl mx-auto px-6 py-4">
//                     <form onSubmit={handleSubmit} className={`flex items-end rounded-2xl p-1 ${darkMode ? 'bg-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500/30' : 'bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300'} transition-all duration-300`}>
//                         <textarea
//                             ref={textareaRef}
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder={isLoading ? 'OOUM AI is thinking...' : 'Ask about Indian law or general queries...'}
//                             className={`flex-1 bg-transparent border-0 px-4 py-3 focus:outline-none resize-none ${darkMode ? 'placeholder-gray-500 text-white' : 'placeholder-gray-400 text-gray-800'}`}
//                             disabled={isLoading}
//                             rows={1}
//                             style={{ minHeight: '60px', maxHeight: '150px' }}
//                             onKeyDown={(e) => {
//                                 if (e.key === 'Enter' && !e.shiftKey) {
//                                     e.preventDefault();
//                                     handleSubmit(e);
//                                 }
//                             }}
//                         />
//                         <motion.button
//                             whileTap={{ scale: 0.95 }}
//                             type="submit"
//                             className={` cursor-pointer p-3 rounded-full m-1 ${isLoading 
//                                 ? `${darkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-not-allowed`
//                                 : `${darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} shadow-md`
//                             } text-white transition-all`}
//                             disabled={isLoading || !input.trim()}
//                         >
//                             <FiSend className="h-5 w-5" />
//                         </motion.button>
//                     </form>
//                     <div className={`flex items-center justify-between mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//                         <div className="flex items-center">
//                             <FiZap className="mr-1.5" />
//                             <span>Powered by OOUM AI</span>
//                         </div>
//                         <div>
//                             {isLoading ? 'Processing...' : 'Press Enter to send, Shift+Enter for new line'}
//                         </div>
//                     </div>
//                 </div>
//             </motion.footer>
//         </div>
//     );
// }

"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiBook, FiMessageSquare, FiInfo, FiSun, FiMoon, FiZap, FiExternalLink } from 'react-icons/fi';

// Memoized User Message Component
const UserMessage = memo(({ content = '', darkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex justify-end"
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

  const formatSnippet = (snippet) => {
    if (!snippet) return 'No content available';
    return snippet
      .replace(/<b>/g, '')
      .replace(/<\/b>/g, '')
      .replace(/\.\.\./g, '…')
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
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
                      {metadata.url && (
                        <a 
                          href={metadata.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-xs p-1 rounded hover:bg-gray-700/10"
                        >
                          <FiExternalLink className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                        </a>
                      )}
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

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { 
      id: 'welcome-message',
      role: 'assistant', 
      content: 'Hello! I am OOUM AI, a specialized assistant for Indian legal matters and general queries.',
      isLegal: false,
      source: 'ooum'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDarkModeTooltip, setShowDarkModeTooltip] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isAboutOOUM = useCallback((text) => {
    const ooumKeywords = [
      'who are you', 'what are you', 'your name', 
      'which ai', 'what technology', 'what model',
      'what system', 'ooum', 'who made you'
    ];
    return ooumKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }, []);

  // Memoized message list
  const messageList = useMemo(() => messages, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

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
      const response = await axios.post('/api/search', { 
        query: input,
      });

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.error 
          ? `Error: ${response.data.error}`
          : response.data.response || 'No response content',
        isLegal: response.data.isLegal || false,
        source: response.data.source || 'unknown',
        ...(response.data.isLegal && {
          metadata: response.data.metadata || {},
          filters: response.data.filters || [],
          relatedDocs: response.data.relatedDocs || []
        })
      }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: error.response?.data?.error || 
                'Service unavailable. Please try again later.',
        isLegal: false,
        source: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleQuestionSelect = useCallback((question) => {
    setInput(question);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' : 'bg-white/80 backdrop-blur-md border-gray-200'} border-b`}
      >
        <div className="max-w-[98%] mx-auto px-6 py-3 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3"
          >
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-900/60' : 'bg-indigo-100'} shadow-sm`}>
              <FiBook className={`text-xl ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Indian Legal Research Assistant
              </h1>
              <p className={`text-xs tracking-wider ${darkMode ? 'text-gray-400' : 'text-indigo-600/80'}`}>
                POWERED BY OOUM AI
              </p>
            </div>
          </motion.div>

          <div 
            className="relative"
            onMouseEnter={() => setShowDarkModeTooltip(true)}
            onMouseLeave={() => setShowDarkModeTooltip(false)}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`cursor-pointer p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-amber-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'} transition-colors`}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </motion.button>
            
            <AnimatePresence>
              {showDarkModeTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`absolute right-0 top-full mt-2 px-3 py-1 rounded-md text-xs w-[140px] text-center ${darkMode ? 'bg-gray-700 text-amber-300' : 'bg-indigo-100 text-indigo-600'}`}
                >
                  {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
        {messageList.map((msg) => (
          <div key={msg.id} className="mb-6">
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
              className="flex justify-start mb-6"
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className={`flex items-end rounded-2xl p-1 ${darkMode ? 'bg-gray-700/50 focus-within:ring-2 focus-within:ring-indigo-500/30' : 'bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-300'} transition-all duration-300`}>
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
              className={`cursor-pointer p-3 rounded-full m-1 ${isLoading 
                ? `${darkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-not-allowed`
                : `${darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} shadow-md`
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
    </div>
  );
}