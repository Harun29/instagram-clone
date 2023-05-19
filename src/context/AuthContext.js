import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword,
        sendPasswordResetEmail,
        signInWithEmailAndPassword,
        signOut,
        updateEmail,
        updatePassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
};

export function AuthProvider ({children}) {

  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false);

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

  async function emailUpdate(currentEmail, email) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", currentEmail));
    const querySnapshot = await getDocs(q);
    setError(false);

    try{
      await updateEmail(auth.currentUser, email);
    }catch(err){
      setError(true);
      throw new Error("Failed changing email!");
    }
        
    if (querySnapshot.docs.length === 1 && !error) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      return updateDoc(docRef, { email: email });
    } else {
      throw new Error("User not found or multiple users found with the same email.");
    }
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

  async function profilePhotoUpdate(email, photoName) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 1) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      return updateDoc(docRef, { pphoto: photoName });
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
    birthdayUpdate,
    profilePhotoUpdate
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;