import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// Helper functions for common Firebase operations
export const createUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email } = user;
    const createdAt = serverTimestamp();

    try {
      await userRef.set({
        email,
        createdAt,
        subjectsCount: 0,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return userRef;
};

export const uploadFile = async (file, userId) => {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`users/${userId}/documents/${Date.now()}_${file.name}`);
  await fileRef.put(file);
  const downloadURL = await fileRef.getDownloadURL();
  return { fileRef, downloadURL };
};

export const deleteFile = async (fileUrl) => {
  const fileRef = storage.refFromURL(fileUrl);
  await fileRef.delete();
};

export default firebase;