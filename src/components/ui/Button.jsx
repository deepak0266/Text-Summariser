// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`chatbot-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
