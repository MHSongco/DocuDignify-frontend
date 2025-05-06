// src/services/apiService.js

/**
 * Service for communicating with the Flask API that processes text for misogyny detection
 */

const API_BASE_URL = 'http://localhost:8080';

/**
 * Check if the API is available and ready to process requests
 * @returns {Promise<boolean>} True if the API is available
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Analyze a text for misogynistic content
 * @param {string} text - The text to analyze
 * @returns {Promise<Object>} The analysis results
 */
export const analyzeText = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Text analysis failed:', error);
    throw error;
  }
};

/**
 * Process a document by breaking it into sentences and analyzing each one
 * @param {string} documentText - The full text of the document
 * @returns {Promise<Object>} Analysis results with overall score and detected excerpts
 */
export const analyzeDocument = async (documentText) => {
  try {
    // Split document into sentences using regex
    // This is a simple approach - more sophisticated NLP sentence tokenization could be used
    const sentences = documentText.match(/[^.!?]+[.!?]+/g) || [];
    
    // Initialize results object
    const results = {
      score: 0,
      excerpts: [],
      totalSentences: sentences.length,
      detectedSentences: 0
    };
    
    // Analyze each sentence
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      
      // Skip very short sentences
      if (sentence.length < 5) continue;
      
      try {
        const analysisResult = await analyzeText(sentence);
        
        // Check if the sentence is classified as misogynistic
        // Assuming model returns class 1 for misogynistic content
        if (analysisResult.class === 1 && analysisResult.confidence > 0.6) {
          results.excerpts.push({
            text: sentence,
            confidence: analysisResult.confidence * 100, // Convert to percentage
            startOffset: documentText.indexOf(sentence),
            endOffset: documentText.indexOf(sentence) + sentence.length
          });
          results.detectedSentences += 1;
        }
      } catch (error) {
        console.error(`Error analyzing sentence: ${sentence}`, error);
        // Continue with other sentences even if one fails
      }
    }
    
    // Calculate overall score (percentage of misogynistic sentences)
    if (sentences.length > 0) {
      results.score = Math.round((results.detectedSentences / sentences.length) * 100);
    }
    
    return results;
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw error;
  }
};

export default {
  checkApiHealth,
  analyzeText,
  analyzeDocument
};