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

  async function updateField(email, fieldName, value) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.docs.length === 1) {
      const docRef = doc(db, "users", querySnapshot.docs[0].id);
      const fieldToUpdate = {};
      fieldToUpdate[fieldName] = value;
      return updateDoc(docRef, fieldToUpdate);
    } else {
      throw new Error("User not found or multiple users found with the same email.");
    }
  }
  
  async function nameUpdate(email, name) {
    return updateField(email, "name", name);
  }
  
  async function userNameUpdate(email, userName) {
    return updateField(email, "userName", userName);
  }
  
  async function birthdayUpdate(email, birthday) {
    return updateField(email, "age", birthday);
  }
  
  async function profilePhotoUpdate(email, photoName) {
    return updateField(email, "pphoto", photoName);
  }
  
  async function bioUpdate(email, bio) {
    return updateField(email, "bio", bio);
  } 

  async function followersUpdate(email, followers) {
    return updateField(email, "followers", followers);
  }  

  async function followingUpdate(email, following) {
    return updateField(email, "following", following);
  }

  async function postsUpdate(email, post) {
    return updateField(email, "posts", post);
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

  const getUserByUsername = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userName', '==', username));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.error('No matching documents for username:', username);
      return null;
    }
  
    const user = querySnapshot.docs[0].data();
    return user;
  }

  /* we use unsubscribe because "return" in useeffect runs when the component is unmounted */
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
    getUserByUsername,
    userNameUpdate,
    birthdayUpdate,
    profilePhotoUpdate,
    bioUpdate,
    followersUpdate,
    followingUpdate,
    postsUpdate
  }

  return (  
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
 
export default AuthContext;