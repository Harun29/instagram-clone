import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import {
getFirestore,
createFirestoreInstance
} from "redux-firestore";
import { getFirebase } from "react-redux-firebase";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";
import firebaseConfig from "../config/fbConfig";
import firebase from "firebase/app";

firebase.initializeApp(firebaseConfig);

const store = configureStore({
  reducer: {
  post: postReducer,
  auth: authReducer
  },
  middleware: [ thunk.withExtraArgument({ getFirebase, getFirestore }) ],
  devTools: process.env.NODE_ENV !== "production"
  });
  
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
  attachAuthIsReady: true
  };
  
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
  };
  
export { rrfProps };  

export default store;
