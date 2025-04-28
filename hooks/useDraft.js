// app/hooks/useDraft.js
import { useState } from 'react';

export function useDraft() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState(null);

  const generateDraft = async (prompt) => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setDraft(null);

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate draft');

      const data = await response.json();
      setDraft(data.draft);
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    isLoading,
    draft,
    generateDraft,
  };
}