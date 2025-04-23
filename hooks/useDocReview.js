// hooks/useDocReview.js
'use client';

import { useState, useCallback } from "react";
import axios from "axios";

export function useDocReview() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Upload a legal document (PDF, DOC, TXT) and I'll help you analyze it. You can ask questions about its content.",
      isLegal: false,
      source: "ooum",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000
      });

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        id: response.data.fileId,
      });

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: `Document "${file.name}" uploaded successfully. You can now ask questions about it.`,
        isLegal: false,
        source: "system",
      }]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Failed to upload document. Please try again.",
        isLegal: false,
        source: "error",
      }]);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading || !uploadedFile) return;

      setIsLoading(true);
      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: input,
        isLegal: null,
        source: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const response = await axios.post("/api/doc-query", { 
          query: input,
          fileId: uploadedFile.id
        });
        
        const assistantMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.data?.response || "Sorry, I couldn't process that.",
          isLegal: true,
          source: "document",
          citations: response.data?.citations || [],
          summary: response.data?.summary || null
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("API Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: error.response?.data?.response || 
                    error.message || 
                    "Sorry, I couldn't process that. Please try again.",
            isLegal: false,
            source: "error",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, uploadedFile]
  );

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "assistant",
      content: "Document removed. You can upload a new one.",
      isLegal: false,
      source: "system",
    }]);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isUploading,
    uploadedFile,
    handleSubmit,
    handleFileUpload,
    removeFile,
  };
}