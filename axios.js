// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
