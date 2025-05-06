// App.jsx - Using DebugPanel to identify issues
import React, { useState, useRef, useEffect } from 'react';
import DocumentViewer from './components/DocumentViewer.jsx';
import FileUpload from './components/FileUpload.jsx';
import Navbar from './components/NavBar.jsx';
import ResultsPanel from './components/ResultsPanel.jsx';
import DebugPanel from './components/DebugPanel.jsx';  // Import Debug Panel
import apiService from './services/apiService.js';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);  // Default to true for smoother UX
  const fileInputRef = useRef(null);
  
  // Check API health on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Checking API availability...");
        const isAvailable = await apiService.checkApiHealth();
        console.log(`API is ${isAvailable ? 'available' : 'not available'}`);
        setApiAvailable(isAvailable);
        
        if (!isAvailable) {
          console.warn('API is not available. Analysis functionality will be limited.');
          // Show a user-friendly notification
          alert('Warning: The analysis backend is not available. You can view documents but cannot analyze them for misogynistic content.');
        }
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiAvailable(false);
        
        // For development purposes only - enable the button anyway
        if (process.env.NODE_ENV === 'development') {
          console.info('Development mode: Setting API to available for testing UI');
          setApiAvailable(true);
        }
      }
    };
    
    checkApiStatus();
  }, []);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      console.log("File selected:", selectedFile.name);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Determine file type based on extension
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (['pdf'].includes(extension)) {
        setFileType('pdf');
      } else if (['doc', 'docx'].includes(extension)) {
        setFileType('docx');
      } else if (['odt'].includes(extension)) {
        setFileType('odt');
      } else {
        setFileType('unsupported');
      }
      
      // Reset analysis results
      setAnalysisResults(null);
      setDocumentText('');
    }
  };

  const extractTextFromDocument = (text) => {
    // This function will be called by DocumentViewer when text is extracted
    console.log(`Received extracted text: ${text.length} characters`);
    setDocumentText(text);
  };

  const handleAnalyzeClick = async () => {
    if (!documentText) {
      alert('Please wait for the document to be processed before analyzing.');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // For development, create mock results if API is not available
      if (!apiAvailable && process.env.NODE_ENV === 'development') {
        console.log("Using mock results for development");
        setTimeout(() => {
          const mockResults = {
            score: Math.floor(Math.random() * 100),
            excerpts: [
              {
                text: "This is a sample misogynistic text that would be detected.",
                confidence: 89.5,
                startOffset: 120,
                endOffset: 175
              },
              {
                text: "Another example of potentially problematic content.",
                confidence: 75.2,
                startOffset: 340,
                endOffset: 385
              }
            ]
          };
          
          setAnalysisResults(mockResults);
          setIsAnalyzing(false);
        }, 2000);
        return;
      }
      
      // Use the API service to analyze the document
      console.log("Sending document for analysis...");
      const results = await apiService.analyzeDocument(documentText);
      console.log("Analysis results:", results);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Error analyzing document:', error);
      alert(`Error analyzing document: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName('');
    setFileType('');
    setAnalysisResults(null);
    setDocumentText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // For debugging - log the state of key variables when they change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("App state updated:", {
        fileType,
        documentTextLength: documentText ? documentText.length : 0,
        apiAvailable,
        buttonDisabled: isAnalyzing || fileType === 'unsupported' || !documentText
      });
    }
  }, [fileType, documentText, apiAvailable, isAnalyzing]);

  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <div className="content">
          <div className="upload-section">
            <FileUpload 
              onFileChange={handleFileChange} 
              ref={fileInputRef}
              acceptedFileTypes=".pdf,.doc,.docx,.odt"
            />
            {file && (
              <div className="file-actions">
                <span className="file-name">{fileName}</span>
                <button onClick={clearFile} className="clear-btn">Clear</button>
                <button 
                  onClick={handleAnalyzeClick} 
                  className="analyze-btn"
                  disabled={isAnalyzing || fileType === 'unsupported' || !documentText || (!apiAvailable && process.env.NODE_ENV !== 'development')}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze for Misogynistic Content'}
                </button>
              </div>
            )}
            {!apiAvailable && file && (
              <div className="api-warning">
                Warning: API connection unavailable. Analysis functionality is disabled.
              </div>
            )}
          </div>
          
          <div className="document-section">
            {file ? (
              fileType !== 'unsupported' ? (
                <DocumentViewer 
                  file={file} 
                  fileType={fileType}
                  onTextExtracted={extractTextFromDocument}
                />
              ) : (
                <div className="unsupported-message">
                  <h3>Unsupported File Type</h3>
                  <p>Please upload a PDF, DOC, DOCX, or ODT file.</p>
                </div>
              )
            ) : (
              <div className="placeholder">
                <h2>Upload a document to get started</h2>
                <p>Supported formats: PDF, DOC, DOCX, ODT</p>
                <p className="smaller-text">The document will be analyzed for misogynistic content</p>
              </div>
            )}
          </div>
        </div>
        
        {analysisResults && (
          <ResultsPanel results={analysisResults} />
        )}
      </div>
      
      {/* Add Debug Panel in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          fileType={fileType}
          documentText={documentText}
          apiAvailable={apiAvailable}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
}

export default App;