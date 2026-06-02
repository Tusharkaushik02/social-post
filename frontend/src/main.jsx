/**
 * Application Entry Point
 *
 * Mounts the React app with:
 * - StrictMode for development warnings
 * - Global styles (Tailwind + Aura Social theme)
 * - Toast notifications provider
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
