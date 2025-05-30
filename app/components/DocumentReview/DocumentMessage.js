// // app/components/DocumentReview/DocumentMessage.js

// 'use client';

// import { motion } from 'framer-motion';
// import { FiCopy, FiLoader } from 'react-icons/fi';
// import Markdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { useState } from 'react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';

// export default function DocumentMessage({ message, darkMode, isLoading }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
//     >
//       <div
//         className={`relative max-w-[85%] rounded-xl ${message.role === 'user' 
//           ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} rounded-br-none`
//           : `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-bl-none shadow-sm`
//         } px-4 py-3 ${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`}
//       >
//         {message.role === 'assistant' && !isLoading && (
//           <CopyToClipboard text={message.content} onCopy={handleCopy}>
//             <button
//               className={`cursor-pointer absolute -top-3 -right-3 p-2 rounded-full ${darkMode 
//                 ? 'bg-gray-700 hover:bg-gray-600' 
//                 : 'bg-gray-200 hover:bg-gray-300'
//               } transition-all`}
//               title="Copy to clipboard"
//             >
//               <FiCopy className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
//             </button>
//           </CopyToClipboard>
//         )}

//         {copied && (
//           <motion.div
//             initial={{ opacity: 0, y: -5 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -5 }}
//             className={`absolute -top-8 right-0 px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
//           >
//             Copied!
//           </motion.div>
//         )}

//         {message.role === 'user' ? (
//           <p className={`text-sm ${darkMode ? 'text-white' : 'text-white'}`}>
//             {message.content}
//           </p>
//         ) : isLoading ? (
//           <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//             <FiLoader className="animate-spin mr-2" />
//             Analyzing document...
//           </div>
//         ) : (
//           <Markdown
//             remarkPlugins={[remarkGfm]}
//             className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
//           >
//             {message.content}
//           </Markdown>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// app/components/DocumentReview/DocumentMessage.js

'use client';

import { motion } from 'framer-motion';
import { FiCopy, FiLoader } from 'react-icons/fi';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function DocumentMessage({ message, darkMode, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Markdown component styling configuration
  const markdownComponents = {
    p: ({ node, ...props }) => (
      <p className={`mb-4 last:mb-0 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    h1: ({ node, ...props }) => (
      <h1 className={`text-2xl font-bold mt-6 mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className={`text-xl font-bold mt-5 mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className={`text-lg font-bold mt-4 mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    a: ({ node, ...props }) => (
      <a 
        className={`underline ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        {...props} 
      />
    ),
    ul: ({ node, ...props }) => (
      <ul className={`list-disc pl-5 mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className={`list-decimal pl-5 mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="mb-1" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote 
        className={`border-l-4 pl-4 italic mb-4 ${darkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'}`} 
        {...props} 
      />
    ),
    code: ({ node, ...props }) => (
      <code 
        className={`px-1 py-0.5 rounded ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`} 
        {...props} 
      />
    ),
    pre: ({ node, ...props }) => (
      <pre 
        className={`p-3 rounded mb-4 overflow-x-auto ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`} 
        {...props} 
      />
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`relative max-w-[85%] rounded-xl ${message.role === 'user' 
          ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} rounded-br-none`
          : `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-bl-none shadow-sm`
        } px-4 py-3 ${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`}
      >
        {message.role === 'assistant' && !isLoading && (
          <CopyToClipboard text={message.content} onCopy={handleCopy}>
            <button
              className={`cursor-pointer absolute -top-3 -right-3 p-2 rounded-full ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
              } transition-all`}
              title="Copy to clipboard"
            >
              <FiCopy className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
          </CopyToClipboard>
        )}

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`absolute -top-8 right-0 px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
          >
            Copied!
          </motion.div>
        )}

        {message.role === 'user' ? (
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-white'}`}>
            {message.content}
          </p>
        ) : isLoading ? (
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FiLoader className="animate-spin mr-2" />
            Analyzing document...
          </div>
        ) : (
          <div className="prose dark:prose-invert prose-sm max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.content}
            </Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}