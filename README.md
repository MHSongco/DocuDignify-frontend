# Document Viewer App

A React-based web application for viewing and analyzing document files (PDF, DOC, DOCX, and ODT).

## Features

- 📄 Support for multiple document formats: PDF, DOC, DOCX, and ODT
- 🔍 Zoom in/out and page navigation for PDF files
- 📊 Document analysis with similarity scoring
- 🔗 Matched content detection with source links
- 📱 Responsive design for desktop and mobile devices
- 📥 Drag and drop file upload

## Prerequisites

- Node.js (version 14.x or later)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/
cd document-viewer-app
```

2. Install dependencies:

```bash
npm install
# or using yarn
yarn install
```

3. Start the development server:

```bash
npm run dev
# or using yarn
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Libraries Used

This application integrates several JavaScript libraries to provide document viewing capabilities:

- **react-pdf** - For rendering PDF documents
- **mammoth.js** - For converting and rendering DOC/DOCX files to HTML
- **WebODF** (loaded dynamically) - For viewing ODT (OpenDocument Text) files
- **pdfjs-dist** - Core PDF.js library used by react-pdf

## Project Structure

```
document-viewer-app/
├── public/
├── src/
│   ├── components/
│   │   ├── DocumentViewer.jsx
│   │   ├── DocumentViewer.css
│   │   ├── FileUpload.jsx
│   │   ├── FileUpload.css
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── ResultsPanel.jsx
│   │   └── ResultsPanel.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

## Usage Guide

1. **Upload a Document**:
   - Drag and drop a file onto the upload area
   - Or click "Browse Files" to select a file from your computer

2. **View Document**:
   - Once uploaded, the document will be displayed in the viewer
   - For PDFs, use the navigation buttons to move between pages
   - Use the zoom controls to adjust the document size

3. **Analyze Content**:
   - Click the "Analyze Document" button to check for content similarity
   - Review the results panel for similarity score and potential matches
   - Click "View Source" links to see detected source material

4. **Export Results**:
   - Use the "Download Report" button to save analysis results
   - "Export to PDF" creates a PDF report of the analysis

## Customization

You can customize the app by modifying the CSS files or extending the components with additional functionality.

## Limitations

- The document analysis feature uses mock data in this implementation
- WebODF may have limited support for complex ODT formatting
- Very large documents may cause performance issues in the browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [react-pdf](https://react-pdf.org/)
- [mammoth.js](https://github.com/mwilliamson/mammoth.js)
- [WebODF](https://webodf.org/)
- [PDF.js](https://mozilla.github.io/pdf.js/)
