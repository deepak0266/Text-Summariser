import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateEmail as updateAuthEmail,
  updatePassword as updateAuthPassword
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// ✅ AuthContext banana zaroori hai
const AuthContext = createContext();

// ✅ useAuth ka sahi export
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        subjectsCount: 0
      });
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateEmail = async (email) => {
    try {
      if (user) {
        await updateAuthEmail(user, email);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updatePassword = async (password) => {
    try {
      if (user) {
        await updateAuthPassword(user, password);
      }
    } catch (error) {
      throw new Error(error.message);
    }
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
}
