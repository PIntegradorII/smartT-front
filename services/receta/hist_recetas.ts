import api from "../../app/services/api"; // Importar la instancia de API

export const getDataRecetaHistory = async (googleId: string) => {
  try {
    const response = await api.get(`/hist_recetas/history/${googleId}`);

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el historial de recetas:", error);
    return null;
  }
};
