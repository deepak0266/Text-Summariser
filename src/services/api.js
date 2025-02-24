// src/services/api.js
import { auth, firestore, storage, serverTimestamp } from './firebase';

export const api = {
  // Auth APIs
  createUser: async (email, password, name) => {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    await user.updateProfile({ displayName: name });
    
    await firestore.collection('users').doc(user.uid).set({
      name,
      email,
      createdAt: serverTimestamp(),
      subjectsCount: 0
    });
    
    return user;
  },

  // Subjects APIs
  getSubjects: async (userId) => {
    const snapshot = await firestore
      .collection('users')
      .doc(userId)
      .collection('subjects')
      .orderBy('createdAt', 'desc')
      .get();
      
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  createSubject: async (userId, name) => {
    const ref = await firestore
      .collection('users')
      .doc(userId)
      .collection('subjects')
      .add({
        name,
        createdAt: serverTimestamp(),
        documentsCount: 0
      });
      
    return {
      id: ref.id,
      name,
      documentsCount: 0
    };
  },

  // Documents APIs
  uploadDocument: async (userId, subjectId, file, metadata) => {
    const fileRef = storage
      .ref()
      .child(`users/${userId}/documents/${Date.now()}_${file.name}`);
      
    await fileRef.put(file);
    const downloadURL = await fileRef.getDownloadURL();
    
    const docRef = await firestore
      .collection('users')
      .doc(userId)
      .collection('subjects')
      .doc(subjectId)
      .collection('documents')
      .add({
        name: metadata.name,
        topic: metadata.topic,
        fileUrl: downloadURL,
        createdAt: serverTimestamp()
      });
      
    return {
      id: docRef.id,
      ...metadata,
      fileUrl: downloadURL
    };
  }
};