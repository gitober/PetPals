import ReactDOM from 'react-dom';
import { createRoot as createReactRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import React, { StrictMode } from 'react';

import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = createReactRoot(document.getElementById('root')); // Use createReactRoot

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

