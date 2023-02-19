import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
        sendPasswordResetEmail,
        signInWithEmailAndPassword,
        signOut,
        updateEmail,
        updatePassword } from "firebase/auth";
import { auth } from "../config/firebase";
// import { db } from "../config/firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function AuthProvider ({children}) {

  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function passwordUpdate(password) {
    return updatePassword(auth.currentUser, password)
  }

  function emailUpdate(email) {
    return updateEmail(auth.currentUser, email)
  }

  // const getUserByEmail = async (email) => {
  //   const usersRef = collection(db, 'users');
  //   const q = query(usersRef, where('email', '==', email));
  //   const querySnapshot = await getDocs(q);
  
  //   if (querySnapshot.empty) {
  //     console.error('No matching documents for email:', email);
  //     return null;
  //   }
  
  //   const user = querySnapshot.docs[0].data();
  //   return user;
  // }

  /* why are we using unsubscribe */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    })
    return unsubscribe
  }, [])


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    passwordUpdate,
    emailUpdate
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;