// // 'use client';

// // import { useState } from 'react';
// // import { useDarkMode } from '../hooks/useDarkMode';
// // import Header from './components/common/Header';
// // import ChatInterface from './components/ChatInterface/ChatInterface';
// // import JudgmentSearch from './components/JudgmentSearch/JudgmentSearch';

// // export default function Home() {
// //   const { darkMode } = useDarkMode();
// //   const [activeTab, setActiveTab] = useState('chat');

// //   return (
// //     <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
// //       <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
// //       <main className="pt-28 pb-40 px-6 w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
// //         {activeTab === 'chat' ? (
// //           <ChatInterface />
// //         ) : (
// //           <JudgmentSearch />
// //         )}
// //       </main>
// //     </div>
// //   );
// // }
// // app/page.js

// // app/page.js
// 'use client';

// import { useState } from 'react';
// import { useDarkMode } from '../hooks/useDarkMode';
// import Header from './components/common/Header';
// import ChatInterface from './components/ChatInterface/ChatInterface';
// import JudgmentSearch from './components/JudgmentSearch/JudgmentSearch';
// import DocumentReview from './components/DocumentReview/DocumentReview';

// export default function Home() {
//   const { darkMode } = useDarkMode();
//   const [activeTab, setActiveTab] = useState('chat');

//   return (
//     <div className={`relative min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
//       <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
//       <main className="pt-28 pb-40 px-6 w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
//         {activeTab === 'chat' ? (
//           <ChatInterface />
//         ) : activeTab === 'judgment' ? (
//           <JudgmentSearch />
//         ) : (
//           <DocumentReview />
//         )}
//       </main>
//     </div>
//   );
// }

// app/page.js
'use client';

import { useState } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ChatInterface from './components/ChatInterface/ChatInterface';
import JudgmentSearch from './components/JudgmentSearch/JudgmentSearch';
import DocumentReview from './components/DocumentReview/DocumentReview';
import Draft from './components/Draft/Draft';
import Translation from './components/Translation/Translation';
import Typing from './components/Typing/Typing'; // Add this import

export default function Home() {
  const { darkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'} font-sans`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header sidebarOpen={sidebarOpen} />
      
      <main 
        className={`pt-28 pb-6 px-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        <div className="max-w-6xl mx-auto">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'judgment' && <JudgmentSearch />}
          {activeTab === 'docReview' && <DocumentReview />}
          {activeTab === 'draft' && <Draft />}
          {activeTab === 'translation' && <Translation />}
          {activeTab === 'typing' && <Typing />} {/* Add this line */}
        </div>
      </main>
    </div>
  );
}