import axios from "axios";

// Usar la variable de entorno para la base URL
const API_URL = process.env.REACT_APP_API_URL_LOCAL || "https://smartt-back.onrender.com/v1/";
// const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:10000/v1/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
