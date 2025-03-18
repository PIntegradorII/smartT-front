import axios from "axios";

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
