import { useState, useCallback } from "react";
import axios from "axios";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm OOUM AI, your Indian legal assistant. How can I help you today?",
      isLegal: false,
      source: "ooum",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

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
        const response = await axios.post("/api/search", { query: input });
        
        const assistantMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.data?.response || "Sorry, I couldn't process that.",
          isLegal: response.data?.isLegal || false,
          source: response.data?.source || "error",
          metadata: response.data?.metadata || null,
          webSources: response.data?.webSources || [],
          allDocs: response.data?.allDocs || []
        };

        // Format legal responses better
        if (response.data?.isLegal) {
          assistantMessage.content = formatLegalResponse(
            assistantMessage.content,
            response.data.metadata,
            response.data.webSources
          );
        }

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
    [input, isLoading]
  );

  // Format legal responses with citations and links
  const formatLegalResponse = (content, metadata, webSources) => {
    let formatted = content;
    
    // Add metadata citation if available
    if (metadata) {
      formatted += `\n\n[Source: ${metadata.title}`;
      if (metadata.citation) formatted += ` (${metadata.citation})`;
      formatted += `](${metadata.url})`;
    }

    // Add web sources if available
    if (webSources?.length) {
      formatted += "\n\nAdditional Resources:";
      webSources.forEach((source, index) => {
        formatted += `\n${index + 1}. [${source.title}](${source.url})`;
      });
    }

    return formatted;
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
  };
}