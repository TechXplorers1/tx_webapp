// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user roles from the database
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);

          let roles = ['client']; // Default fallback
          let additionalData = {};

          if (snapshot.exists()) {
            const data = snapshot.val();
            roles = data.roles || ['client'];
            additionalData = data;
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            roles: roles,
            firebaseKey: firebaseUser.uid,
            ...additionalData,
          });
        } catch (error) {
          console.error("Error fetching user roles:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            roles: ['client'],
            firebaseKey: firebaseUser.uid,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  // We keep this for backward compatibility (e.g. login.jsx immediate update), 
  // but onAuthStateChanged works in the background
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    auth.signOut().then(() => {
      setUser(null);
      sessionStorage.removeItem('loggedInClient');
      sessionStorage.removeItem('loggedInEmployee');
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};