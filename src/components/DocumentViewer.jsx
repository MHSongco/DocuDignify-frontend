// components/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import mammoth from 'mammoth';
import './DocumentViewer.css';

// Set up PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentViewer = ({ file, fileType }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setHtmlContent('');
    
    if (file && fileType) {
      if (fileType === 'pdf') {
        // PDF files are handled by react-pdf, so we just reset the page number
        setPageNumber(1);
        setIsLoading(false);
      } else if (fileType === 'docx') {
        // Process DOC/DOCX files with mammoth.js
        const reader = new FileReader();
        reader.onloadend = function() {
          const arrayBuffer = reader.result;
          mammoth.convertToHtml({ arrayBuffer })
            .then(result => {
              setHtmlContent(result.value);
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Error converting DOCX:", err);
              setError("Failed to convert the DOCX file. " + err.message);
              setIsLoading(false);
            });
        };
        reader.onerror = function() {
          setError("Failed to read the file.");
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType === 'odt') {
        // Process ODT files with WebODF
        handleOdtFile(file);
      }
    }
  }, [file, fileType]);

  const handleOdtFile = (file) => {
    try {
      // Create a div to load WebODF into
      const odtElement = document.createElement('div');
      odtElement.id = 'odt-container';
      
      // Read file
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          // Load file into browser's memory
          const fileUrl = URL.createObjectURL(file);
          
          // Check if WebODF is loaded
          if (typeof window.odf === 'undefined') {
            // WebODF is not loaded, load it dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/webodf/0.5.9/webodf.js';
            script.onload = function() {
              loadOdt(fileUrl, odtElement);
            };
            script.onerror = function() {
              setError("Failed to load WebODF library.");
              setIsLoading(false);
            };
            document.head.appendChild(script);
          } else {
            // WebODF is already loaded
            loadOdt(fileUrl, odtElement);
          }
        } catch (err) {
          console.error("Error processing ODT file:", err);
          setError("Failed to process the ODT file: " + err.message);
          setIsLoading(false);
        }
      };
      reader.onerror = function() {
        setError("Failed to read the file.");
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error setting up ODT viewer:", err);
      setError("Failed to set up the ODT viewer: " + err.message);
      setIsLoading(false);
    }
  };

  const loadOdt = (fileUrl, container) => {
    try {
      // Initialize WebODF
      const odfCanvas = new window.odf.OdfCanvas(container);
      odfCanvas.load(fileUrl);
      
      // Update component state with the rendered content
      setHtmlContent('<div id="odt-viewer"></div>');
      setIsLoading(false);
      
      // After the component re-renders, append the WebODF container
      setTimeout(() => {
        const odtViewer = document.getElementById('odt-viewer');
        if (odtViewer) {
          odtViewer.appendChild(container);
        }
      }, 100);
    } catch (err) {
      console.error("Error initializing WebODF:", err);
      setError("Failed to initialize WebODF: " + err.message);
      setIsLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages, newPageNumber));
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);
  
  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  if (isLoading) {
    return <div className="loading">Loading document...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="document-viewer">
      <div className="document-toolbar">
        {fileType === 'pdf' && (
          <>
            <div className="page-navigation">
              <button onClick={previousPage} disabled={pageNumber <= 1}>
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button onClick={nextPage} disabled={pageNumber >= numPages}>
                Next
              </button>
            </div>
            <div className="zoom-controls">
              <button onClick={zoomOut}>-</button>
              <button onClick={resetZoom}>Reset</button>
              <button onClick={zoomIn}>+</button>
              <span>{Math.round(scale * 100)}%</span>
            </div>
          </>
        )}
      </div>

      <div className="document-content">
        {fileType === 'pdf' ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error("Error loading PDF:", error);
              setError("Failed to load the PDF file: " + error.message);
            }}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        ) : (
          <div 
            className="html-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;