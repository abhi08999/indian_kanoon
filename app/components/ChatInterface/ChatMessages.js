// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import UserMessage from './UserMessage';
// import AssistantMessage from './AssistantMessage';

// export default function ChatMessages({ messages, isLoading, darkMode, loadingMessage, messagesEndRef }) {
//   return (
//     <>
//       {messages.map((msg) => (
//         <div key={msg.id} className="mb-6 relative z-0 max-w-7xl mx-auto">
//           {msg.role === 'user' ? (
//             <UserMessage 
//               content={msg.content} 
//               darkMode={darkMode}
//             />
//           ) : (
//             <AssistantMessage 
//               content={msg.content} 
//               isLegal={msg.isLegal} 
//               metadata={msg.metadata}
//               webSources={msg.webSources || []}  // Ensure this line exists
//               darkMode={darkMode}
//             />
//           )}
//         </div>
//       ))}
      
//       {isLoading && (
//         <AnimatePresence>
//           <motion.div
//             key={`loading-${Date.now()}`}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="flex justify-start mb-6 relative z-0"
//           >
//             <div className={`max-w-3xl rounded-3xl rounded-bl-none px-6 py-4 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm`}>
//               <div className="flex items-center space-x-3">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={`dot-${Date.now()}-${i}`}
//                     className="w-2.5 h-2.5 rounded-full bg-indigo-400"
//                     animate={{ y: [0, -5, 0] }}
//                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
//                   />
//                 ))}
//                 <span className="text-sm">
//                   {loadingMessage}
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       )}
//       <div ref={messagesEndRef} className="relative z-0" />
//     </>
//   );
// }

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';

export default function ChatMessages({ messages, isLoading, darkMode, loadingMessage, messagesEndRef }) {
  return (
    <div className="chat-container"> {/* New container with relative positioning */}
      {/* Add a key to the entire messages list */}
      <div key="messages-list" className="space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="relative z-0 max-w-7xl mx-auto"
            style={{
              // Prevent creating new stacking contexts
              transform: 'none',
              opacity: 1
            }}
          >
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
                webSources={msg.webSources || []}
                darkMode={darkMode}
              />
            )}
          </div>
        ))}
      </div>
      
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
                  {loadingMessage}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div ref={messagesEndRef} className="relative z-0" />
    </div>
  );
}