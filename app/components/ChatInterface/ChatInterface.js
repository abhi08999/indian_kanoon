'use client';

import { useCallback, useRef,useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useChat } from '@/hooks/useChat';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function ChatInterface() {
  const { darkMode } = useDarkMode();
  const { messages, isLoading, handleSubmit, input, setInput } = useChat();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

    // Add this useEffect to scroll to bottom when messages or loading state changes
    useEffect(() => {
      scrollToBottom();
    }, [messages, isLoading]);
  
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Add this to your ChatInterface component
useEffect(() => {
  return () => {
    // Cleanup any modal-related styles when component unmounts
    document.documentElement.style.overflow = '';
  };
}, []);

  const getLoadingMessage = useCallback((inputText) => {
    if (!inputText) return "Processing your request...";
    return "Generating response...";
  }, []);

  return (
    <>
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading} 
        darkMode={darkMode} 
        loadingMessage={getLoadingMessage(input)}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        darkMode={darkMode}
        handleSubmit={handleSubmit}
        textareaRef={textareaRef}
      />
    </>
  );
}