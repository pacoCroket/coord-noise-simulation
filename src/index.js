import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase, { fbConfig } from "./config/firebaseConfig.js";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { reduxFirestore, getFirestore, createFirestoreInstance } from "redux-firestore";
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase";

// get rootStore from auth and project reducers
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirestore, getFirebase })),
    reduxFirestore(firebase, fbConfig)
  )
);

const rrfConfig = { ...fbConfig, userProfile: "users", useFirestoreForProfile: true};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  initializeAuth: true,
  createFirestoreInstance
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
