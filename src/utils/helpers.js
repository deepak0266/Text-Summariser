
// src/utils/helpers.js
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const validateFile = (file) => {
  const errors = [];
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push('File type not supported. Please upload PDF or TXT files only.');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${formatFileSize(MAX_FILE_SIZE)} limit.`);
  }
  
  return errors;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
