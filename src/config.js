
const devUrl = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000` : "http://localhost:5000";
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || devUrl;
