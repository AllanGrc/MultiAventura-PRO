
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import the base CSS file

// The 'declare global' block is TypeScript-specific and can cause SyntaxError if the browser
// tries to parse TSX directly as JavaScript without a build step.
// The runtime check 'typeof window.confetti !== 'undefined'' in FeedbackMessage.tsx is sufficient.
// We remove this block to resolve the "Uncaught SyntaxError: Invalid or unexpected token" error.
declare global {
  interface Window {
    confetti: any;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Fallo en el registro del Service Worker:', error);
      });
  });
}
