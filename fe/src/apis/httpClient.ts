import axios, { type AxiosInstance } from "axios";

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
  timeout: 8000,
});
console.log("HTTP Client Base URL:", httpClient.defaults.baseURL);
// Basic error log
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default httpClient;
