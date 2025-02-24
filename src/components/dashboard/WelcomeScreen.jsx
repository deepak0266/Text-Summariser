


// src/components/dashboard/WelcomeScreen.jsx
import React from 'react';

const WelcomeScreen = ({ onUpload }) => {
  return (
    <div className="welcome-title text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Welcome to TextSummariser!</h2>
      <p className="text-gray-600 mb-8">
        Get started by uploading your first document. We'll help you organize and summarize your study materials.
      </p>
      <button onClick={onUpload} className="chatbot-button">
        Upload Your First Document
      </button>
    </div>
  );
};

export default WelcomeScreen;
