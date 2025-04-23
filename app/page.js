// 'use client';

// import { useState } from 'react';
// import { useDarkMode } from '../hooks/useDarkMode';
// import Header from './components/common/Header';
// import ChatInterface from './components/ChatInterface/ChatInterface';
// import JudgmentSearch from './components/JudgmentSearch/JudgmentSearch';

// export default function Home() {
//   const { darkMode } = useDarkMode();
//   const [activeTab, setActiveTab] = useState('chat');

//   return (
//     <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
//       <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
//       <main className="pt-28 pb-40 px-6 w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
//         {activeTab === 'chat' ? (
//           <ChatInterface />
//         ) : (
//           <JudgmentSearch />
//         )}
//       </main>
//     </div>
//   );
// }
// app/page.js

// app/page.js
'use client';

import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import Header from './components/common/Header';
import ChatInterface from './components/ChatInterface/ChatInterface';
import JudgmentSearch from './components/JudgmentSearch/JudgmentSearch';
import DocumentReview from './components/DocumentReview/DocumentReview';

export default function Home() {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pt-28 pb-40 px-6 w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'chat' ? (
          <ChatInterface />
        ) : activeTab === 'judgment' ? (
          <JudgmentSearch />
        ) : (
          <DocumentReview />
        )}
      </main>
    </div>
  );
}