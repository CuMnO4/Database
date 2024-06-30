import axios from "axios";
import { GlobalConfigs } from "./Config";

const axiosInstance = axios.create({
  baseURL: GlobalConfigs.serverHostName,
  timeout: 5000, // Adjust as needed
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Get the token from wherever you stored it after login
    const token = localStorage.getItem("jwt_token");
    // Attach the token to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
