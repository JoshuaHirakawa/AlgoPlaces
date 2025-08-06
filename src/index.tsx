import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/tailwind.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Client_Id: string =
  '206032018883-7h9e1jk7roftm7me1rkib4qeqpcldo3i.apps.googleusercontent.com';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId={Client_Id}>
    <App />
  </GoogleOAuthProvider>
);
