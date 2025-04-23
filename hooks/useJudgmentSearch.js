'use client';

import { useState, useCallback ,useRef} from 'react';
import axios from 'axios';

export function useJudgmentSearch() {
  const [summaryModal, setSummaryModal] = useState({
    open: false,
    content: '',
    title: '',
    metadata: null,
    keyPoints: []
  });
  const [judgmentSearchQuery, setJudgmentSearchQuery] = useState('');
  const [judgmentResults, setJudgmentResults] = useState(null);
  const [selectedJudgment, setSelectedJudgment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);

  const scrollToSearchInput = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInputRef.current.focus();
    }
  }, []);
  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      searchResultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleJudgmentSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!judgmentSearchQuery.trim()) return;
    
    setIsAnalyzing(true);
    setJudgmentResults(null);
    setSelectedJudgment(null);
    setViewMode('list');
    
    try {
      const response = await axios.post('/api/judgment-search', {
        query: judgmentSearchQuery
      });
      
      setJudgmentResults(response.data);
      scrollToResults(); // Scroll after setting results
    } catch (error) {
      console.error('Judgment search error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [judgmentSearchQuery,scrollToResults]);

  const fetchJudgmentDetails = useCallback(async (docId, type = 'details') => {
    try {
      if (type === 'details') {
        setIsAnalyzing(true);
        const response = await axios.post('/api/judgment-details', { docId });
        setSelectedJudgment(response.data);
        setViewMode('detail');
      } else {
        // Set loading state for summary modal immediately
        setSummaryModal({
          open: true,
          isLoading: true,
          content: '',
          type: 'relevance',
          title: 'Loading...',
          metadata: null,
          keyPoints: []
        });

        // Fetch judgment details first
        const detailsResponse = await axios.post('/api/judgment-details', { docId });
        
        // Update modal with basic info while we generate summary
        setSummaryModal(prev => ({
          ...prev,
          title: detailsResponse.data.title,
          metadata: {
            date: detailsResponse.data.publishdate,
            court: detailsResponse.data.docsource,
            citation: detailsResponse.data.citation
          }
        }));

        // Generate summary
        const summaryResponse = await axios.post('/api/generate-summary', {
          title: detailsResponse.data.title,
          content: detailsResponse.data.doc.substring(0, 3000)
        });

        // Update with final content
        setSummaryModal(prev => ({
          ...prev,
          isLoading: false,
          content: summaryResponse.data.summary,
          keyPoints: summaryResponse.data.keyPoints || []
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setSummaryModal(prev => ({
        ...prev,
        isLoading: false,
        content: 'Failed to load content. Please try again later.',
        type: 'error'
      }));
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    judgmentSearchQuery,
    setJudgmentSearchQuery,
    judgmentResults,
    setJudgmentResults,
    isAnalyzing,
    selectedJudgment,
    viewMode,
    setViewMode,
    handleJudgmentSearch,
    fetchJudgmentDetails,
    scrollToSearchInput,
    searchInputRef,
    searchResultsRef,
    isGeneratingSummary,
    summaryContent,
    setSelectedJudgment,  
    summaryModal,
    setSummaryModal,
  };
}