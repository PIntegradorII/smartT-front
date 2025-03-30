import api from "../../app/services/api"; // Importamos la configuración base de Axios

// Crear un nuevo registro en personal_data
export const speech_to_text = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav'); // Nombre del archivo importante
      
      const response = await api.post("/diet/voice-to-text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      throw error;
    }
};