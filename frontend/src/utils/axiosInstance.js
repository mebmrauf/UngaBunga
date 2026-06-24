import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5005";

const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  config => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.token = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
