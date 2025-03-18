import api from "./api"; // Importamos la configuración base de Axios

// Crear un nuevo registro en personal_data
export const createHealthData = async (data) => {
  const response = await api.post("/health/", data);
  return response.data;
};

// Obtener un registro por ID
export const getHealthDataById = async (id) => {
  const response = await api.get(`/health/${id}`);
  return response.data;
};

// Obtener todos los registros
export const getAllHealthData = async () => {
  const response = await api.get("/");
  return response.data;
};

// Actualizar un registro por ID
export const updateHealthData = async (id, data) => {
  const response = await api.put(`/update/${id}`, data);
  return response.data;
};

// Eliminar un registro por ID
export const deleteHealthData = async (id) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};
