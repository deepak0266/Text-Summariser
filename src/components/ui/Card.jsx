import React from 'react';

const Card = ({ 
  children, 
  className = '',
  clickable = false,
  onClick,
  hover = false 
}) => {
  const baseStyles = 'rounded-lg border border-gray-200 bg-white shadow-sm';
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-md' : '';
  const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.98]' : '';

  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export default Card;







