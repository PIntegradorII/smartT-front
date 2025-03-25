import api from "../../app/services/api"; // Asegúrate de tener esta instancia de Axios configurada

// Crear un nuevo registro en physical_data
export const createPhysicalData = async (data) => {
  const response = await api.post("/physical/add", data);
  return response.data;
};

// Obtener un registro por ID
export const getPhysicalDataById = async (id) => {
  const response = await api.get(`/physical/${id}`);
  return response.data;
};

// Obtener todos los registros
export const getAllPhysicalData = async () => {
  const response = await api.get("/physical");
  return response.data;
};

// Actualizar un registro por ID
export const updatePhysicalData = async (id, data) => {
  const response = await api.put(`/physical/update/${id}`, data);
  return response.data;
};

// Eliminar un registro por ID
export const deletePhysicalData = async (id) => {
  const response = await api.delete(`/physical/delete/${id}`);
  return response.data;
};
