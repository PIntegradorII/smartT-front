import api from "../../app/services/api"; // Importamos la configuración base de Axios

// Crear un nuevo registro en personal_data
export const speech_to_text = async (audioBlob, googleId) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('google_id', googleId);  // Cambiado a google_id
    
    const response = await api.post("/diet/voice-to-text/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error detallado:", {
      request: error.config,
      response: error.response?.data
    });
    throw error;
  }
};
export const getNutritionPlan = async (googleId) => {
  try {
    const response = await api.get(`/diet/nutrition-plan/${googleId}`);
    
    if (!response.data?.plan) {
      throw new Error("Plan nutricional no encontrado");
    }

    // Si el backend devuelve el plan como string JSON
    if (typeof response.data.plan === 'string') {
      try {
        return JSON.parse(response.data.plan);
      } catch (e) {
        console.error("Error parsing nutrition plan:", e);
        throw new Error("Formato de plan nutricional inválido");
      }
    }
    
    // Si ya viene como objeto
    return response.data.plan;
  } catch (error) {
    console.error("Error fetching nutrition plan:", {
      request: error.config,
      response: error.response?.data,
      error: error.message
    });
    throw error;
  }
};

export const regenerateNutritionPlan = async (googleId) => {
  try {
    const response = await api.post(`/diet/regenerate-nutrition-plan/${googleId}`);
    return response.data;  // Regresa el plan actualizado
  } catch (error) {
    console.error("Error al regenerar el plan nutricional:", error);
    throw error;
  }
};