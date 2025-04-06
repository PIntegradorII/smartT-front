import api from "../../app/services/api"; // Importar la instancia de API

export const getDataTrainingHistory = async (googleId: string) => {
  try {
    const response = await api.get(`/training_plan_history/history/${googleId}`);

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el plan de entrenamiento:", error);
    return null;
  }
};
