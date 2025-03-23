import axios from "axios";

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: "https://smartt-back.onrender.com/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
