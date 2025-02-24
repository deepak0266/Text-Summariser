
// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 ${className}`}
      {...props}
    />
  );
};

export default Input;