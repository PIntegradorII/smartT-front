import api from "../../app/services/api"; // Importamos la configuración base de Axios

// Crear un nuevo registro en personal_data
export const createPersonalData = async (data) => {
  const response = await api.post("/personal_data/add", data);
  return response.data;
};

// Obtener un registro por ID
export const getPersonalDataById = async (id) => {
  const response = await api.get(`/personal_data/${id}`);
  return response.data;
};

// Obtener todos los registros
export const getAllPersonalData = async () => {
  const response = await api.get("/");
  return response.data;
};

// Actualizar un registro por ID
export const updatePersonalData = async (id, data) => {
  const response = await api.put(`/update/${id}`, data);
  return response.data;
};

// Eliminar un registro por ID
export const deletePersonalData = async (id) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};

