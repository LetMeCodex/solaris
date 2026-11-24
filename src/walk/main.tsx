import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalkApp } from './WalkApp';
import '../index.css';
import { startAnimatedFavicon } from '../ui/brand/logo';

startAnimatedFavicon();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalkApp />
  </React.StrictMode>,
);
