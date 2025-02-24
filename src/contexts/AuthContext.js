import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: name });
      
      // Create user document in Firestore
      await firebase.firestore().collection('users').doc(user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        subjectsCount: 0
      });
      
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const login = async (email, password, rememberMe) => {
    try {
      if (rememberMe) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } else {
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const updateEmail = (email) => {
    return user.updateEmail(email);
  };

  const updatePassword = (password) => {
    return user.updatePassword(password);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};