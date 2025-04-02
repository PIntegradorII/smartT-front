import api from "../../app/services/api"; // Importar la configuración base de Axios

// Generar receta a partir del archivo de audio y googleId
export const generarReceta = async (googleId: string, audioFile: File) => {
  try {
    // Crear un objeto FormData
    const formData = new FormData();
    // Agregar el archivo de audio al FormData
    formData.append("audio", audioFile, "audio.wav"); // Especificar el nombre del archivo
    // Agregar el google_id al FormData
    formData.append("google_id", googleId);

    // Enviar la solicitud POST con el FormData
    const response = await api.post("/ingredientes/voice-to-recipes/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Especificamos que es una solicitud de tipo multipart/form-data
      },
    });

    return response.data; // Retornar los datos de la respuesta
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error detallado:", {
        message: error.message,
        response: (error as any)?.response?.data,
        config: (error as any)?.config,
      });
    } else {
      console.error("Error desconocido:", error);
    }
    throw error; // Lanzar el error para manejarlo más arriba si es necesario
  }
};
