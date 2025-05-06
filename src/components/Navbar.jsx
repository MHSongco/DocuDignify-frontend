// components/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo">📝</span>
        <h1>Document Viewer</h1>
      </div>
      <div className="navbar-links">
        <a href="#" className="nav-link active">Home</a>
        <a href="#" className="nav-link">Documentation</a>
        <a href="#" className="nav-link">About</a>
      </div>
    </nav>
  );
};

export default Navbar;