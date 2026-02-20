import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV) return 'http://localhost:5000/api';
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;
