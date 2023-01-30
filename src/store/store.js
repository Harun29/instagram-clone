import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/postReducer";
import authReducer from "./reducers/authReducer";

export default configureStore({
  reducer: {
    post: postReducer,
    auth: authReducer
  }
});