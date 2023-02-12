import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
        signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function AuthProvider ({children}) {

  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    console.log('user is trying to be crated');
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }


  /* why are we using unsubscribe */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('user state changed')
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;