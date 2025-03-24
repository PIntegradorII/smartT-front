import api from "../../app/services/api"; // Importar la instancia de API

export const getWeeklyExercises = async (googleId: string) => {
  try {
    const response = await api.post("/log_exercises/exercise/weekly/", {
      google_id: googleId,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener ejercicios semanales:", error);
    return null;
  }
};
