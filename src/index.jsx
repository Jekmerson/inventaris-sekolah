import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const splash = document.getElementById('splash-screen');
if (splash) {
  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 500);
}

