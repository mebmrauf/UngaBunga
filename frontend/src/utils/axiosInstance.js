import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.token = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
