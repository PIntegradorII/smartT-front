import api from "../../app/services/api";

export const logExercise = async (file: File) => {
  const formData = new FormData();
  //formData.append("google_id", googleId);
  formData.append("file", file); // 👈 clave debe coincidir con lo que espera FastAPI

  try {
    const response = await api.post(`/img_platos/analyze_food`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al identificar la imagen:", error);
    throw error;
  }
};
