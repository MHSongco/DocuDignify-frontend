// components/DebugPanel.jsx
import React from 'react';

const DebugPanel = ({ 
  fileType, 
  documentText, 
  apiAvailable, 
  isAnalyzing 
}) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const debugStyles = {
    panel: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '200px',
      overflowY: 'auto'
    },
    heading: {
      margin: '0 0 5px 0',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    item: {
      margin: '3px 0',
      display: 'flex',
      justifyContent: 'space-between'
    },
    label: {
      marginRight: '10px',
      fontWeight: 'bold'
    },
    value: {
      wordBreak: 'break-all'
    },
    success: {
      color: '#4caf50'
    },
    warning: {
      color: '#ff9800'
    },
    error: {
      color: '#f44336'
    }
  };
  
  return (
    <div style={debugStyles.panel}>
      <h3 style={debugStyles.heading}>Debug Information</h3>
      <div style={debugStyles.item}>
        <span style={debugStyles.label}>File Type:</span>
        <span style={debugStyles.value}>{fileType || 'None'}</span>
      </div>
      <div style={debugStyles.item}>
        <span style={debugStyles.label}>Document Text:</span>
        <span 
          style={{
            ...debugStyles.value,
            ...(documentText ? debugStyles.success : debugStyles.error)
          }}
        >
          {documentText ? `${documentText.length} chars` : 'No text extracted'}
        </span>
      </div>
      <div style={debugStyles.item}>
        <span style={debugStyles.label}>API Available:</span>
        <span 
          style={{
            ...debugStyles.value,
            ...(apiAvailable ? debugStyles.success : debugStyles.error)
          }}
        >
          {apiAvailable ? 'Yes' : 'No'}
        </span>
      </div>
      <div style={debugStyles.item}>
        <span style={debugStyles.label}>Analyzing:</span>
        <span style={debugStyles.value}>{isAnalyzing ? 'Yes' : 'No'}</span>
      </div>
      <div style={debugStyles.item}>
        <span style={debugStyles.label}>Button Should Be:</span>
        <span 
          style={{
            ...debugStyles.value,
            ...((isAnalyzing || !documentText || !apiAvailable) ? debugStyles.error : debugStyles.success)
          }}
        >
          {(isAnalyzing || !documentText || !apiAvailable) ? 'Disabled' : 'Enabled'}
        </span>
      </div>
    </div>
  );
};

export default DebugPanel;