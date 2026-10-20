/**
 * Dynamic API Base URL Config
 * - When in Vite dev mode (port 3000), routes to local FastAPI at http://127.0.0.1:8000
 * - When hosted on a server (or single-port production), uses relative URL or VITE_API_BASE_URL
 */
const isLocalViteDev = typeof window !== 'undefined' && window.location.port === '3000';

export const API_BASE_URL: string = 
  (import.meta as any).env?.VITE_API_BASE_URL || 
  (isLocalViteDev ? 'http://127.0.0.1:8000' : '');
