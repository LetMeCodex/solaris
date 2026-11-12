import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../index.css';
import { startAnimatedFavicon } from '../ui/brand/logo';

// The fly page: the same Solaris, straight into the jet over Earth (see App's `fly` mode)
startAnimatedFavicon();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App mode="fly" />
  </React.StrictMode>
);
