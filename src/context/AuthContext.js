import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
        sendPasswordResetEmail,
        signInWithEmailAndPassword,
        signOut,
        updateEmail,
        updatePassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";

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

  async function nameUpdate(email, name) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.docs.length === 1) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      return updateDoc(docRef, { name: name });
    } else {
      throw new Error("User not found or multiple users found with the same email.");
    }
  }

  async function userNameUpdate(email, userName) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.docs.length === 1) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      return updateDoc(docRef, { userName: userName });
    } else {
      throw new Error("User not found or multiple users found with the same email.");
    }
  }

  async function birthdayUpdate(email, birthday) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.docs.length === 1) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      return updateDoc(docRef, { age: birthday });
    } else {
      throw new Error("User not found or multiple users found with the same email.");
    }
  }
  

  const getUserByEmail = async (email) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('No matching documents for email:', email);
      return null;
    }
  
    const user = querySnapshot.docs[0].data();
    return user;
  }

  /* why are we using unsubscribe */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    })
    return unsubscribe
  }, [])


/* WILL USE IN ANOTHER PROJECT */

  useEffect(async() => {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);

    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      console.log(doc.id)
    })
  }, [])

  useEffect(async() => {
    const docRef = doc(db, 'users', 'tBSqAN37R82YQatxVUdD')
    const querySnapshot = await getDoc(docRef);

    console.log(querySnapshot.data())
  }, [])


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    passwordUpdate,
    emailUpdate,
    nameUpdate,
    getUserByEmail,
    userNameUpdate,
    birthdayUpdate
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;