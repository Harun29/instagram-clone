import { initializeApp } from "@firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBba_QIRHCaiNrLPtrqE0JyeLwr3kkoP0c",
  authDomain: "blog-87022.firebaseapp.com",
  projectId: "blog-87022",
  storageBucket: "blog-87022.appspot.com",
  messagingSenderId: "624771397011",
  appId: "1:624771397011:web:c5ac407b641a3ef9262466",
  measurementId: "G-GL4TJ6PZR3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();