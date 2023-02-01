import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store/store';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import rrfProps from "./store/rrfProps";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>
</React.StrictMode>
);


