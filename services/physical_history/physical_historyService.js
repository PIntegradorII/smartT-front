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

// Función para enviar los datos y obtener el resultado
export const generarTextoMedidas = async (datos) => {
  // Estructuramos el payload que será enviado al backend

  try {
    // Realizamos la solicitud POST al backend
    const response = await api.post('/training/analizar-progreso-fisico', datos);
    
    // Devolvemos el resultado de la respuesta
    return response.data.respuesta; // Asumimos que la respuesta contiene el campo 'respuesta'
  } catch (error) {
    console.error("Error al consultar el backend:", error);
    return null;
  }
};