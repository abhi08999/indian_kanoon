// app/components/Draft/Draft.js
'use client';

import { useRef, useEffect, useState } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiDownload, FiLoader, FiEdit2 } from 'react-icons/fi';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DraftInput from './DraftInput';

export default function Draft() {
  const { darkMode } = useDarkMode();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (draft || userQuery) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [draft, userQuery]);

// In your Draft.js component
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setIsLoading(true);
    setUserQuery(input);
    setInput('');
    setDraft(null);
  
    // Add timeout
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      alert('The request is taking longer than usual. Please try again.');
    }, 9000); // 9 seconds for free tier
  
    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to generate draft');
      const data = await response.json();
      setDraft(data.draft);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDraft = () => {
    if (!draft) return;
    
    // Get the visible content including formatting
    const draftContainer = document.createElement('div');
    draftContainer.style.fontFamily = '"Calibri", sans-serif';
    draftContainer.style.lineHeight = '1.5';
    
    // Add the title
    const title = document.createElement('h1');
    title.textContent = 'DRAFT';
    title.style.fontSize = '1.75rem';
    title.style.fontWeight = 'bold';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '1px';
    title.style.marginBottom = '0.5rem';
    title.style.textAlign = 'center';
    draftContainer.appendChild(title);
    
    // Add the underline
    const underline = document.createElement('div');
    underline.style.width = '5rem';
    underline.style.height = '2px';
    underline.style.backgroundColor = '#4f46e5';
    underline.style.margin = '0 auto 2.5rem';
    draftContainer.appendChild(underline);
    
    // Add the content (convert markdown to plain text with basic formatting)
    const content = document.createElement('div');
    content.innerHTML = draft
      .replace(/^### (.*$)/gm, '\n$1\n') // h3
      .replace(/^## (.*$)/gm, '\n$1\n')  // h2
      .replace(/^# (.*$)/gm, '\n$1\n')   // h1
      .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
      .replace(/\*(.*?)\*/g, '$1')       // italic
      .replace(/`(.*?)`/g, '$1');        // code
    draftContainer.appendChild(content);
    
    // Add signature block
    const signature = document.createElement('div');
    signature.style.marginTop = '3rem';
    signature.style.textAlign = 'right';
    signature.innerHTML = `
      <p style="margin-bottom: 2rem; font-size: 1.0625rem">Sincerely,</p>
      <div style="height: 1px; width: 100%; background-color: #d1d5db; margin-bottom: 0.5rem"></div>
      <p style="font-weight: 600; font-size: 1.0625rem">[Your Name]</p>
      <p style="font-size: 1rem; color: #6b7280">[Your Designation]</p>
    `;
    draftContainer.appendChild(signature);
    
    // Create and trigger download
    const element = document.createElement('a');
    const file = new Blob([draftContainer.innerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `legal-draft-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: darkMode ? '#111827' : '#f9fafb',
      fontFamily: '"Calibri", "Candara", "Segoe", "Segoe UI", sans-serif'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        paddingTop: '7rem' // Adjusted for header height
      }}>
        <div style={{
          maxWidth: '48rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {userQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{
                position: 'relative',
                maxWidth: '90%',
                borderRadius: '0.75rem',
                backgroundColor: darkMode ? '#4f46e5' : '#4f46e5',
                borderTopRightRadius: 0,
                padding: '1.25rem 1.5rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#ffffff'
                }}>
                  {userQuery}
                </p>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              }}
            >
              <FiLoader style={{
                animation: 'spin 1s linear infinite',
                marginRight: '0.75rem',
                fontSize: '1.125rem'
              }} />
              <span style={{
                fontSize: '0.875rem',
                color: darkMode ? '#9ca3af' : '#4b5563'
              }}>
                Generating draft...
              </span>
            </motion.div>
          )}

          {draft && (
            <LegalDraftDocument 
              content={draft}
              darkMode={darkMode}
              onDownload={downloadDraft}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <DraftInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        darkMode={darkMode}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

function LegalDraftDocument({ content, darkMode, onDownload }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to filter out non-DOM props
  const filterProps = (props) => {
    const { node, ordered, depth, ...rest } = props;
    return rest;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: 'flex-start'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2.5rem'
      }}>
        {/* Action buttons */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <CopyToClipboard text={content} onCopy={handleCopy}>
            <button style={{
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} title="Copy to clipboard">
              <FiCopy style={{
                height: '1rem',
                width: '1rem',
                color: darkMode ? '#d1d5db' : '#4b5563'
              }} />
            </button>
          </CopyToClipboard>

          <button
            onClick={onDownload}
            style={{
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Download draft"
          >
            <FiDownload style={{
              height: '1rem',
              width: '1rem',
              color: darkMode ? '#d1d5db' : '#4b5563'
            }} />
          </button>
        </div>

        {/* Draft Content */}
        <div style={{
          fontFamily: '"Calibri", sans-serif',
          color: darkMode ? '#f3f4f6' : '#111827',
          lineHeight: '1.5'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.5rem'
            }}>DRAFT</h1>
            <div style={{
              width: '5rem',
              height: '2px',
              backgroundColor: '#4f46e5',
              margin: '0 auto'
            }}></div>
          </div>
          
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => (
                <p style={{
                  marginBottom: '1rem',
                  textAlign: 'justify',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              strong: ({node, ...props}) => (
                <strong style={{
                  fontWeight: '600',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              em: ({node, ...props}) => (
                <em style={{
                  fontStyle: 'italic',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              h1: ({node, ...props}) => (
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '1.5rem 0 1rem',
                  textTransform: 'uppercase'
                }} {...filterProps(props)} />
              ),
              h2: ({node, ...props}) => (
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: '1.25rem 0 0.75rem',
                  borderBottom: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
                  paddingBottom: '0.25rem'
                }} {...filterProps(props)} />
              ),
              h3: ({node, ...props}) => (
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  margin: '1rem 0 0.5rem'
                }} {...filterProps(props)} />
              ),
              ul: ({node, depth, ordered, ...props}) => (
                <ul style={{
                  listStyleType: 'disc',
                  paddingLeft: '1.5rem',
                  margin: '0.75rem 0 1.25rem',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              ol: ({node, depth, ordered, ...props}) => (
                <ol style={{
                  listStyleType: 'decimal',
                  paddingLeft: '1.5rem',
                  margin: '0.75rem 0 1.25rem',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              li: ({node, ordered, ...props}) => (
                <li style={{
                  marginBottom: '0.25rem',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote style={{
                  borderLeft: `3px solid ${darkMode ? '#818cf8' : '#4f46e5'}`,
                  paddingLeft: '1rem',
                  margin: '1rem 0',
                  fontStyle: 'italic',
                  backgroundColor: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(79, 70, 229, 0.1)',
                  padding: '0.5rem 1rem',
                  fontSize: '1.0625rem'
                }} {...filterProps(props)} />
              ),
            }}
          >
            {content}
          </Markdown>

          {/* Signature Block */}
          <div style={{
            marginTop: '3rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              textAlign: 'right',
              width: '50%'
            }}>
              <p style={{ 
                marginBottom: '2rem',
                fontSize: '1.0625rem'
              }}>Sincerely,</p>
              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: darkMode ? '#4b5563' : '#d1d5db',
                marginBottom: '0.5rem'
              }}></div>
              <p style={{ 
                fontWeight: '600',
                fontSize: '1.0625rem'
              }}>[Your Name]</p>
              <p style={{ 
                fontSize: '1rem',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>[Your Designation]</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}