import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

const UploadModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = 'document', // 'document' or 'subject'
  currentSubject = null 
}) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (uploadedFile) => {
    setError('');
    if (type === 'document') {
      const allowedTypes = ['application/pdf', 'text/plain'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setError('Only PDF and TXT files are allowed');
        return;
      }
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB
        setError('File size should not exceed 10MB');
        return;
      }
      setFile(uploadedFile);
      setName(uploadedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (type === 'subject') {
        if (!name.trim()) {
          throw new Error('Subject name is required');
        }
        await onSubmit({ name: name.trim() });
      } else {
        if (!file) {
          throw new Error('Please select a file');
        }
        if (!name.trim()) {
          throw new Error('Document name is required');
        }
        await onSubmit({ file, name: name.trim(), topic: topic.trim() });
      }
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName('');
    setTopic('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={type === 'subject' ? 'Create New Subject' : 'Upload Document'}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {type === 'document' && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
          >
            {file ? (
              <div className="flex items-center space-x-4">
                <File className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop a file, or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PDF or TXT up to 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => validateAndSetFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
              </div>
            )}
          </div>
        )}

        <Input
          label={type === 'subject' ? 'Subject Name' : 'Document Name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === 'subject' ? 'Enter subject name' : 'Enter document name'}
          required
        />

        {type === 'document' && (
          <Input
            label="Topic (Optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
          />
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            {type === 'subject' ? 'Create Subject' : 'Upload Document'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadModal;