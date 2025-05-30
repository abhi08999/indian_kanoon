// hooks/useTranslation.js

import { useState, useCallback } from "react";
import axios from "axios";

export function useTranslation() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [translationStatus, setTranslationStatus] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Google Cloud Translate supported languages
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" },
    { code: "kn", name: "Kannada" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
  ];

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim() && !uploadedFile) return;

    setIsTranslating(true);
    setTranslationStatus("processing");
    setDownloadUrl(null);
    
    try {
      const formData = new FormData();
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      } else {
        // Create a text file if no file uploaded
        const blob = new Blob([sourceText], { type: "text/plain" });
        formData.append("file", blob, "text.txt");
      }
      
      formData.append("sourceLanguage", sourceLanguage);
      formData.append("targetLanguage", targetLanguage);

      const response = await axios.post("/api/translate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.downloadUrl) {
        setDownloadUrl(response.data.downloadUrl);
        setTranslationStatus("completed");
      } else if (response.data.translatedText) {
        setTranslatedText(response.data.translatedText);
        setTranslationStatus("completed");
      } else {
        throw new Error("Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedText(
        error.response?.data?.error ||
          error.message ||
          "Translation service unavailable"
      );
      setTranslationStatus("failed");
    } finally {
      setIsTranslating(false);
    }
  }, [sourceText, uploadedFile, sourceLanguage, targetLanguage]);

  const handleFileUpload = useCallback((file) => {
    setUploadedFile(file);
    
    // For text files, preview the content
    if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      setSourceText(`[File: ${file.name}] - Document will be translated directly`);
    }
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setSourceText("");
  }, []);

  const swapLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLanguage, targetLanguage, sourceText, translatedText]);

  return {
    sourceText,
    setSourceText,
    translatedText,
    isTranslating,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    uploadedFile,
    languages,
    translationStatus,
    downloadUrl,
    handleTranslate,
    handleFileUpload,
    removeFile,
    swapLanguages,
  };
}