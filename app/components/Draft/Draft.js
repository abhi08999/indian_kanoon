// app/components/Draft/Draft.js
'use client';

import { useRef, useEffect, useState } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    setIsLoading(true);
    setUserQuery(input);
    setInput('');
    setDraft(null);
  
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      alert('The request is taking longer than usual. Please try again.');
    }, 9000);
  
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
    
    const draftContainer = document.createElement('div');
    draftContainer.style.fontFamily = '"Calibri", sans-serif';
    draftContainer.style.lineHeight = '1.5';
    
    const title = document.createElement('h1');
    title.textContent = 'DRAFT';
    title.style.fontSize = '1.75rem';
    title.style.fontWeight = 'bold';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '1px';
    title.style.marginBottom = '0.5rem';
    title.style.textAlign = 'center';
    draftContainer.appendChild(title);
    
    const underline = document.createElement('div');
    underline.style.width = '5rem';
    underline.style.height = '2px';
    underline.style.backgroundColor = '#4f46e5';
    underline.style.margin = '0 auto 2.5rem';
    draftContainer.appendChild(underline);
    
    const content = document.createElement('div');
    content.innerHTML = draft
      .replace(/^### (.*$)/gm, '\n$1\n')
      .replace(/^## (.*$)/gm, '\n$1\n')
      .replace(/^# (.*$)/gm, '\n$1\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1');
    draftContainer.appendChild(content);
    
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
    
    const element = document.createElement('a');
    const file = new Blob([draftContainer.innerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `legal-draft-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`flex flex-col h-full w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-6 pb-24">
          {userQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-end"
            >
              <div className={`rounded-lg ${darkMode ? 'bg-indigo-600' : 'bg-indigo-600'} p-5 max-w-[90%]`}>
                <p className="text-sm text-white">
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
              className={`flex items-center justify-center p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}
            >
              <FiLoader className="animate-spin mr-3 text-lg" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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

      <div className="sticky bottom-0 w-full">
        <DraftInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          darkMode={darkMode}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

function LegalDraftDocument({ content, darkMode, onDownload }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filterProps = (props) => {
    const { node, ordered, depth, ...rest } = props;
    return rest;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className={`relative w-full p-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}>
        <div className="absolute top-4 right-4 flex gap-2">
          <CopyToClipboard text={content} onCopy={handleCopy}>
            <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`} title="Copy to clipboard">
              <FiCopy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </CopyToClipboard>

          <button
            onClick={onDownload}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            title="Download draft"
          >
            <FiDownload className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} leading-relaxed`}>
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">DRAFT</h1>
            <div className="w-20 h-0.5 bg-indigo-500 mx-auto"></div>
          </div>
          
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => (
                <p className="mb-4 text-justify text-[1.0625rem]" {...filterProps(props)} />
              ),
              strong: ({node, ...props}) => (
                <strong className="font-semibold text-[1.0625rem]" {...filterProps(props)} />
              ),
              em: ({node, ...props}) => (
                <em className="italic text-[1.0625rem]" {...filterProps(props)} />
              ),
              h1: ({node, ...props}) => (
                <h1 className="text-xl font-semibold my-6 uppercase" {...filterProps(props)} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-lg font-semibold my-5 border-b pb-1" {...filterProps(props)} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-base font-semibold my-4" {...filterProps(props)} />
              ),
              ul: ({node, depth, ordered, ...props}) => (
                <ul className="list-disc pl-6 my-3 text-[1.0625rem]" {...filterProps(props)} />
              ),
              ol: ({node, depth, ordered, ...props}) => (
                <ol className="list-decimal pl-6 my-3 text-[1.0625rem]" {...filterProps(props)} />
              ),
              li: ({node, ordered, ...props}) => (
                <li className="mb-1 text-[1.0625rem]" {...filterProps(props)} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote className={`border-l-4 ${darkMode ? 'border-indigo-400 bg-gray-700' : 'border-indigo-500 bg-indigo-50'} pl-4 my-4 italic py-2 text-[1.0625rem]`} {...filterProps(props)} />
              ),
            }}
          >
            {content}
          </Markdown>

          <div className="mt-12 flex justify-end">
            <div className="text-right w-1/2">
              <p className="mb-8 text-[1.0625rem]">Sincerely,</p>
              <div className={`h-px w-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} mb-2`}></div>
              <p className="font-semibold text-[1.0625rem]">[Your Name]</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>[Your Designation]</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}