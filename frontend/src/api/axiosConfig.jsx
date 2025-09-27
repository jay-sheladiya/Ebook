// src/api/apiClient.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // your backend
});

export const setToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
