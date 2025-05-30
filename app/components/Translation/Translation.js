'use client';

import { useState, useRef, useEffect } from 'react';

export default function TranslationForm() {
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bn', name: 'Bengali' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ko', name: 'Korean' },
    { code: 'tr', name: 'Turkish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'da', name: 'Danish' },
    { code: 'he', name: 'Hebrew' },
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === targetLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsTranslating(true);
    setError(null);
    setSuccess(null);
    setProgress(0);

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguage', targetLanguage);

      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translated_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      setSuccess('Document translated and downloaded successfully!');
      setTimeout(() => setSuccess(null), 5000);

    } catch (err) {
      setError(err.message || 'An unknown error occurred');
      setProgress(0);
    } finally {
      setIsTranslating(false);
      setFile(null);
    }
  };

  return (
   <div className="">
      <div className="max-w-4xl mx-auto">
    
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-3">
            <h2 className="text-xl font-semibold text-white">Upload & Translate</h2>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Document to Translate
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                    file ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 bg-white'
                  }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <svg className={`w-12 h-12 mb-4 ${file ? 'text-indigo-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className={`mb-2 text-sm ${file ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported: PDF, DOCX, TXT (Max 10MB)
                      </p>
                      {file && (
                        <p className="mt-2 text-xs text-indigo-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB ready for translation
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.txt,.doc"
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                        setSuccess(null);
                        setError(null);
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-3" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700">
                  Translate To
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <span className="flex items-center">
                      <span className="ml-3 block truncate">{selectedLanguage?.name}</span>
                    </span>
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 bottom-full mb-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {languages.map((language) => (
                        <div
                          key={language.code}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                            targetLanguage === language.code ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`}
                          onClick={() => {
                            setTargetLanguage(language.code);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <span className={`ml-3 block truncate ${
                              targetLanguage === language.code ? 'font-semibold' : 'font-normal'
                            }`}>
                              {language.name}
                            </span>
                          </div>
                          {targetLanguage === language.code && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {isTranslating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Translating document...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isTranslating || !file}
                  className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                    isTranslating || !file 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
                  }`}
                >
                  {isTranslating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Translating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center cursor-pointer">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                      </svg>
                      Translate Now
                    </span>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start animate-fade-in">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 className="font-medium">Translation Error</h4>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-start animate-fade-in">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 className="font-medium">Success!</h4>
                    <p className="text-sm">{success}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}