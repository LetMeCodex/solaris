import React from 'react';
import ReactDOM from 'react-dom/client';
import { Report } from './Report';
import './report.css';
import { startAnimatedFavicon } from '../ui/brand/logo';
import gsap from 'gsap';

startAnimatedFavicon();

// Development handle (testing in a background tab, where animation frames pause)
if (import.meta.env.DEV) (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;

ReactDOM.createRoot(document.getElementById('report')!).render(
  <React.StrictMode>
    <Report />
  </React.StrictMode>
);
