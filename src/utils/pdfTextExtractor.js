// src/utils/pdfTextExtractor.js

/**
 * Utility for extracting text from PDF files using PDF.js
 */

/**
 * Extract text from a PDF file
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - A promise that resolves to the extracted text
 */
export const extractTextFromPdf = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Starting PDF text extraction utility...");
        
        // Create a URL from the file
        const fileUrl = URL.createObjectURL(file);
        
        // Check if pdfjsLib is available
        if (!window.pdfjsLib) {
          console.error("PDF.js library not found in window");
          reject(new Error("PDF.js library not loaded properly. Make sure it's included in index.html"));
          return;
        }
        
        // Load the PDF document
        const loadingTask = window.pdfjsLib.getDocument(fileUrl);
        
        loadingTask.promise
          .then(async (pdf) => {
            console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
            
            let extractedText = '';
            
            // Process each page
            for (let i = 1; i <= pdf.numPages; i++) {
              try {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Extract text from this page
                const pageText = textContent.items
                  .map(item => item.str)
                  .join(' ');
                  
                extractedText += pageText + '\n\n';
                
                console.log(`Processed page ${i} (${pageText.length} chars)`);
              } catch (pageError) {
                console.warn(`Error processing page ${i}:`, pageError);
                // Continue with other pages
              }
            }
            
            // Clean up the object URL
            URL.revokeObjectURL(fileUrl);
            
            console.log(`Text extraction complete. Extracted ${extractedText.length} characters`);
            
            if (extractedText.length > 0) {
              resolve(extractedText);
            } else {
              reject(new Error("No text could be extracted from the PDF"));
            }
          })
          .catch((error) => {
            console.error("Error loading PDF:", error);
            URL.revokeObjectURL(fileUrl);
            reject(new Error(`Failed to load PDF: ${error.message}`));
          });
          
      } catch (error) {
        console.error("Error in PDF text extraction:", error);
        reject(error);
      }
    });
  };
  
  /**
   * Alternative method using ArrayBuffer
   * @param {File} file - The PDF file to extract text from
   * @returns {Promise<string>} - A promise that resolves to the extracted text
   */
  export const extractTextFromPdfBuffer = async (file) => {
    try {
      console.log("Starting PDF text extraction with ArrayBuffer...");
      
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Check if pdfjsLib is available
      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded properly");
      }
      
      // Load the PDF document
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log(`PDF loaded successfully. Number of pages: ${pdf.numPages}`);
      
      let extractedText = '';
      
      // Process each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text from this page
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
          
        extractedText += pageText + '\n\n';
      }
      
      console.log(`Text extraction complete. Extracted ${extractedText.length} characters`);
      return extractedText;
      
    } catch (error) {
      console.error("Error in PDF text extraction:", error);
      throw error;
    }
  };
  
  export default {
    extractTextFromPdf,
    extractTextFromPdfBuffer
  };