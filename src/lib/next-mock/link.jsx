// Mock implementation for next/link
import React from 'react';

// Simple Link component that renders an anchor tag
const Link = ({ href, children, ...props }) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;