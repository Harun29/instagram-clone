import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut } from "firebase/auth";
import { auth } from "../config/firebase";

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


  /* why are we using unsubscribe */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;