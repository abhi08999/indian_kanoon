// app/components/Draft/DraftInput.js
'use client';

import { motion } from 'framer-motion';
import { FiEdit2, FiZap } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

export default function DraftInput({ input, setInput, isLoading, darkMode, handleSubmit }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <motion.footer 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div style={{
        maxWidth: '56rem',
        margin: '0 auto',
        padding: '1.5rem'
      }}>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          alignItems: 'flex-end',
          borderRadius: '1rem',
          padding: '0.25rem',
          backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6',
          boxShadow: darkMode ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'Generating draft...' : 'Describe the legal document you need...'}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0.75rem 1rem',
              outline: 'none',
              resize: 'none',
              minHeight: '60px',
              maxHeight: '150px',
              color: darkMode ? '#f3f4f6' : '#111827',
              fontFamily: '"Calibri", sans-serif'
            }}
            disabled={isLoading}
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
            style={{
              padding: '0.75rem',
              borderRadius: '50%',
              margin: '0.25rem',
              color: '#ffffff',
              background: isLoading 
                ? (darkMode ? '#4b5563' : '#d1d5db') 
                : 'linear-gradient(to bottom right, #4f46e5, #7c3aed)',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            disabled={isLoading || !input.trim()}
          >
            <FiEdit2 style={{
              height: '1.25rem',
              width: '1.25rem'
            }} />
          </motion.button>
        </form>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          color: darkMode ? '#6b7280' : '#9ca3af'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <FiZap style={{
              marginRight: '0.375rem'
            }} />
            <span>Powered by OOUM AI</span>
          </div>
          <div>
            {isLoading ? 'Generating...' : 'Press Enter to submit'}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}