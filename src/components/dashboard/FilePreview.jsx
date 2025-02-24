// src/components/dashboard/FilePreview.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const FilePreview = ({ file, url }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        if (file.type === 'text/plain') {
          const text = await file.text();
          setContent(text);
        } else {
          // For PDF/DOCX, show a preview message
          setContent(`Preview not available for ${file.type} files`);
        }
      } catch (err) {
        setError('Failed to load file preview');
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();
  }, [file]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {content}
      </pre>
    </div>
  );
};

export default FilePreview;