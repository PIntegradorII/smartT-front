import api from "../../app/services/api"; // Importar la instancia de API

export const getTrainingPlanByGoogleId = async (googleId: string) => {
  try {
    const response = await api.get(`/training/training-plan/google/${googleId}`);

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el plan de entrenamiento:", error);
    return null;
  }
};
