// src/components/ui/Tooltip.jsx
import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      
      {show && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
          {text}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;