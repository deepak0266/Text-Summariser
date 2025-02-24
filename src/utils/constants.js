// src/utils/constants.js
export const MAX_SUBJECTS_PER_USER = 5;
export const MAX_DOCUMENTS_PER_SUBJECT = 4;
export const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_UPLOAD_STATES = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SUBJECT: (id) => `/subjects/${id}`
};