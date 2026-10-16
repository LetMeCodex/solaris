import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { startAnimatedFavicon } from './ui/brand/logo';

// The tab icon is the Solaris mark, its worlds going round
startAnimatedFavicon();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
