import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBba_QIRHCaiNrLPtrqE0JyeLwr3kkoP0c",
  authDomain: "blog-87022.firebaseapp.com",
  projectId: "blog-87022",
  storageBucket: "blog-87022.appspot.com",
  messagingSenderId: "624771397011",
  appId: "1:624771397011:web:ba7cf0918c4f9a7d262466",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
