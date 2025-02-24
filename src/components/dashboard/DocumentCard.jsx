
// src/components/dashboard/DocumentCard.jsx
import React, { useState } from 'react';
import FilePreview from './FilePreview';
import { formatDate } from '../../utils/helpers';

const DocumentCard = ({ document, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{document.name}</h3>
          <p className="text-sm text-gray-500">
            Uploaded: {formatDate(document.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      
      {showPreview && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Summary:</h4>
          <p className="text-gray-700">{document.summary}</p>
          
          <h4 className="font-medium mt-4 mb-2">Original Content:</h4>
          <FilePreview file={document.file} url={document.url} />
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
