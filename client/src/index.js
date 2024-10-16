import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Create the root and render the app
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);