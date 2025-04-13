import api from "../../app/services/api"; // Importar la configuración base de Axios

export const savePhysicalHistory = async (historyData) => {
  try {
    const response = await api.post("/physical_history/physical_history", historyData);
    return response.data;
  } catch (error) {
    console.error("Error al guardar los datos históricos físicos:", error);
  }
};

export const getPhysicalHistory = async (googleId) => {
  try {
    const response = await api.get(`/physical_history/physical_history/${googleId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial físico:", error);
  }
};
