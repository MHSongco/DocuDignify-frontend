// components/ResultsPanel.jsx
import React from 'react';
import './ResultsPanel.css';

const ResultsPanel = ({ results }) => {
  if (!results) return null;

  const { score, excerpts } = results;
  
  // Determine score level
  const getScoreLevel = (score) => {
    if (score < 20) return 'low';
    if (score < 50) return 'medium';
    return 'high';
  };
  
  const scoreLevel = getScoreLevel(score);

  return (
    <div className="results-panel">
      <div className="results-header">
        <h2>Content Analysis Results</h2>
        <div className={`score-indicator ${scoreLevel}`}>
          <div className="score-value">{score}%</div>
          <div className="score-label">Misogyny Score</div>
        </div>
      </div>
      
      <div className="results-summary">
        <p>
          {scoreLevel === 'low' 
            ? 'Low misogynistic content detected. The document appears to be relatively free of concerning content.'
            : scoreLevel === 'medium'
              ? 'Moderate levels of misogynistic content detected. Some portions of the document contain potentially problematic language.'
              : 'High levels of misogynistic content detected. This document contains significant problematic language.'}
        </p>
      </div>
      
      {excerpts && excerpts.length > 0 ? (
        <div className="matches-section">
          <h3>Detected Misogynistic Content</h3>
          <div className="matches-list">
            {excerpts.map((excerpt, index) => (
              <div key={index} className="match-item">
                <div className="match-text">
                  <p className="matched-content">"{excerpt.text}"</p>
                  <div className="match-info">
                    <span className="similarity-badge">
                      {Math.round(excerpt.confidence)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-matches">
          <p>No misogynistic content detected.</p>
        </div>
      )}
      
      <div className="results-actions">
        <button className="download-btn">Download Report</button>
        <button className="export-btn">Export to PDF</button>
      </div>
    </div>
  );
};

export default ResultsPanel;