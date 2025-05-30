// components/ChatInterface/ChatInterface.js
'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useChat } from '../../../hooks/useChat';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatInterface() {
  const { darkMode } = useDarkMode();
  const { messages, isLoading, handleSubmit, input, setInput } = useChat();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  const getLoadingMessage = useCallback((inputText) => {
    if (!inputText) return "Processing your request...";
    return "Generating response...";
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto pb-48">
        <ChatMessages 
          messages={messages} 
          isLoading={isLoading} 
          darkMode={darkMode} 
          loadingMessage={getLoadingMessage(input)}
          messagesEndRef={messagesEndRef}
        />
      </div>
      
      <div className="sticky bottom-0 w-full z-999">
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          darkMode={darkMode}
          handleSubmit={handleSubmit}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}