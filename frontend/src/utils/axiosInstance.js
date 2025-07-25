// utils/axiosInstance.js

import axios from "axios";
import store from "../store/store"; // make sure this path is correct

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // supports CORS cookie headers if needed
});

// Automatically attach Authorization header if token exists
instance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
