import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="53920106205-d1ikdp108g4enms0k6vac03qmhjsilj7.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);