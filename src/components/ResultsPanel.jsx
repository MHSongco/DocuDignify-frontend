// components/ResultsPanel.jsx
import React from 'react';
import './ResultsPanel.css';

const ResultsPanel = ({ results }) => {
  if (!results) return null;

  const { score, matches } = results;
  
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
        <h2>Analysis Results</h2>
        <div className={`score-indicator ${scoreLevel}`}>
          <div className="score-value">{score}%</div>
          <div className="score-label">Similarity Score</div>
        </div>
      </div>
      
      <div className="results-summary">
        <p>
          {scoreLevel === 'low' 
            ? 'Low similarity detected. Your document appears to be mostly original.'
            : scoreLevel === 'medium'
              ? 'Medium similarity detected. Some portions of your document may require citation.'
              : 'High similarity detected. Significant portions of your document match existing content.'}
        </p>
      </div>
      
      {matches && matches.length > 0 ? (
        <div className="matches-section">
          <h3>Detected Matches</h3>
          <div className="matches-list">
            {matches.map((match, index) => (
              <div key={index} className="match-item">
                <div className="match-text">
                  <p className="matched-content">"{match.text}"</p>
                  <div className="match-info">
                    <span className="similarity-badge">
                      {match.similarity}% similar
                    </span>
                    <a 
                      href={match.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="source-link"
                    >
                      View Source
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-matches">
          <p>No specific matches found.</p>
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