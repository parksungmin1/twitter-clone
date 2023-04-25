import React from 'react';
import ReactDOM from "react-dom";
import App from './components/App';
import firebase from "firebase/compat/app";
import "./styles.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);