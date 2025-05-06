// App.jsx - Main application component
import React, { useState, useRef } from 'react';
import DocumentViewer from './components/DocumentViewer';
import FileUpload from './components/FileUpload';
import Navbar from './components/NavBar';
import ResultsPanel from './components/ResultsPanel';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
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
    }
  };

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis with timeout (in a real app, this would be an actual API call)
    setTimeout(() => {
      // Mock analysis results - this would come from your backend
      const mockResults = {
        score: Math.floor(Math.random() * 100),
        matches: [
          {
            text: "This is a sample matched text that would be highlighted.",
            startOffset: 120,
            endOffset: 175,
            sourceUrl: "https://example.com/source1",
            similarity: 92
          },
          {
            text: "Another example of potentially matched content.",
            startOffset: 340,
            endOffset: 385,
            sourceUrl: "https://example.com/source2",
            similarity: 87
          }
        ]
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const clearFile = () => {
    setFile(null);
    setFileName('');
    setFileType('');
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
                  disabled={isAnalyzing || fileType === 'unsupported'}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
                </button>
              </div>
            )}
          </div>
          
          <div className="document-section">
            {file ? (
              fileType !== 'unsupported' ? (
                <DocumentViewer file={file} fileType={fileType} />
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
              </div>
            )}
          </div>
        </div>
        
        {analysisResults && (
          <ResultsPanel results={analysisResults} />
        )}
      </div>
    </div>
  );
}

export default App;